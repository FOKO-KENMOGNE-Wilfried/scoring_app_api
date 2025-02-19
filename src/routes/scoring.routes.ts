import * as express from "express";
import { ScoringController } from "../controllers/scoring.controller";
import { uploadImage } from "../middleware/multer";

const Router = express.Router();

Router.post("/requestForScoring/:employee_id", ScoringController.requestForScoring);
Router.post("/doScoring/:employee_id", uploadImage.single("profile"), ScoringController.doScoring);

export { Router as scoringRouter };