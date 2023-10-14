import express from "express";
import Product from "../models/product";
import apiController from "../controllers/apiController";
import authUserMiddleWare from "../middleware/authUserMiddleware";
import authAdminMiddleWare from "../middleware/authAdminMiddleware";
const router = express.Router();

router.get("/product", apiController.getMultipleProduct);
router.get("/order", apiController.getMultipleOrder);
router.get("/product/:id", apiController.getProduct);
router.get("/order/:id", apiController.getOrder);
router.get("/order/:id", apiController.getOrder);
router.get("/account", authAdminMiddleWare, apiController.getUser);
router.get("/profile/:id", authUserMiddleWare, apiController.getProfile);
router.get(
    "/profile/order/:id",
    authUserMiddleWare,
    apiController.getProfileOrder
);

export default router;
