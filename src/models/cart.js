import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CartSchema = new Schema({
    user: {
        type: ObjectId,
        ref: "User",
        require: true,
    },
    details: [{ type: ObjectId, ref: "Detail" }],
    totalPrice: { type: Number, default: 0 },
});

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
