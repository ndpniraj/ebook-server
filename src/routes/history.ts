import { updateBookHistory } from "@/controllers/history";
import { isAuth } from "@/middlewares/auth";
import { Router } from "express";

const historyRouter = Router();

historyRouter.post("/", isAuth, updateBookHistory);

export default historyRouter;
