import Cart from "../models/cart";
import Detail from "../models/detail";
const apiController = {
    getCart: async function (req, res, next) {
        try {
            const userId = req.params.id;

            const cart = await Cart.findOne({ user: userId })
                .populate({ path: "details", populate: { path: "product" } })
                .lean();
            if (!cart) {
                res.status(400).json({
                    status: "Error",
                    message: "Không có giỏ hàng",
                });
                return;
            }
            console.log(cart);
            res.status(200).json({ status: "Success", data: cart });
        } catch (err) {
            res.status(500).json({
                status: "Error",
                message: "Đã có lỗi xảy ra",
            });
        }
    },
    addDetail: async function (req, res, next) {
        try {
            const userId = req.params.id;
            const detailReq = req.body.data; // Co Product va quantity

            detailReq.totalPrice = detailReq.product.price * detailReq.quantity;

            const cart = await Cart.findOne({ user: userId }).populate({
                path: "details",
            });
            if (!cart) {
                res.status(400).json({
                    status: "Error",
                    data: "Không có giỏ hàng",
                });
                return;
            }
            const detailInCart = cart.details.find(
                (detail) => detail.product._id == detailReq.product._id
            );

            if (detailInCart) {
                const detail = await Detail.findById(detailInCart._id);
                detail.quantity += detailReq.quantity;
                detail.totalPrice += detailReq.totalPrice;
                cart.totalPrice += detailReq.totalPrice;
                await detail.save();
                await cart.save();
                res.status(200).json({ status: "Success", data: cart });
                return;
            }
            const newDetail = await new Detail({
                product: detailReq.product._id,
                quantity: detailReq.quantity,
                totalPrice: detailReq.totalPrice,
            });
            cart.details = [...cart.details, newDetail._id];
            cart.totalPrice += newDetail.totalPrice;
            await newDetail.save();
            await cart.save();

            res.status(200).json({ status: "Success", data: cart });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: "Error", data: "Đã có lỗi xảy ra" });
        }
    },
    deleteDetail: async function (req, res, next) {
        try {
            const userId = req.params.id;
            const detailReq = req.body.data;
            const cart = await Cart.findOne({ user: userId }).populate({
                path: "details",
                populate: { path: "product" },
            });

            console.log(cart);
            if (!cart) {
                res.status(400).json({
                    status: "Error",
                    data: "Không có giỏ hàng",
                });
                return;
            }
            cart.details = cart.details.filter(
                (detail) => detail._id !== detailReq._id
            );
            await Detail.findByIdAndRemove(detailReq._id);
            await cart.save();
            res.status(200).json({ status: "Success", data: cart.toJSON() });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: "Error", data: "Đã có lỗi xảy ra" });
        }
    },
};

export default apiController;
