import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const DetailSchema = new Schema({
    product: { type: ObjectId, ref: "Product" },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, require: true },
    isOrder: { type: Boolean, default: false },
});

const Detail = mongoose.model("Detail", DetailSchema);

export default Detail;
