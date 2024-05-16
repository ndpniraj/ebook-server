import { Request, Response, RequestHandler } from "express";

export const generateAuthLink: RequestHandler = (req, res) => {
  // Generate authentication link
  // and send that link to the users email address

  console.log(req.body);

  res.json({ ok: true });
};
