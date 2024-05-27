import BookModel, { BookDoc } from "@/models/book";
import { CreateBookRequestHandler, UpdateBookRequestHandler } from "@/types";
import {
  formatFileSize,
  generateS3ClientPublicUrl,
  sendErrorResponse,
} from "@/utils/helper";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { Types } from "mongoose";
import slugify from "slugify";
import fs from "fs";
import s3Client from "@/cloud/aws";
import {
  generateFileUploadUrl,
  uploadBookToAws,
  uploadBookToLocalDir,
  uploadCoverToCloudinary,
} from "@/utils/fileUpload";
import AuthorModel from "@/models/author";
import path from "path";
import cloudinary from "@/cloud/cludinary";

export const createNewBook: CreateBookRequestHandler = async (req, res) => {
  const { body, files, user } = req;

  const {
    title,
    description,
    genre,
    language,
    fileInfo,
    price,
    publicationName,
    publishedAt,
    uploadMethod,
  } = body;

  const { cover, book } = files;

  const newBook = new BookModel<BookDoc>({
    title,
    description,
    genre,
    language,
    fileInfo: { size: formatFileSize(fileInfo.size), id: "" },
    price,
    publicationName,
    publishedAt,
    slug: "",
    author: new Types.ObjectId(user.authorId),
  });

  let fileUploadUrl = "";

  newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
    lower: true,
    replacement: "-",
  });

  const fileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
    lower: true,
    replacement: "-",
  });

  if (uploadMethod === "local") {
    // if you are not using AWS use the following logic
    if (
      !book ||
      Array.isArray(book) ||
      book.mimetype !== "application/epub+zip"
    ) {
      return sendErrorResponse({
        message: "Invalid book file!",
        status: 422,
        res,
      });
    }

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      // if you are using cloudinary use this method
      newBook.cover = await uploadCoverToCloudinary(cover);
    }

    uploadBookToLocalDir(book, fileName);
  }

  if (uploadMethod === "aws") {
    // if you are using AWS use the following logic
    fileUploadUrl = await generateFileUploadUrl(s3Client, {
      bucket: process.env.AWS_PRIVATE_BUCKET!,
      contentType: fileInfo.type,
      uniqueKey: fileName,
    });

    // this will upload cover to the cloud
    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.png`, {
        lower: true,
        replacement: "-",
      });

      newBook.cover = await uploadBookToAws(cover.filepath, uniqueFileName);
    }
  }

  newBook.fileInfo.id = fileName;
  await AuthorModel.findByIdAndUpdate(user.authorId, {
    $push: {
      books: newBook._id,
    },
  });
  await newBook.save();
  res.send(fileUploadUrl);
};

export const updateBook: UpdateBookRequestHandler = async (req, res) => {
  const { body, files, user } = req;

  const {
    title,
    description,
    genre,
    language,
    fileInfo,
    price,
    publicationName,
    publishedAt,
    uploadMethod,
    slug,
  } = body;

  const { cover, book: newBookFile } = files;

  const book = await BookModel.findOne({
    slug,
    author: user.authorId,
  });

  if (!book) {
    return sendErrorResponse({
      message: "Book not found!",
      status: 404,
      res,
    });
  }

  book.title = title;
  book.description = description;
  book.language = language;
  book.publicationName = publicationName;
  book.genre = genre;
  book.publishedAt = publishedAt;
  book.price = price;

  if (uploadMethod === "local") {
    if (
      newBookFile &&
      !Array.isArray(newBookFile) &&
      newBookFile.mimetype === "application/epub+zip"
    ) {
      // remove old book file (epub) from storage
      const uploadPath = path.join(__dirname, "../books");
      const oldFilePath = path.join(uploadPath, book.fileInfo.id);

      if (!fs.existsSync(oldFilePath))
        return sendErrorResponse({
          message: "Book file not found!",
          status: 404,
          res,
        });

      fs.unlinkSync(oldFilePath);

      // add new book to the storage
      const newFileName = slugify(`${book._id} ${book.title}`, {
        lower: true,
        replacement: "-",
      });
      const newFilePath = path.join(uploadPath, newFileName);
      const file = fs.readFileSync(newBookFile.filepath);
      fs.writeFileSync(newFilePath, file);

      book.fileInfo = {
        id: newFileName,
        size: formatFileSize(fileInfo?.size || newBookFile.size),
      };
    }

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      // remove old cover file if exists
      if (book.cover?.id) {
        await cloudinary.uploader.destroy(book.cover.id);
      }
      book.cover = await uploadCoverToCloudinary(cover);
    }
  }

  let fileUploadUrl = "";
  if (uploadMethod === "aws") {
    if (
      newBookFile &&
      !Array.isArray(newBookFile) &&
      newBookFile.mimetype === "application/epub+zip"
    ) {
      // remove the old book from cloud (bucket)
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.AWS_PRIVATE_BUCKET,
        Key: book.fileInfo.id,
      });

      await s3Client.send(deleteCommand);

      // generate (sign) new url to upload book
      const fileName = slugify(`${book._id} ${book.title}.epub`, {
        lower: true,
        replacement: "-",
      });
      fileUploadUrl = await generateFileUploadUrl(s3Client, {
        bucket: process.env.AWS_PRIVATE_BUCKET!,
        contentType: fileInfo?.type || newBookFile.mimetype,
        uniqueKey: fileName,
      });
    }

    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      // remove old cover from the cloud (bucket)
      if (book.cover?.id) {
        const deleteCommand = new DeleteObjectCommand({
          Bucket: process.env.AWS_PUBLIC_BUCKET,
          Key: book.cover.id,
        });
        await s3Client.send(deleteCommand);
      }
      // upload new cover to the cloud (bucket)
      const uniqueFileName = slugify(`${book._id} ${book.title}.png`, {
        lower: true,
        replacement: "-",
      });

      book.cover = await uploadBookToAws(cover.filepath, uniqueFileName);
    }
  }

  await book.save();

  res.send(fileUploadUrl);
};
