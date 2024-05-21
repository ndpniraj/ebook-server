import {
  generateAuthLink,
  sendProfileInfo,
  verifyAuthToken,
} from "@/controllers/auth";
import { isAuth } from "@/middlewares/auth";
import { emailValidationSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const authRouter = Router();

authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink
);
authRouter.get("/verify", verifyAuthToken);
authRouter.get("/profile", isAuth, sendProfileInfo);

export default authRouter;
