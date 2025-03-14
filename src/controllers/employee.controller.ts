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
        employeeDataSent.id = employee.id;

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

    static async getEmployeeById(req: Request, res: Response) {

        const { id } = req.params;

        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({ where: { id } });

        res.status(200).json({ employee });

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

    static async updateEmployeeRole(req: Request, res: Response) {

        const newrole = req.body.role;
        const { employee_id } = req.params;

        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id: employee_id },
        });
        employee.role = newrole;
        await employeeRepository.save(employee)
        res.status(200).json({ message: "Role updated", employee });

    }

    static async suspendEmployeeAccount (req: Request, res: Response) {

        const { employee_id } = req.params;

        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({
            where: { id: employee_id },
        });
        employee.is_active ? employee.is_active = false : employee.is_active = true;
        await employeeRepository.save(employee)
        res.status(200).json({ message: employee.is_active ? "Employee has been activated" : "Employee has been disabled", employee });

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