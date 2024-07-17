import { model, ObjectId, Schema } from "mongoose";

type OrderItem = {
  id: ObjectId;
  price: number;
  qty: number;
  totalPrice: number;
};

interface OrderDocument {
  userId: ObjectId;
  stripeCustomerId: string;
  paymentId: string;
  totalAmount: number;
  paymentStatus: string;
  paymentErrorMessage: string;
  orderItems: OrderItem[];
  createAt: Date;
}

const schema = new Schema<OrderDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    stripeCustomerId: { type: String, required: true },
    paymentId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    paymentStatus: { type: String, required: true },
    paymentErrorMessage: { type: String },
    orderItems: [
      {
        id: { type: Schema.Types.ObjectId, ref: "Book", required: true },
        price: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        qty: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const OrderModel = model<OrderDocument>("Order", schema);
export default OrderModel;
