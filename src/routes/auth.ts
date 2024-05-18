import { generateAuthLink, verifyAuthToken } from "@/controllers/auth";
import { emailValidationSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const authRouter = Router();

authRouter.post(
  "/generate-link",
  validate(emailValidationSchema),
  generateAuthLink
);
authRouter.get("/verify", verifyAuthToken);

export default authRouter;
