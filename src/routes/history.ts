import { updateBookHistory } from "@/controllers/history";
import { isAuth, isPurchasedByTheUser } from "@/middlewares/auth";
import { historyValidationSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const historyRouter = Router();

historyRouter.post(
  "/",
  isAuth,
  validate(historyValidationSchema),
  isPurchasedByTheUser,
  updateBookHistory
);

export default historyRouter;
