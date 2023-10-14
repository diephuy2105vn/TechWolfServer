import Cart from "../models/cart";

const getCart = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ user: userId }).populate({
                path: "details",
                match: { isOrder: false },
                populate: { path: "product" },
            });

            if (!cart) {
                throw new Error("UserId không hợp lệ");
            }
            resolve(cart);
        } catch (err) {
            reject(err);
        }
    });
};

export default { getCart };
