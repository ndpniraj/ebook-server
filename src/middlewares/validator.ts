import { RequestHandler } from "express";
import { ZodRawShape, z } from "zod";

export const emailValidationSchema = {
  email: z
    .string({
      required_error: "Email is missing!",
      invalid_type_error: "Invalid email type!",
    })
    .email("Invalid email!"),
};

export const validate = <T extends ZodRawShape>(obj: T): RequestHandler => {
  return (req, res, next) => {
    const schema = z.object(obj);

    const result = schema.safeParse(req.body);

    if (result.success) {
      req.body = result.data;
      next();
    } else {
      const errors = result.error.flatten().fieldErrors;
      return res.status(422).json({ errors });
    }
  };
};
