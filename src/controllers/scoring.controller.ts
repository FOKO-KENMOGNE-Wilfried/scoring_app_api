import fs from "fs";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Scoring } from "../entity/Scoring.entity";
import { Employee } from "../entity/Employee.entity";
import { Scoring_Request } from "../entity/Scoring_Request.entity";
import axios from "axios";
import FormData from "form-data";
import { io } from "..";


export class ScoringController {

    static async getScoringRequest(req: Request, res: Response){

        const scoringRequestRepository = AppDataSource.getRepository(Scoring_Request);
        const scoringRequests = await scoringRequestRepository
            .createQueryBuilder("scoring_request")
            .leftJoinAndSelect("scoring_request.employee", "employee")
            .where("scoring_request.is_validated = :is_validated", { is_validated: false })
            .andWhere("scoring_request.is_rejected = :is_rejected", { is_rejected: false })
            .getMany();

        res.status(200).json({ scoringRequests });

    }

    static async requestForScoring(req: Request, res: Response) {

        const { employee_id } = req.params;

        const scoringRequestRepository = AppDataSource.getRepository(Scoring_Request);
        const employeeRepository = AppDataSource.getRepository(Employee);
        const scoringRepository = AppDataSource.getRepository(Scoring);

        const employeeScoring = await scoringRepository.findOne({
            where: { employee: { id: employee_id }, is_closed: false },
        });

        if (!employeeScoring) {
            res.status(200).json({ message: "No more scoring permitted" });
        } else {
            const scoringRequest = new Scoring_Request();
            scoringRequest.employee = await employeeRepository.findOne({ where: { id: employee_id } });
            scoringRequestRepository.save(scoringRequest)
                .then(() => {
                    io.on("connection", (socket) => {
                        socket.emit("newData", { scroringRequest: scoringRequest});
                    })
                })

            res.status(200).json({ message: "Scoring request have been send successdully !" })
        }


    }

    static async validateScoringRequest(req: Request, res: Response) {
        try {
            const scoring_request_id = parseInt(req.params.scoring_request_id, 10);

            const scoringRequestRepository = AppDataSource.getRepository(Scoring_Request);
            const scoringRequest = await scoringRequestRepository
                .createQueryBuilder("scoring_request")
                .leftJoinAndSelect("scoring_request.employee", "employee")
                .where("scoring_request.id = :scoring_request_id", { scoring_request_id })
                .andWhere("scoring_request.is_validated = :is_validated", { is_validated: false })
                .getMany();


                const scoringRepository = AppDataSource.getRepository(Scoring);
                const employeeScoring = await scoringRepository.findOne({
                    where: { employee: { id: scoringRequest[0].employee.id }, is_closed: false },
                });

            if (scoringRequest.length === 0) {
                res.status(404).json({ message: "Scoring request no found or already validated" });
            } else if (!employeeScoring) {
                res.status(200).json({ message: "No more scoring permitted" });
            } else {
                scoringRequest[0].is_validated = true;
                await scoringRequestRepository.save(scoringRequest[0]);

                if (employeeScoring.start_time) {
                    employeeScoring.end_time = new Date();
                    employeeScoring.is_closed = true;
                } else {
                    employeeScoring.start_time = new Date();
                }
                await scoringRepository.save(employeeScoring);

                res.status(200).json({message: "Success"});
            }

        } catch (error) {
            console.error("Scoring request error :", error);
            res.status(500).json({ message: "Erreur interne." });
        }
    }


    static async rejectScoringRequest(req: Request, res: Response) {

        const { scoring_request_id } = req.params;

        const scoringRequestRepository = AppDataSource.getRepository(Scoring_Request);
        const scoringRequest = await scoringRequestRepository.findOne(
            { where: {
                id: parseInt(scoring_request_id)
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