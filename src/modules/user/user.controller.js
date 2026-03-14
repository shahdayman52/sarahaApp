import { Router } from "express";
import {
  deleteProfile,
  getUserProfile,
  shareProfileLink,
  getProfileByLink,
  updateUserProfile,
} from "./user.service.js";
import { auth } from "../../common/middleware/auth.js";
import { successResponse } from "../../common/index.js";
// import { upload } from "../../common/middleware/multer.js";

const router = Router();

router.get("/get-user-profile", auth, async (req, res) => {
  let data = await getUserProfile(req.userId);
  successResponse({
    res,
    message: "user profile fetched successfully",
    status: 201,
    data,
  });
});

router.get("/get-url-profile", auth, async (req, res) => {
  let data = await shareProfileLink(req.userId);
  successResponse({
    res,
    message: "user profile fetched successfully",
    status: 201,
    data,
  });
});
router.get("/get-profile-by-Url", async (req, res) => {
  let data = await getProfileByLink(req.body);
  successResponse({
    res,
    message: "user profile fetched successfully",
    status: 201,
    data,
  });
});

router.put("/update-user",
  // upload().single("image"),
   auth,
   async (req, res) => {
  let data = await updateUserProfile(req.userId, req.body,req.file);
  successResponse({
    res,
    message: "user profile updated successfully",
    status: 201,
    data,
  });
});
router.delete("/delete-profile", auth, async (req, res) => {
  let data = await deleteProfile(req.userId);
  successResponse({
    res,
    message: "user deleted successfully",
    status: 201,
    data,
  });
});

export default router;
