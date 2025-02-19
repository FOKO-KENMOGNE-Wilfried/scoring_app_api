import { Request, Response } from "express";
import { encrypt } from "../helpers/helpers";
import { Employee } from "../entity/Employee.entity";
import { AppDataSource } from "../data-source";
import { EmployeeResponse } from "../dto/employee.dto";
import * as cache from "memory-cache";


export class employeeController {

    static async signup(req: Request, res: Response){

        const { name, surname, phone_number, email, password, role, position } = req.body;
        const encryptedPassword = await encrypt.encryptpass(password);
        const employee = new Employee();
        employee.name = name;
        employee.surname = surname;
        employee.phone_number = phone_number;
        employee.email = email;
        employee.password = encryptedPassword;
        employee.role = role;
        employee.position = position;

        const employeeRepository = AppDataSource.getRepository(Employee);
        await employeeRepository.save(employee);

        const employeeDataSent = new EmployeeResponse();
        employeeDataSent.name = employee.name;
        employeeDataSent.email = employee.email;
        employeeDataSent.role = employee.role;

        res.status(200).json({ message: "employee created successfully", employeeDataSent });

    }

    static async getEmployees(req: Request, res: Response) {

        const data = cache.get("data");
        if (data) {
        console.log("serving from cache");
        res.status(200).json({
            data,
        });
        } else {
        console.log("serving from db");
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.find();

        cache.put("data", employee, 6000);
        res.status(200).json({
            data: employee,
        });
        }

    }

    static async setEmployeeProfile(req: Request, res: Response) {

        const profile = req.file?.path;
        const { employee_id } = req.params;

        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id: employee_id },
        });
        employee.profile = profile;
        await employeeRepository.save(employee)
        res.status(200).json({ message: "profile updated", employee });

    }

    static async updateEmployee(req: Request, res: Response) {

        const { id } = req.params;
        const { name, email } = req.body;
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id },
        });
        employee.name = name;
        employee.email = email;
        await employeeRepository.save(employee);
        res.status(200).json({ message: "udpdate", employee });

    }

    static async deleteEmployee(req: Request, res: Response) {

        const { id } = req.params;
        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id },
        });

        employee.is_active = false;
        await employeeRepository.save(employee);

        res.status(200).json({ message: "ok" });

    }

}