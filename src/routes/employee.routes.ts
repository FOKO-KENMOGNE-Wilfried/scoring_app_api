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
  "/employee/:id",
  authentification,
  authorization(["employee", "admin", "controller"]),
  employeeController.getEmployeeById
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
  authorization(["admin"]),
  employeeController.setEmployeeProfile
)

Router.put(
  "/suspendEmployeeAccount/:employee_id",
  authentification,
  authorization(["admin"]),
  employeeController.suspendEmployeeAccount
)

Router.put(
  "/updateEmployeeRole/:employee_id",
  authentification,
  authorization(["admin"]),
  uploadImage.single("profile"),
  employeeController.updateEmployeeRole
)

Router.delete(
  "/delete/:id",
  authentification,
  authorization(["admin"]),
  employeeController.deleteEmployee
);

export { Router as employeeRouter };