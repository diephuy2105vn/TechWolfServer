import express from "express";
import Product from "../models/product";
import apiController from "../controllers/apiController";
const router = express.Router();

router.get("/product", apiController.getMultipleProduct);
router.get("/product/:id", apiController.getProduct);

export default router;
