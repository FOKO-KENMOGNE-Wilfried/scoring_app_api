import * as express from "express";
import * as jwt from "jsonwebtoken";
import { employeeController } from "../controllers/employee.controller";
import { AuthController } from "../controllers/auth.controller";
import * as dotenv from "dotenv";
import { uploadImage } from "../middleware/multer";
dotenv.config();

const Router = express.Router();

Router.post("/signup", employeeController.signup);

Router.post("/checkCredentials", AuthController.verifyEmployeeCredentials);
Router.post("/login",
uploadImage.single("profile"),
(req: express.Request, res: express.Response, next: express.NextFunction) => {

    const header = req.headers.authorization;
    if(!header) {
        res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    if(!token) {
        res.status(401).json({ message: "Unauthorized" });
    }

    const decode = jwt.verify(token, process.env.JWT_TEMP_SECRET);
    if(!decode) {
        res.status(401).json({ message: "Unauthorized" });
    }

    req[" currentemployee"] = decode;
    next();

}, AuthController.login);

export { Router as authRouter };