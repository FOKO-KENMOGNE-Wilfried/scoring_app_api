import fs from "fs";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Scoring } from "../entity/Scoring.entity";
import { Employee } from "../entity/Employee.entity";
import { Scoring_Request } from "../entity/Scoring_Request.entity";
import { encrypt } from "../helpers/helpers";
import axios from "axios";
import FormData from "form-data";


export class ScoringController {

    static async getScoringRequest(res: Response){

        const scoringRequestRepository = AppDataSource.getRepository(Scoring_Request);
        const scoringRequests = await scoringRequestRepository.find();

        res.status(200).json(scoringRequests);

    }

    static async requestForScoring(req: Request, res: Response) {

        const { employee_id } = req.params;

        const scoringRequestRepository = AppDataSource.getRepository(Scoring_Request);

        const scoringRequest = new Scoring_Request();
        scoringRequest.employee = parseInt(employee_id);
        scoringRequestRepository.save(scoringRequest);

    }

    static async validateScoringRequest(req: Request, res: Response) {

        const { scoring_request_id } = req.params;

        const scoringRequestRepository = AppDataSource.getRepository(Scoring_Request);
        const scoringRequest = await scoringRequestRepository.findOne(
            { where: {
                id: scoring_request_id
            }
        });

        scoringRequest.is_validated = true;
        await scoringRequestRepository.save(scoringRequest);
        res.status(200).json({ message: "Scoring request validated successfully" });

    }

    static async rejectScoringRequest(req: Request, res: Response) {

        const { scoring_request_id } = req.params;

        const scoringRequestRepository = AppDataSource.getRepository(Scoring_Request);
        const scoringRequest = await scoringRequestRepository.findOne(
            { where: {
                id: scoring_request_id
            }
        });

        scoringRequest.is_rejected = true;
        await scoringRequestRepository.save(scoringRequest);
        res.status(200).json({ message: "Scoring request rejected successfully" });

    }

    static async doScoring(req: Request, res: Response) {

        const { employee_id } = req.params;
        const profile = req.file?.path;

        const scoringRepository = AppDataSource.getRepository(Scoring);
        const employeeScoring = await scoringRepository.findOne({ where: { employee: {id: employee_id}, is_closed: false } });

        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({ where: { id: employee_id } });

        try {
            if (!employeeScoring){
                res.status(200).json({message: "No more scoring permitted"})
            } else {
                const formData = new FormData();
                formData.append('user_id', employee.id);
                formData.append('profile', fs.createReadStream(profile));
                await axios.post('http://127.0.0.1:5000/verify', formData, {
                    headers: formData.getHeaders(),
                }).then(async (response: any) => {
                    console.log(response.data);
                    if (response.status == 400) {
                        res.status(500).json({data: response.error});
                    } else {
                        if(response.status == 200) {
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
                }).catch((err) => {
                    console.error(err.response ? err.response.data : err.message);
                    res.status(500).send(err.response ? err.response.data : 'Erreur interne');
                });
            }

        } catch (error) {
            console.error(error.response ? error.response.data : error.message);
            res.status(500).send(error.response ? error.response.data : 'Erreur interne');
        }
    }

}