import { getOrders } from "@/controllers/order";
import { isAuth } from "@/middlewares/auth";
import { Router } from "express";

const orderRouter = Router();

orderRouter.get("/", isAuth, getOrders);

export default orderRouter;
