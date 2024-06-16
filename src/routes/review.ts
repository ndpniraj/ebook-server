import { addReview } from "@/controllers/reivew";
import { isAuth } from "@/middlewares/auth";
import { newReviewSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter.post(
  "/add",
  isAuth,
  // TODO: Apply middleware to find book purchase.
  validate(newReviewSchema),
  addReview
);

export default reviewRouter;
