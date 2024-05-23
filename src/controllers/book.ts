import BookModel, { BookDoc } from "@/models/book";
import { CreateBookRequestHandler } from "@/types";
import { uploadCoverToCloudinary } from "@/utils/fileUpload";
import { formatFileSize } from "@/utils/helper";
import { Types } from "mongoose";
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

  const { cover } = files;

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

  newBook.slug = slugify(`${newBook.title} ${newBook._id}`, {
    lower: true,
    replacement: "-",
  });

  if (cover && !Array.isArray(cover)) {
    // if you are using cloudinary use this method
    newBook.cover = await uploadCoverToCloudinary(cover);
  }

  await newBook.save();
};
