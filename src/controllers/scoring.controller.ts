import fs from "fs";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Scoring } from "../entity/Scoring.entity";
import { Employee } from "../entity/Employee.entity";


export class ScoringController {

    static async requestForScoring(req: Request, res: Response) {

        const { employee_id } = req.params;

        const scoringRepository = AppDataSource.getRepository(Scoring);
        const employeeScoring = await scoringRepository.findOne({ where: { employee: parseInt(employee_id), is_closed: false } });

        if (employeeScoring.start_time) {
            employeeScoring.end_time = new Date();
            employeeScoring.is_closed = true;
            await scoringRepository.save(employeeScoring);
            res.status(200).json({ message: "The end day scoring is ok" })
        } else {
            employeeScoring.start_time = new Date();
            await scoringRepository.save(employeeScoring);
            res.status(200).json({ message: "The start day scoring is ok" })
        }

    }

    static async doScoring(req: Request, res: Response) {

        const { employee_id } = req.params;
        const profile = req.file?.path;

        const scoringRepository = AppDataSource.getRepository(Scoring);
        const employeeScoring = await scoringRepository.findOne({ where: { employee: parseInt(employee_id), is_closed: false } });

        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({ where: { id: employee_id } });

        if (employeeScoring) {

            var CloudmersiveImageApiClient = require('cloudmersive-image-api-client');
            var defaultClient = CloudmersiveImageApiClient.ApiClient.instance;

            // Configure API key authorization: Apikey
            var Apikey = defaultClient.authentications['Apikey'];
            Apikey.apiKey = process.env.CLOUDMERSIVE_API_KEY;

            var apiInstance = new CloudmersiveImageApiClient.FaceApi();
            var inputImage = /*profile;*/ Buffer.from(fs.readFileSync(profile)); // File | Image file to perform the operation on; this image can contain one or more faces which will be matched against face provided in the second image.  Common file formats such as PNG, JPEG are supported.
            var matchFace = Buffer.from(fs.readFileSync(employee.profile).buffer); // File | Image of a single face to compare and match against.

            var callback = async function(error, data, response) {
                if (error) {
                    // console.error(error);
                    res.status(500).json({data: error});
                } else {
                    console.log('API called successfully. Returned data: ' + data);

                    if(data.Successful) {


                        if (employeeScoring.start_time) {
                            employeeScoring.end_time = new Date();
                            employeeScoring.is_closed = true;
                            await scoringRepository.save(employeeScoring);
                            res.status(200).json({ message: "The end day scoring is ok" })
                        } else {
                            employeeScoring.start_time = new Date();
                            await scoringRepository.save(employeeScoring);
                            res.status(200).json({ message: "The start day scoring is ok" })
                        }

                    } else {
                        res.status(403).json({ message: "Face not recognized please try again" });
                    }
                }
            };
            apiInstance.faceCompare(inputImage, matchFace, callback);

        } else {
            res.status(403).json({ message: "Internal server error" });
        }

    }

}