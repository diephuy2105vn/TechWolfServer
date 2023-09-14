import Product from "../models/product";
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
};

export default apiController;
