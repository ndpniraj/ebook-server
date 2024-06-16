import UserModel from "@/models/user";
import { AddReviewRequestHandler } from "@/types";
import { formatUserProfile, sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        name?: string;
        email: string;
        role: "user" | "author";
        avatar?: string;
        signedUp: boolean;
        authorId?: string;
      };
    }
  }
}

export const isAuth: RequestHandler = async (req, res, next) => {
  const authToken = req.cookies.authToken;

  // send error response if there is no token
  if (!authToken) {
    return sendErrorResponse({
      message: "Unauthorized request!",
      status: 401,
      res,
    });
  }

  // otherwise find out if the token is valid or signed by this same server
  const payload = jwt.verify(authToken, process.env.JWT_SECRET!) as {
    userId: string;
  };

  // if the token is valid find user from the payload
  // if the token is invalid it will throw error which we can handle
  // from inside the error middleware
  const user = await UserModel.findById(payload.userId);
  if (!user) {
    return sendErrorResponse({
      message: "Unauthorized request user not found!",
      status: 401,
      res,
    });
  }

  req.user = formatUserProfile(user);

  next();
};

export const isPurchasedByTheUser: AddReviewRequestHandler = async (
  req,
  res,
  next
) => {
  const user = await UserModel.findOne({
    _id: req.user.id,
    books: req.body.bookId,
  });
  if (!user)
    return sendErrorResponse({
      res,
      message: "Sorry you are not allowed to add review!",
      status: 403,
    });

  next();
};

export const isAuthor: RequestHandler = (req, res, next) => {
  if (req.user.role === "author") next();
  else sendErrorResponse({ message: "Invalid request!", res, status: 401 });
};
