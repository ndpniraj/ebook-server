import { getAuthorDetails, registerAuthor } from "@/controllers/author";
import { isAuth } from "@/middlewares/auth";
import { newAuthorSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const authorRouter = Router();

authorRouter.post(
  "/register",
  isAuth,
  validate(newAuthorSchema),
  registerAuthor
);
authorRouter.get("/:slug", getAuthorDetails);

export default authorRouter;
