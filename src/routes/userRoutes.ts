import express from "express";
import { validateSignup } from "../middleware/validation/validateSignup";
import { login, signup } from "../controllers/authController";
import { getUsers } from "../controllers/userController";

const router = express.Router();

router.post("/signup", validateSignup, signup);
router.post("/login", login);

router.get("/", getUsers);
export default router;
