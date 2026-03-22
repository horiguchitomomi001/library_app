import express from "express";
import { auth } from "../controllers/authController.mjs";

const router = express.Router();
router.post("/", auth);

export default router;