import BookModel, { BookDoc } from "@/models/book";
import { CreateBookRequestHandler } from "@/types";
import { uploadCoverToCloudinary } from "@/utils/fileUpload";
import { formatFileSize, sendErrorResponse } from "@/utils/helper";
import { Types } from "mongoose";
import path from "path";
import fs from "fs";
import slugify from "slugify";

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
  } = body;

  const { cover, book } = files;

  const newBook = new BookModel<BookDoc>({
    title,
    // description,
    // genre,
    // language,
    // fileInfo: { size: formatFileSize(fileInfo.size), id: "" },
    // price,
    // publicationName,
    // publishedAt,
    // slug: "",
    // author: new Types.ObjectId(user.authorId),
  });

  newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
    lower: true,
    replacement: "-",
  });

  if (cover && !Array.isArray(cover)) {
    // if you are using cloudinary use this method
    newBook.cover = await uploadCoverToCloudinary(cover);
  }

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

  const bookStoragePath = path.join(__dirname, "../books");

  if (!fs.existsSync(bookStoragePath)) {
    fs.mkdirSync(bookStoragePath);
  }

  const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.epub`, {
    lower: true,
    replacement: "-",
  });
  const filePath = path.join(bookStoragePath, uniqueFileName);

  fs.writeFileSync(filePath, fs.readFileSync(book.filepath));

  // await newBook.save();
  res.send();
};
