import AuthorModel from "@/models/author";
import UserModel from "@/models/user";
import { RequestAuthorHandler } from "@/types";
import { sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";
import slugify from "slugify";

export const registerAuthor: RequestAuthorHandler = async (req, res) => {
  const { body, user } = req;
  if (!user.signedUp) {
    return sendErrorResponse({
      message: "User must be signed up before registering as author!",
      status: 401,
      res,
    });
  }

  const newAuthor = new AuthorModel({
    name: body.name,
    about: body.about,
    userId: user.id,
    socialLinks: body.socialLinks,
  });

  const uniqueSlug = slugify(`${newAuthor.name} ${newAuthor._id}`, {
    lower: true,
    replacement: "-",
  });

  newAuthor.slug = uniqueSlug;
  await newAuthor.save();

  await UserModel.findByIdAndUpdate(user.id, {
    role: "author",
    authorId: newAuthor._id,
  });

  res.json({ message: "Thanks for registering as an author." });
};

export const updateAuthor: RequestAuthorHandler = async (req, res) => {
  const { body, user } = req;

  await AuthorModel.findByIdAndUpdate(user.authorId, {
    name: body.name,
    about: body.about,
    socialLinks: body.socialLinks,
  });

  res.json({ message: "Your details updated successfully." });
};

export const getAuthorDetails: RequestHandler = async (req, res) => {
  const { slug } = req.params;

  const author = await AuthorModel.findOne({ slug });
  if (!author)
    return sendErrorResponse({
      res,
      message: "Author not found!",
      status: 404,
    });

  res.json({
    id: author._id,
    name: author.name,
    about: author.about,
    socialLinks: author.socialLinks,
  });
};
