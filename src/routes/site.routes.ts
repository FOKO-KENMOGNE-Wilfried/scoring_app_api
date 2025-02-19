import * as express from "express";
import { SiteController } from "../controllers/site.controller";

const Router = express.Router();

Router.get("/getEmployeeBySite/:site_id", SiteController.getEmployeeBySite);
Router.post("/addSite", SiteController.addSite);
Router.put("/updateSite/:site_id", SiteController.updateSite);
Router.delete("/deleteSite/:site_id", SiteController.deleteSite);
Router.post("/addEmployeeToSite/:site_id", SiteController.addEmployeeToSite);
Router.delete("/removeEmployeeFromSite/:employee_id", SiteController.removeEmployeeFromSite);

export { Router as siteRouter };