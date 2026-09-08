import { Router } from "express";
import createListingController from "../controllers/listing.controller";
import { verifyToken } from "../middleware/auth.middleware";
const router = Router()

router.post("/",verifyToken, createListingController);


export default router;
