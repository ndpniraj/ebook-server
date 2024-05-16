import { generateAuthLink } from "@/controllers/auth";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/generate-link", generateAuthLink);

export default authRouter;
