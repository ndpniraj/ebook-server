import BookModel, { BookDoc } from "@/models/book";
import { CreateBookRequestHandler } from "@/types";
import { formatFileSize, generateS3ClientPublicUrl } from "@/utils/helper";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { Types } from "mongoose";
import slugify from "slugify";
import fs from "fs";
import s3Client from "@/cloud/aws";
import { uploadBookToAws } from "@/utils/fileUpload";

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

  const { cover } = files;

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

  // this will upload cover to the cloud
  if (cover && !Array.isArray(cover) && cover.mimetype?.startsWith("image")) {
    const uniqueFileName = slugify(`${newBook._id} ${newBook.title}.png`, {
      lower: true,
      replacement: "-",
    });

    newBook.cover = await uploadBookToAws(cover.filepath, uniqueFileName);
  }

  // await newBook.save();
  res.send();
};
