import { checkout } from "@/controllers/checkout";
import { isAuth } from "@/middlewares/auth";
import { Router } from "express";

const router = Router();

router.post("/", isAuth, checkout);

export default router;
