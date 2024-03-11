import mongoose from "mongoose";
import Detail from "./detail";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const CartSchema = new Schema(
    {
        user: {
            type: ObjectId,
            ref: "User",
            require: true,
        },
        details: [{ type: ObjectId, ref: "Detail" }],
    },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

CartSchema.virtual("totalPrice").get(function () {
    return this.details.reduce(
        (accumulator, detail) => accumulator + detail.totalPrice,
        0
    );
});

CartSchema.pre(
    "deleteOne",
    { document: true, query: true },
    async function (next) {
        try {
            const cart = Object(this);

            if (cart.details?.length > 0) {
                await Promise.all(
                    cart.details?.map(async (detail) => {
                        await Detail.findByIdAndRemove(detail._id);
                    })
                );
            }
            next();
        } catch (err) {
            console.log(err);
        }
    }
);

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;
