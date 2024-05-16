import { Router } from "express";

const authRouter = Router();

authRouter.post("/generate-link", (req, res) => {
  // Generate authentication link
  // and send that link to the users email address
});

export default authRouter;
