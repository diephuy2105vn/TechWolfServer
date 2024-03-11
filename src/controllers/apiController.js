import Order from "../models/order";
import Product from "../models/product";
import Profile from "../models/profile";
import User from "../models/users";

const apiController = {
    getMultipleProduct: async function (req, res, next) {
        try {
            let sort = {};
            let query = {};
            const page = req.query.page || 1;
            const SIZEPAGE = req.query.size || 12;
            const q = req.query.q || null;
            const types = req.query.types || null;
            const needs = req.query.needs || null;
            if (types) {
                query = { ...query, type: { $in: types } };
            }
            if (needs) {
                query = { ...query, need: { $in: needs } };
            }
            if (req.query.sort) {
                if (req.query.sort == "price-ascending") {
                    sort = { price: 1 };
                } else if (req.query.sort == "price-descending") {
                    sort = { price: -1 };
                } else if (req.query.sort == "name-ascending") {
                    sort = { name: 1 };
                } else if (req.query.sort == "name-descending") {
                    sort = { name: -1 };
                }
            }

            if (q) {
                query = {
                    ...query,
                    $text: { $search: q.trim() },
                };
                sort = { score: { $meta: "textScore" } };
            }
            const totalDocument = await Product.countDocuments(query, {
                score: { $meta: "textScore" },
            });
            const product = await Product.find(query)
                .sort(sort)
                .skip((page - 1) * SIZEPAGE)
                .limit(SIZEPAGE)
                .lean();
            console.log(totalDocument / SIZEPAGE);
            res.json({
                status: "Success",
                totalPage: Math.ceil(totalDocument / SIZEPAGE),
                data: product,
            });
        } catch (err) {
            res.status(404).json({ status: "Error" });
        }
    },

    getProduct: async function (req, res, next) {
        try {
            const product = await Product.findById(req.params.id);
            res.status(200).json({ status: "Success", data: product });
        } catch (err) {
            res.status(404).json({ status: "Error" });
        }
    },
    getMultipleOrder: async function (req, res, next) {
        try {
            let query = {};
            let sort = { dateCreate: 1 };
            const page = req.query.page || 1;
            const SIZEPAGE = req.query.size || 12;
            const status = req.query.status || null;

            if (status) {
                query = { ...query, status: status };
            }
            if (req.query.sort) {
                if (req.query.sort == "date-ascending") {
                    sort = { dateCreate: 1 };
                } else if (req.query.sort == "date-descending") {
                    sort = { dateCreate: -1 };
                } else if (req.query.sort == "name-ascending") {
                    sort = { name: 1 };
                } else if (req.query.sort == "name-descending") {
                    sort = { name: -1 };
                }
            }
            const totalDocument = await Order.countDocuments(query, {
                score: { $meta: "textScore" },
            });

            const order = await Order.find(query)
                .skip(page - 1)
                .limit(SIZEPAGE)
                .sort(sort);
            res.status(200).json({
                status: "Success",
                totalPage: Math.ceil(totalDocument / SIZEPAGE),
                data: order,
            });
        } catch (err) {
            console.log(err);
            res.status(404).json({ status: "Error" });
        }
    },
    getOrder: async function (req, res, next) {
        try {
            const order = await Order.findById(req.params.id).populate({
                path: "details",
                match: { isOrder: true },
                populate: { path: "product" },
            });

            res.status(200).json({ status: "Success", data: order });
        } catch (err) {
            res.status(404).json({ status: "Error" });
        }
    },
    getUser: async function (req, res, next) {
        try {
            const user = await User.find().select("-password -token").lean();
            res.status(200).json({ status: "Success", data: user });
        } catch (err) {
            res.status(404).json({ status: "Error" });
        }
    },
    getProfile: async function (req, res, next) {
        try {
            const userId = req.params.id;
            const profile = await Profile.findOne({ user: userId }).lean();
            res.status(200).json({ status: "Success", data: profile });
        } catch (err) {
            res.status(404).json({ status: "Error" });
        }
    },
    getProfileOrder: async function (req, res, next) {
        try {
            const userId = req.params.id;

            const order = await Order.find({ user: userId }).populate({
                path: "details",
                match: { isOrder: true },
                populate: { path: "product" },
            });

            console.log(order);
            res.status(200).json({ status: "Success", data: order });
        } catch (err) {
            res.status(404).json({ status: "Error" });
        }
    },
};

export default apiController;
