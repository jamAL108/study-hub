import express from "express";
import {
    getYoutubeSearch
} from "./controller.js";

const router = express.Router();
router.post("/getyoutubesearch", getYoutubeSearch);

export default router;