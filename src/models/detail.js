import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DetailSchema = new Schema(
    {
        product: { type: ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        isOrder: { type: Boolean, default: false },
    },
    { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

DetailSchema.virtual("totalPrice").get(function () {
    return this.product.price * this.quantity;
});

const Detail = mongoose.model("Detail", DetailSchema);

export default Detail;
