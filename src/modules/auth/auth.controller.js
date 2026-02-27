import { Router } from "express";
import {
  signup,
  login,
  getUserById,
  generateAccessToken,
  signupGoogle,
} from "./auth.service.js";
import { BadRequestException, successResponse } from "../../common/index.js";
import { auth } from "../../common/middleware/auth.js";
import { loginSchema, signupSchema } from "./auth.validation.js";
import { validation } from "../../common/utils/validation/validation.js";
const router = Router();

router.post("/signup",validation(signupSchema), async (req, res) => {
  
  let user = await signup(req.body);
  successResponse({
    res,
    message: "user created successfully",
    status: 201,
    data: user,
  });
});
router.post("/login",validation(loginSchema), async (req, res) => {
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

router.post("/signup/gmail", async (req, res) => {
  const data = await signupGoogle(req.body);
  successResponse({
    res,
    message: "user created successfully with google",
    status: 201,
    data,
  });
});
export default router;
