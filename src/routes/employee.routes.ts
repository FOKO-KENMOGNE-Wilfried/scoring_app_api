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
  employeeController.getemployees
);

Router.get(
  "/profile",
  authentification,
  authorization(["user", "admin"]),
  AuthController.getProfile
);

Router.post("/signup", employeeController.signup);

Router.post("/login", AuthController.login);

Router.put(
  "/update/:id",
  authentification,
  authorization(["user", "admin"]),
  employeeController.updateEmployee
);

Router.put(
  "/addEmployeeProfile/:employee_id",
  authentification,
  authorization(["user"]),
  uploadImage.single("profile"),
  employeeController.setEmployeeProfile
)

Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  employeeController.deleteemployee
);

export { Router as employeeRouter };