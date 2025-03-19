import * as express from "express";
import { StatController } from "../controllers/stats.controller";

const Router = express.Router();

Router.get("/getStatsByEmployee/:employee_id", StatController.getStatsByEmployee);

export { Router as statsRouter };