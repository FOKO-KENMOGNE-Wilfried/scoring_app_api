import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source"
import { Employee } from "../entity/Employee.entity"


export const authorization = (role: string[]) => {

    return async (req: Request, res: Response, next: NextFunction) => {

        const employeeRepo = AppDataSource.getRepository(Employee);
        const employee = await employeeRepo.findOne({
            where: { id: req[" currentemployee"].id },
        });
        // console.log(employee);

        if (!role.includes(employee.role)) {
            res.status(403).json({ message: "Forbidden" });
        }
        next();

    };

}