import express from "express";
import {
  createQuestion,
  deleteQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} from "../controllers/multiOptionController.js";
import { protect } from "../middleware/auth/protect.middleware.js";
import { restrictTo } from "../middleware/auth/restrictTo.middleware.js";
import { multiOptionBodyValidator } from "../middleware/validation/mulitOptionBodyValidator.middleware.js";
import AppError from "../utils/appError.js";

const router = express.Router();

const ALLOWED_CATEGORIES = ["general", "math", "nature", "sports"] as const;

router.param("category", (req, res, next, category) => {
  const cat = category.toLowerCase();
  if (!ALLOWED_CATEGORIES.includes(cat))
    return next(
      new AppError(
        `${category} is not supported. Use supported categories: ${ALLOWED_CATEGORIES}`,
        400
      )
    );
  req.params.category = cat;
  next();
});
// MORE SPECIFIC ROUTES FIRST
router
  .route("/category/:category/:id")
  .get(getQuestion)
  .patch(protect, restrictTo("admin", "premium"), updateQuestion)
  .delete(protect, restrictTo("admin", "premium"), deleteQuestion);

router
  .route("/category/:category")
  .get(getAllQuestions)
  .post(
    protect,
    restrictTo("admin", "premium"),
    multiOptionBodyValidator,
    createQuestion
  );

router.route("/").get(protect, restrictTo("admin"), getAllQuestions);
export default router;
