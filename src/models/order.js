import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;
import Detail from "./detail";
const OrderSchema = new Schema(
    {
        name: { type: String, require: true },
        address: { type: String, require: true },
        phone: { type: String, require: true },
        user: {
            type: ObjectId,
            ref: "User",
            require: true,
        },
        details: [{ type: ObjectId, ref: "Detail" }],
        payment: { type: String, required: true },
        status: { type: String, default: "Unconfirm" },
    },
    {
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
        timestamps: {
            createdAt: "dateCreate",
            updatedAt: "dateUpdate",
        },
    }
);

OrderSchema.virtual("totalPrice").get(function () {
    return this.details.reduce(
        (accumulator, detail) => accumulator + detail.totalPrice,
        0
    );
});

OrderSchema.pre("deleteMany", async function (next) {
    const docsToDelete = this.getFilter();
    const orders = await Order.find(docsToDelete);
    await Promise.all(
        orders.map(async (order) => {
            await Detail.deleteMany({ _id: { $in: order.details } });
        })
    );
    next();
});
OrderSchema.pre(
    "deleteOne",
    { document: true, query: true },
    async function (next) {
        const order = this;

        await Promise.all(
            order.details.map(async (detail) => {
                await Detail.findByIdAndRemove(detail._id);
            })
        );
        next();
    }
);

const Order = mongoose.model("Order", OrderSchema);

export default Order;
