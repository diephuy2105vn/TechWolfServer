import express from "express";
import profileController from "../controllers/profileController";
import authUserMiddleWare from "../middleware/authUserMiddleware";
const router = express.Router();

router.post("/:id", authUserMiddleWare, profileController.update);

export default router;
