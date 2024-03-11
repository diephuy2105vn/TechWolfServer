import Detail from "../models/detail";
import cartService from "../services/cartService";
const apiController = {
    getCart: async function (req, res, next) {
        try {
            const userId = req.params.id;
            const cart = await cartService.getCart(userId);
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
            const detailReq = req.body.data;

            const cart = await cartService.getCart(userId);
            const detailInCart = cart.details.find(
                (detail) => detail.product._id == detailReq.product._id
            );

            if (detailInCart) {
                detailInCart.quantity += detailReq.quantity;
                await detailInCart.save();

                res.status(200).json({ status: "Success", data: cart });
                return;
            }
            const newDetail = await new Detail({
                product: detailReq.product._id,
                quantity: detailReq.quantity,
            }).populate("product");
            cart.details = [...cart.details, newDetail];
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
            const cart = await cartService.getCart(userId);

            cart.details = cart.details.filter((detail) => {
                return detail._id != detailReq._id;
            });

            await Detail.findByIdAndRemove(detailReq._id);
            await cart.save();

            res.status(200).json({ status: "Success", data: cart });
        } catch (err) {
            console.log(err);
            res.status(500).json({ status: "Error", data: "Đã có lỗi xảy ra" });
        }
    },
    changeQuantity: async function (req, res, next) {
        try {
            const userId = req.params.id;
            const detailReq = req.body.data;

            const cart = await cartService.getCart(userId);

            const detailInCart = cart.details.find(
                (detail) => detail.product._id == detailReq.product._id
            );
            if (detailInCart) {
                detailInCart.quantity = detailReq.quantity;

                await detailInCart.save();
                await cart.save();
                res.status(200).json({ status: "Success", data: cart });
            }
        } catch (err) {
            res.status(500).json({ status: "Error", data: "Đã có lỗi xảy ra" });
        }
    },
};

export default apiController;
