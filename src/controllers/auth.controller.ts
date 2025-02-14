import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee.entity";
import { encrypt } from "../helpers/helpers";


export class AuthController {
    static async login(req: Request, res: Response) {
      try {
        const { email, password } = req.body;
        if (!email || !password) {
          res
            .status(500)
            .json({ message: " email and password required" });
        }

        const employeeRepository = AppDataSource.getRepository(Employee);
        const employee = await employeeRepository.findOne({ where: { email } });

        const isPasswordValid = encrypt.comparepassword(employee.password, password);
        if (!employee || !isPasswordValid) {
          res.status(404).json({ message: "employee not found" });
        }
        const token = encrypt.generateToken({ id: employee.id });

        res.status(200).json({ message: "Login successful", employee, token });
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