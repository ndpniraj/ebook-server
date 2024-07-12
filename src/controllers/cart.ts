import CartModel from "@/models/cart";
import { CartRequestHandler } from "@/types";

// new cart = {userid, products}
// cart => update the count for a specific item from inside that cart
// cart => we want to add new product, we only want to update the count of the product that we already have inside that cart

export const updateCart: CartRequestHandler = async (req, res) => {
  const { items } = req.body;

  let cart = await CartModel.findOne({ userId: req.user.id });

  if (!cart) {
    // it means we need to create a new cart
    cart = await CartModel.create({ userId: req.user.id, items });
  } else {
    // it means we are updating the old cart
    for (const item of items) {
      const oldProduct = cart.items.find(
        ({ product }) => item.product === product.toString()
      );
      if (oldProduct) {
        oldProduct.quantity = item.quantity;
      } else {
        cart.items.push({
          product: item.product as any,
          quantity: item.quantity,
        });
      }
    }

    await cart.save();
  }

  res.json({ cart: cart._id });
};
