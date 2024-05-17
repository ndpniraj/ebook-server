import { Request, Response, RequestHandler } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import VerificationTokenModel from "@/models/verificationToken";
import UserModel from "@/models/user";

export const generateAuthLink: RequestHandler = async (req, res) => {
  // Generate authentication link
  // and send that link to the users email address

  /*
    1. Generate Unique token for every users
    2. Store that token securely inside the database
       so that we can validate it in future.
    3. Create a link which include that secure token and user information
    4. Send that link to users email address.
    5. Notify user to look inside the email to get the login link
  */

  const { email } = req.body;
  let user = await UserModel.findOne({ email });
  if (!user) {
    // if no user found then create new user.
    user = await UserModel.create({ email });
  }

  const userId = user._id.toString();

  // if we already have token for this user it will remove that first
  await VerificationTokenModel.findOneAndDelete({ userId });

  const randomToken = crypto.randomBytes(36).toString("hex");

  await VerificationTokenModel.create<{ userId: string }>({
    userId,
    token: randomToken,
  });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "400b1484957930",
      pass: "e133f5e6c3b34d",
    },
  });

  const link = `http://localhost:8989/verify?token=${randomToken}&userId=${userId}`;

  await transport.sendMail({
    to: user.email,
    from: "verification@myapp.com",
    subject: "Auth Verification",
    html: `
      <div>
        <p>Please click on <a href="${link}">this link</a> to verify you account.</p>
      </div> 
    `,
  });

  res.json({ message: "Please check you email for link." });
};
