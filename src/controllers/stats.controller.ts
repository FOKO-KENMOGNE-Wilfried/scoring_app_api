import { Between } from "typeorm";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Scoring } from "../entity/Scoring.entity";
import { Employee } from "../entity/Employee.entity";


export class StatController {

    static async getStatsByEmployee(req: Request, res: Response) {

        const { employee_id } = req.params;

        const scoringRepository = AppDataSource.getRepository(Scoring);
        const employeeRepository = AppDataSource.getRepository(Employee);

        const firstPunch = await scoringRepository.findOne({
          where: { employee: { id: employee_id } },
          order: { start_time: "ASC" },
        });
        const employee = await employeeRepository.findOne({ where: { id: employee_id } });

        if (!firstPunch) {
          console.log("Aucun pointage trouvé pour cet employé.");
          res.status(404).json({ message: { totalHours: 0, attendance: [] } });
        }

        const startDate = new Date(firstPunch.start_time || employee.createAt);
        const endDate = new Date();

        // Étape 2 : Generate all date between the first scoring and today
        const allDates = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          allDates.push(new Date(d)); // Liste de toutes les dates
        }

        // Étape 3 : Get the scoring rows
        const scoringEntries = await scoringRepository.find({
          where: {
            employee: { id: employee_id },
            start_time: Between(startDate, endDate),
          },
          order: { start_time: "ASC" },
        });

        // Étape 4 : Total number of working hours
        const totalHours = scoringEntries.reduce((sum, entry) => {
          if (entry.end_time && entry.start_time) {
            const hoursWorked = (entry.end_time.getTime() - entry.start_time.getTime()) / 3600000; // Convertir millisecondes en heures
            return sum + hoursWorked;
          }
          return sum;
        }, 0);

        // Étape 5 : Associate date to data
        const attendance = allDates.map((date) => {
          const entry = scoringEntries.find(
            (e) => e.start_time.toISOString().split("T")[0] === date.toISOString().split("T")[0]
          );
          return {
            date: date.toISOString().split("T")[0], // Format AAAA-MM-JJ
            startTime: entry ? entry.start_time.toISOString().split("T")[1] : null, // Heure d'arrivée
            endTime: entry ? entry.end_time?.toISOString().split("T")[1] : null, // Heure de départ
          };
        });

        res.status(200).json({ message: { totalHours, attendance } });
    }

    static async getStatsBySite(req: Request, res: Response) {}
    static async getStatsByCompany(req: Request, res: Response) {}

}