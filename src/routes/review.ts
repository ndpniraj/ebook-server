import { addReview } from "@/controllers/reivew";
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth";
import { newReviewSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter.post(
  "/",
  isAuth,
  validate(newReviewSchema),
  isPurchasedByTheUser,
  addReview
);

export default reviewRouter;
