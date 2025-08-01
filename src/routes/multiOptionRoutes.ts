import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestionByCatergory,
  getQuestion,
  updateQuestion,
} from "../controllers/multiOptionController.js";
import AppError from "../utils/appError.js";
import { getAllQuestions } from "../controllers/multiOptionController.js";

const router = express.Router();

const ALLOWED_CATEGORIES = ["general", "math", "nature", "sports"] as const;

router.param("category", (req, res, next, category) => {
  if (!ALLOWED_CATEGORIES.includes(category))
    return next(
      new AppError(
        `${category} is not supported. Use supported categories: ${ALLOWED_CATEGORIES}`,
        404
      )
    );
  next();
});

// returns all questions based on category; and create questions to that category;
router
  .route("/category/:category")
  .get(getAllQuestionByCatergory)
  .post(createQuestion);

//NOTE  this returns a question based on category specificity based on id; this is the right way;
router
  .route("/category/:category/:id")
  .get(getQuestion)
  .patch(updateQuestion)
  .delete(deleteQuestion);

router.route("/").get(getAllQuestions);
export default router;
