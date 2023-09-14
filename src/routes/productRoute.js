import express from "express";
import Product from "../models/product";
import productController from "../controllers/productController";
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

const cloudinaryV2 = cloudinary.v2;

// configure cloudinary
cloudinaryV2.config({
    cloud_name: "df6gmw5it",
    api_key: "245551815923335",
    api_secret: "sFKfGt9o_VW9CRxgFWoksfXMm2M",
});

// create cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinaryV2,
    params: {
        folder: "product",
        allowed_formats: ["jpeg", "png", "jpg"],
    },
});

async function handleUpload(file) {
    const res = await cloudinary.uploader.upload(file, {
        resource_type: "auto",
    });
    return res;
}

const upload = multer({ storage: storage });

const router = express.Router();

router.put("/:id", upload.array("images"), productController.update);
router.delete("/delete", productController.destroyMultiple);
router.delete("/:id", productController.destroy);
router.post("/", upload.array("images"), productController.create);

export default router;
