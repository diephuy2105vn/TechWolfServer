import Order from "../models/order";
import Detail from "../models/detail";
import authService from "../services/authService";
import Cart from "../models/cart";
import Token from "../models/tokens";
import { Schema } from "mongoose";
import cartService from "../services/cartService";
import mongoose from "mongoose";
import Product from "../models/product";
const orderController = {
    create: async function (req, res, next) {
        // Tạo Trasaction
        // const session = await mongoose.startSession();
        // session.startTransaction();
        try {
            const orderReq = req.body.data;
            const details = orderReq.details;
            const order = await new Order(orderReq);
            const refreshToken = req.cookies["refreshToken"];
            let cart = undefined;
            // Xóa đơn hàng trong giỏ hàng nếu có người dùng đăng nhập
            if (refreshToken) {
                const verifyToken = await authService.verifyToken(refreshToken);
                const token = await Token.findOne({
                    refreshToken: refreshToken,
                });
                order.user = token.user;
                cart = await cartService.getCart(token.user);
            }

            const detailIds = await Promise.all(
                details.map(async (detail) => {
                    // Tìm sản phẩm trong cơ sở dữ liệu
                    const product = await Product.findById(detail.product);

                    // Kiểm tra xem số lượng sản phẩm trong kho có đủ hay không
                    if (product.quantity <= detail.quantity) {
                        throw new Error("Sản phẩm trong kho không đủ");
                    }
                    // Giảm số lượng sản phẩm trong kho
                    product.quantity -= detail.quantity;
                    // Lưu lại sản phẩm
                    await product.save(); // await product.save({session})

                    if (cart) {
                        const detailInCart = cart.details.find(
                            (detailCart) => detailCart._id == detail._id
                        );
                        if (detailInCart) {
                            cart.details = cart.details.filter(
                                (detail) => detail != detailInCart
                            );
                            detailInCart.isOrder = true;
                            await detailInCart.save(); //await detailInCart.save({session});
                            return detailInCart._id;
                        }
                    }
                    const newDetail = await new Detail({
                        product: detail.product,
                        quantity: detail.quantity,
                        isOrder: true,
                    }).populate("product");

                    await newDetail.save(); // await newDetail.save({session})
                    return newDetail._id;
                })
            );
            if (cart) {
                await cart.save(); // await cart.save({session})
            }

            order.details = detailIds;
            await order.save();
            // await session.commitTransaction();
            // session.endSession();
            res.status(200).json({
                status: "Success",
                data: "Đặt hàng thành công",
            });
        } catch (err) {
            console.log(err);
            // await session.abortTransaction();
            // session.endSession();
            res.status(500).json({
                status: "Error",
                data: "Đặt hàng thất bại",
            });
        }
    },
    update: async function (req, res, next) {
        try {
            const orderReq = req.body.data;
            const order = await Order.findByIdAndUpdate(
                req.params.id,
                orderReq,
                { new: true }
            );
            if (!order) {
                throw new Error();
            }

            res.status(200).json({
                success: "Uppdate order successfully!",
            });
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: "Update order failed!" });
        }
    },
    confirm: async function (req, res, next) {
        try {
            const order = await Order.findByIdAndUpdate(req.params.id, {
                status: "Confirm",
            });
            if (!order) {
                throw new Error();
            }

            res.status(200).json({
                success: "Confirm order successfully!",
            });
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: "Confirm order failed!" });
        }
    },
    received: async function (req, res, next) {
        try {
            const order = await Order.findByIdAndUpdate(req.params.id, {
                status: "Received",
            });
            if (!order) {
                throw new Error();
            }

            res.status(200).json({
                success: "Set status order successfully!",
            });
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: "Set status order failed!" });
        }
    },
    destroyMultiple: async function (req, res, next) {
        try {
            const ids = req.body.ids;
            const result = await Order.deleteMany({ _id: { $in: ids } });
            if (!result) {
                throw new Error();
            }
            res.status(200).json({ success: "Delete product successfully" });
        } catch (err) {
            res.status(404).json({ error: "Delete product failed" });
        }
    },
};

export default orderController;
