import { Router } from "express";
import {createListingController, getListingByIdController, getListingController} from "../controllers/listing.controller";
import { verifyToken } from "../middleware/auth.middleware";
import { createReviewController } from "../controllers/review.controller";
import { upload } from "../config/cloudinary";
const router = Router({ mergeParams: true });

router.post("/:id/review",verifyToken, createReviewController)
router.get("/:id",getListingByIdController);
router.post("/new",verifyToken,upload.single('listing[image]'), createListingController);
router.get("/",getListingController);



export default router;
