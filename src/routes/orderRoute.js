import express from "express";
import orderController from "../controllers/orderController";
const router = express.Router();

router.delete("/delete", orderController.destroyMultiple);
router.post("/confirm/:id", orderController.confirm);
router.post("/received/:id", orderController.received);
router.put("/:id", orderController.update);
router.post("/", orderController.create);

export default router;
