import { Router } from "express";
import { signup, login, getUserById } from "./auth.service.js";
import { successResponse } from "../../common/index.js";
const router = Router();

router.post("/signup", async (req, res) => {
  let user = await signup(req.body);
  successResponse({
    res,
    message: "user created successfully",
    status: 201,
    data: user,
  });
});
router.post("/login", async (req, res) => {
  let loginUser = await login(req.body);
  successResponse({
    res,
    message: "user logged in successfully",
    status: 200,
    data: loginUser,
  });
});

router.get("/get-user-by-id", async (req, res) => {
 let userData = await getUserById(req.headers);
  res.json(userData);
});
export default router;
