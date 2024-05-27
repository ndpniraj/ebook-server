import BookModel, { BookDoc } from "@/models/book";
import { CreateBookRequestHandler, UpdateBookRequestHandler } from "@/types";
import {
  formatFileSize,
  generateS3ClientPublicUrl,
  sendErrorResponse,
} from "@/utils/helper";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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

    newBook.fileInfo.id = fileName;

    // this will upload cover to the cloud
    if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
      const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.png`, {
        lower: true,
        replacement: "-",
      });

      newBook.cover = await uploadBookToAws(cover.filepath, uniqueFileName);
    }
  }

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

  const { cover, book } = files;
};
