import express from "express";
const router = express.Router();
import { protectRoute } from "../middleware/protectRoute.js";
import { deleteNotification, getNotification } from "../controllers/notification.controller.js";

router.get("/", protectRoute, getNotification);
router.delete("/", protectRoute, deleteNotification);

export default router;
