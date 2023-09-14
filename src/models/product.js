import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const ProductSchema = new Schema(
    {
        name: { type: String, require: true },
        price: { type: Number, require: true },
        quantity: { type: Number },
        description: String,
        type: String,
        need: String,
        urlImages: [{ type: String, default: [] }],
    },
    {
        timestamps: {
            createdAt: "dateCreate",
            updatedAt: "dateUpdate",
        },
    }
);
ProductSchema.index({ name: "text" });
const Product = mongoose.model("Product", ProductSchema);

export default Product;
