import express from "express";
import accountController from "../controllers/accountController";
const router = express.Router();

router.delete("/delete", accountController.deleteMultiple);

export default router;
