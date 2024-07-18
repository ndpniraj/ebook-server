import { BookDoc } from "@/models/book";
import OrderModel from "@/models/order";
import UserModel from "@/models/user";
import { RequestHandler } from "express";
import { isValidObjectId } from "mongoose";

export const getOrders: RequestHandler = async (req, res) => {
  const orders = await OrderModel.find({
    userId: req.user.id,
  }).populate<{
    orderItems: {
      id: BookDoc;
      price: number;
      qty: number;
      totalPrice: number;
    }[];
  }>("orderItems.id");

  res.json({
    orders: orders.map((item) => {
      return {
        id: item._id,
        stripeCustomerId: item.stripeCustomerId,
        paymentId: item.paymentId,
        totalAmount: item.totalAmount
          ? (item.totalAmount / 100).toFixed(2)
          : "0",
        paymentStatus: item.paymentStatus,
        date: item.createdAt,
        orderItem: item.orderItems.map(
          ({ id: book, price, qty, totalPrice }) => {
            return {
              id: book._id,
              title: book.title,
              cover: book.cover?.url,
              qty,
              price: (price / 100).toFixed(2),
              totalPrice: (totalPrice / 100).toFixed(2),
            };
          }
        ),
      };
    }),
  });
};

export const getOrderStatus: RequestHandler = async (req, res) => {
  const { bookId } = req.params;

  let status = false;

  if (!isValidObjectId(bookId)) return res.json({ status });

  const user = await UserModel.findOne({ _id: req.user.id, books: bookId });
  if (user) status = true;

  res.json({ status });
};
