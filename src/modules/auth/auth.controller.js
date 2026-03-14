import { Router } from "express";
import {
  signup,
  login,
  getUserById,
  generateAccessToken,
  // signupGoogle,
  enable2FA,
  verify2FA,
  confirmLogin,
  updatePassword,
  forgetPassword,
  verifyResetOTP,
  resetPassword,
} from "./auth.service.js";
import { BadRequestException, successResponse } from "../../common/index.js";
import { auth } from "../../common/middleware/auth.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { validation } from "../../common/utils/validation/validation.js";
// import { upload } from "../../common/middleware/multer.js";

const router = Router();

router.post(
  "/signup",
  //  upload().single("image"),
  validation(signupSchema),
  async (req, res) => {
    let user = await signup(req.body, req.file);
    successResponse({
      res,
      message: "user created successfully",
      status: 201,
      data: user,
    });
  },
);
router.post("/login", validation(loginSchema), async (req, res) => {
  let loginUser = await login(req.body, `${req.protocol}://${req.host}`);
  successResponse({
    res,
    message: "user logged in successfully",
    status: 200,
    data: loginUser,
  });
});

router.get("/get-user-by-id", auth, async (req, res) => {
  let userData = await getUserById(req.userId);
  res.json(userData);
});

router.get("/generate-access-token", async (req, res) => {
  let { authorization } = req.headers;
  let accessToken = await generateAccessToken(authorization);

  return successResponse({
    res,
    message: "access token generated successfully",
    status: 200,
    data: accessToken,
  });
});

// router.post("/signup/gmail", async (req, res) => {
//   const data = await signupGoogle(req.body);
//   successResponse({
//     res,
//     message: "user created successfully with google",
//     status: 201,
//     data,
//   });
// });

router.post("/enable-2fa", auth, async (req, res) => {
  const result = await enable2FA(req.userId);
  successResponse({
    res,
    message: "OTP sent to your email",
    data: result,
  });
});

router.post("/verify-2fa", auth, async (req, res) => {
  const result = await verify2FA(req.userId, req.body.otp);
  successResponse({
    res,
    message: "Two-factor authentication enabled",
    data: result,
  });
});
router.post("/confirm-login", async (req, res) => {
  const result = await confirmLogin(req.body);
  successResponse({
    res,
    message: "Login successful",
    data: result,
  });
});

router.patch("/update-password", auth, async (req, res) => {
  const result = await updatePassword(req.userId, req.body);
  successResponse({
    res,
    message: "Password updated successfully",
    data: result,
  });
});

router.post("/forget-password", async (req, res) => {
  const result = await forgetPassword(req.body.email);
  successResponse({
    res,
    message: "OTP sent to email",
    data: result,
  });
});

router.post("/verify-reset-otp", async (req, res) => {
  const result = await verifyResetOTP(req.body.email, req.body.otp);
  successResponse({
    res,
    message: "OTP verified",
    data: result,
  });
});

router.post("/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;
  const result = await resetPassword(email, otp, newPassword);
  successResponse({
    res,
    message: "Password reset successfully",
    data: result,
  });
});
export default router;
