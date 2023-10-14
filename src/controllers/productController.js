import Product from "../models/product";
const productController = {
    create: async function (req, res, next) {
        try {
            if (!req.files) {
                return res.status(404).json({ error: "No file uploaded" });
            }
            const product = await new Product(req.body);
            if (!product) {
                throw new Error();
            }
            product.urlImages = req.files.map((file) => file.path);

            await product.save();
            res.status(200).json({
                success: "Create product successfully!",
            });
        } catch (err) {
            console.log(err);
            res.status(404).json({ error: "Create product failed!" });
        }
    },
    update: async function (req, res, next) {
        try {
            const product = await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true }
            );
            if (!product) {
                throw new Error();
            }
            if (req.files.length !== 0) {
                product.urlImages = req.files.map((file) => file.path);
                await product.save();
            }

            res.status(200).json({
                success: "Uppdate product successfully!",
            });
        } catch (err) {
            res.status(404).json({ error: "Update product failed!" });
        }
    },
    destroy: async function (req, res, next) {
        try {
            const id = req.params.id;
            const result = await Product.deleteOne({ _id: id });
            if (!result) {
                throw new Error();
            }
            res.status(200).json({ success: "Delete product successfully" });
        } catch (err) {
            res.status(404).json({ error: "Delete product failed" });
        }
    },
    destroyMultiple: async function (req, res, next) {
        try {
            const ids = req.body.ids;
            const result = await Product.deleteMany({ _id: { $in: ids } });
            if (!result) {
                throw new Error();
            }
            res.status(200).json({ success: "Delete product successfully" });
        } catch (err) {
            res.status(404).json({ error: "Delete product failed" });
        }
    },
};

export default productController;
