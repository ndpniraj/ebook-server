import {
  createNewBook,
  deleteBook,
  generateBookAccessUrl,
  getAllPurchasedBooks,
  getBookByGenre,
  getBooksPublicDetails,
  getRecommendedBooks,
  updateBook,
  updateCopySold,
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
bookRouter.get("/details/:slug", getBooksPublicDetails);
bookRouter.get("/by-genre/:genre", getBookByGenre);
bookRouter.get("/read/:slug", isAuth, generateBookAccessUrl);
bookRouter.get("/recommended/:bookId", getRecommendedBooks);
bookRouter.delete("/:bookId", isAuth, isAuthor, deleteBook);
bookRouter.post("/update-copy-sold", updateCopySold);

export default bookRouter;
