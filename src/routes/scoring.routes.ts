import * as express from "express";
import { ScoringController } from "../controllers/scoring.controller";
import { uploadImage } from "../middleware/multer";

const Router = express.Router();

Router.post("/requestForScoring/:employee_id", ScoringController.requestForScoring);
Router.put("/validatedScoringRequest/:scoring_request_id", ScoringController.validateScoringRequest);
Router.put("/rejectedScoringRequest/:scoring_request_id", ScoringController.rejectScoringRequest);
Router.post("/doScoring/:employee_id", uploadImage.single("profile"), ScoringController.doScoring);
Router.get("/getScoringRequest", ScoringController.getScoringRequest);

export { Router as scoringRouter };