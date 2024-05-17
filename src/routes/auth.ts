import { generateAuthLink } from "@/controllers/auth";
import { Router } from "express";
import { z } from "zod";

const authRouter = Router();

const schema = z.object({
  email: z
    .string({
      required_error: "Email is missing!",
    })
    .email("Zod says it is invalid!"),
});

authRouter.post(
  "/generate-link",
  (req, res, next) => {
    const { email } = req.body;
    // const regex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$");

    // if (!regex.test(email)) {
    //   // sending error response
    //   return res.json({ error: "Invalid email!" });
    // }

    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.log(result);
      const errors = result.error.flatten().fieldErrors;
      return res.status(422).json({ errors });
    }

    result.data.email;

    // john@email.com
    next();
  },
  generateAuthLink
);

export default authRouter;
