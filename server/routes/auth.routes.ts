import express from "express";
import { zodValidate } from "../middleware/zodValidate";
import { registerZodSchema, loginZodSchema } from "../validate/zodSchema";
import { authMiddleware } from "../middleware/authMiddleware";
import { verifyAndRegister, login, sendRegistrationOtp, resendOtp,logout, getMe } from "../controllers/auth.controller";

const router = express.Router();

// Auth routes
// router.post("/register", zodValidate(registerZodSchema), register);

router.post('/verify-and-register', verifyAndRegister);
router.post('/send-registration-otp', zodValidate(registerZodSchema),sendRegistrationOtp);
router.post("/login", zodValidate(loginZodSchema), login);
router.post('/resend-otp', resendOtp);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

export default router;