import BookModel from "@/models/book";
import ReviewModel from "@/models/review";
import { AddReviewRequestHandler } from "@/types";
import { sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import { Types, isValidObjectId } from "mongoose";

export const addReview: AddReviewRequestHandler = async (req, res) => {
  const { bookId, rating, content } = req.body;

  await ReviewModel.findOneAndUpdate(
    { book: bookId, user: req.user.id },
    { content, rating },
    { upsert: true }
  );

  const [result] = await ReviewModel.aggregate<{ averageRating: number }>([
    {
      $match: {
        book: new Types.ObjectId(bookId),
      },
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  await BookModel.findByIdAndUpdate(bookId, {
    averageRating: result.averageRating,
  });

  res.json({
    message: "Review updated.",
  });
};

export const getReview: RequestHandler = async (req, res) => {
  const { bookId } = req.params;

  if (!isValidObjectId(bookId))
    return sendErrorResponse({
      res,
      message: "Book id is not valid!",
      status: 422,
    });

  const review = await ReviewModel.findOne({ book: bookId, user: req.user.id });

  if (!review)
    return sendErrorResponse({
      res,
      message: "Review not found!",
      status: 404,
    });

  res.json({
    content: review.content,
    rating: review.rating,
  });
};
