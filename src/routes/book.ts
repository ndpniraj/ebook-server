import {
  createNewBook,
  getAllPurchasedBooks,
  updateBook,
} from "@/controllers/book";
import { isAuth, isAuthor } from "@/middlewares/auth";
import { fileParser } from "@/middlewares/file";
import {
  newBookSchema,
  updateBookSchema,
  validate,
} from "@/middlewares/validator";
import { Router } from "express";

const bookRouter = Router();

bookRouter.post(
  "/create",
  isAuth,
  isAuthor,
  fileParser,
  validate(newBookSchema),
  createNewBook
);
bookRouter.patch(
  "/",
  isAuth,
  isAuthor,
  fileParser,
  validate(updateBookSchema),
  updateBook
);
bookRouter.get("/list", isAuth, getAllPurchasedBooks);

export default bookRouter;
