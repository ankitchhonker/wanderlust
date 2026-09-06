import { Router } from "express";
import createListingController from "../controllers/listing.controller";

const router = Router()

router.post("/",createListingController);


export default router;
