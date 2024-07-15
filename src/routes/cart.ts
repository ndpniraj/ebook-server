import { getCart, updateCart } from "@/controllers/cart";
import { isAuth } from "@/middlewares/auth";
import { cartItemsSchema, validate } from "@/middlewares/validator";
import { Router } from "express";

const cartRouter = Router();

cartRouter.post("/", isAuth, validate(cartItemsSchema), updateCart);
cartRouter.get("/", isAuth, getCart);

export default cartRouter;
