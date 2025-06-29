import express from "express";
import {
  createQuestion,
  getAllQuestions,
} from "../controllers/mathController.js";

const router = express.Router();

router.route("/").get(getAllQuestions).post(createQuestion);

export default router;
