import { addReview } from "@/controllers/reivew";
import { isAuth } from "@/middlewares/auth";
import { Router } from "express";

const reviewRouter = Router();

reviewRouter.post(
  "/add",
  isAuth,
  // TODO: Apply middleware to find book purchase.
  // TODO: Apply validator
  addReview
);

export default reviewRouter;
