import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} from "../controllers/trueFalseController.js";

const router = express.Router();

router.route("/:category").get(getAllQuestions).post(createQuestion);
router
  .route("/:category/:id")
  .get(getQuestion)
  .patch(updateQuestion)
  .delete(deleteQuestion);

export default router;
