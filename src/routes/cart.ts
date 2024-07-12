import { updateCart } from "@/controllers/cart";
import { isAuth } from "@/middlewares/auth";
import { Router } from "express";

const cartRouter = Router();

cartRouter.post("/", isAuth, updateCart);

export default cartRouter;
