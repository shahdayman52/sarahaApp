import { Router } from "express";
import { visitProfile, getProfileViews } from "./profileViews.service.js";
import { BadRequestException, successResponse } from "../../common/index.js";
import { auth } from "../../common/middleware/auth.js";

const router = Router();

router.get("/track-view/:profileOwnerId",auth, async (req, res) => {
  let user = await visitProfile(req.userId, req.params.profileOwnerId);
  successResponse({
    res,
    message: "profile viewed successfully",
    data: user,
  });
});

router.get("/get-views",auth, async (req, res) => {
    let views = await getProfileViews(req.userId);
    successResponse({
      res,
      message: "views fetched successfully",
      data: views,
    });
})

export default router;
