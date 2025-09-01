import express from "express";

import {
  forgotPassword,
  login,
  resetPassword,
  signup,
  updatePassword,
} from "../controllers/authController";
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
} from "../controllers/userController";

import { validate } from "../middleware/validation/validate.middleware";

import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  updateMeSchema,
  updatePasswordSchema,
} from "../schemas/auth.schema";
import { protect } from "../middleware/auth/protect.middleware";
import { getMe } from "../middleware/auth/getMe.middleware";
import { restrictTo } from "../middleware/auth/restrictTo.middleware";
import {
  passwordResetLimiter,
  strictAuthLimiter,
} from "../middleware/rateLimit.middleware";

const router = express.Router();

//auth routes
router.post("/signup", strictAuthLimiter, validate(signupSchema), signup);
router.post("/login", strictAuthLimiter, validate(loginSchema), login);
router.post(
  "/forgotPassword",
  passwordResetLimiter,
  validate(forgotPasswordSchema),
  forgotPassword
);
router.patch(
  "/resetPassword/:token",
  passwordResetLimiter,
  validate(resetPasswordSchema),
  resetPassword
);

//user routes
router.use(protect);

router.patch(
  "/updateMyPassword",
  strictAuthLimiter,
  validate(updatePasswordSchema),
  updatePassword
);

router.get("/me", getMe, getUser);
router.patch("/updateMe", validate(updateMeSchema), updateMe);
router.delete("/deleteMe", deleteMe);

router.use(restrictTo("admin"));
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);
router.route("/").get(getAllUsers).post(createUser);

export default router;
