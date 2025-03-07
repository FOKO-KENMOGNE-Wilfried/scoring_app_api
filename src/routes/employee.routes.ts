import * as express from "express";
import { authentification } from "../middleware/authentification.middleware";
import { authorization } from "../middleware/authorization.middleware";
import { employeeController } from "../controllers/employee.controller";
import { AuthController } from "../controllers/auth.controller";
import { uploadImage } from "../middleware/multer";

const Router = express.Router();

Router.get(
  "/users",
  authentification,
  authorization(["admin"]),
  employeeController.getEmployees
);

Router.get(
  "/profile",
  authentification,
  authorization(["employee", "admin"]),
  AuthController.getProfile
);

Router.put(
  "/update/:id",
  authentification,
  authorization(["employee", "admin"]),
  employeeController.updateEmployee
);

Router.put(
  "/addEmployeeProfile/:employee_id",
  authentification,
  authorization(["admin", "employee"]),
  uploadImage.single("profile"),
  employeeController.setEmployeeProfile
)

Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  employeeController.deleteEmployee
);

export { Router as employeeRouter };