import { sendErrorResponse } from "@/utils/helper";
import { RequestHandler } from "express";

export const handlePayment: RequestHandler = (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    return sendErrorResponse({
      res,
      message: "Could not complete payment!",
      status: 400,
    });
  }
};
