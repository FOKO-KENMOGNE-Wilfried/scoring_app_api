import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee.entity";
import { encrypt } from "../helpers/helpers";
import fs from "fs";
import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

export class AuthController {
    static async verifyEmployeeCredentials(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
            res
                .status(500)
                .json({ message: " email and password required" });
            }

            const employeeRepository = AppDataSource.getRepository(Employee);
            // const employee = await employeeRepository.findOne({ where: { email } });
            const employee = await employeeRepository
            .createQueryBuilder("employee")
            .addSelect("employee.password")
            .where("employee.email = :email", { email })
            .getOne();


            const isPasswordValid = encrypt.comparepassword(employee.password, password);
            if (!employee || !isPasswordValid) {
            res.status(404).json({ message: "employee not found" });
            }

            const token = encrypt.generateTempsToken({ id: employee.id });

            res.status(200).json({ message: "Credentials are ok !", token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            // const { email } = req.body;
            const profile = req.file?.path;
            const decode: any = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_TEMP_SECRET);

            const employeeRepository = AppDataSource.getRepository(Employee);
            const employee = await employeeRepository.findOne({ where: { id: decode.id } });

            var CloudmersiveImageApiClient = require('cloudmersive-image-api-client');
            var defaultClient = CloudmersiveImageApiClient.ApiClient.instance;

            // Configure API key authorization: Apikey
            var Apikey = defaultClient.authentications['Apikey'];
            Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;

            var apiInstance = new CloudmersiveImageApiClient.FaceApi();
            var inputImage = /*profile;*/ Buffer.from(fs.readFileSync(profile)); // File | Image file to perform the operation on; this image can contain one or more faces which will be matched against face provided in the second image.  Common file formats such as PNG, JPEG are supported.
            var matchFace = Buffer.from(fs.readFileSync(employee.profile).buffer); // File | Image of a single face to compare and match against.

            var callback = function(error, data, response) {
                if (error) {
                    // console.error(error);
                    res.status(500).json({data: error});
                } else {
                    console.log('API called successfully. Returned data: ' + data);

                    if(data.Successful) {
                        const token = encrypt.generateToken({ id: employee.id });
                        res.status(200).json({ message: "Login successful", employee, token });
                        // res.status(200).json({data: data});
                    } else {
                        res.status(403).json({ message: "Face not recognized please try again" });
                    }
                }
            };
            apiInstance.faceCompare(inputImage, matchFace, callback);

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    static async getProfile(req: Request, res: Response) {
        if (!req[" currentemployee"]) {
            res.status(401).json({ message: "Unauthorized" });
        }
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id: req[" currentemployee"].id },
        });
        res.status(200).json({ ...employee, password: undefined });
    }
}