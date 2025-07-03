import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestionByCatergory,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} from "../controllers/multiOptionController.js";
import AppError from "../utils/appError.js";

const router = express.Router();

const ALLOWED_CATEGORIES = ["general", "math", "nature", "sports"];

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

router
  .route("/category/:category")
  .get(getAllQuestionByCatergory)
  .post(createQuestion);

router
  .route("/category/:category/:id")
  .get(getQuestion)
  .patch(updateQuestion)
  .delete(deleteQuestion);

router.route("/").get(getAllQuestions).post(createQuestion);

router
  .route("/:id")
  .get(getQuestion)
  .patch(updateQuestion)
  .delete(deleteQuestion);

export default router;
