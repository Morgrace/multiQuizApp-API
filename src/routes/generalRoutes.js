import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} from "../controllers/generalController.js";

const router = express.Router();

router.route("/").get(getAllQuestions).post(createQuestion);

router
  .route("/:id")
  .get(getQuestion)
  .patch(updateQuestion)
  .delete(deleteQuestion);

export default router;
