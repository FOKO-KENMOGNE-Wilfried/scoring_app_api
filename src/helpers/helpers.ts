import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { payload } from "../dto/employee.dto";

dotenv.config();

const { JWT_SECRET, JWT_TEMP_SECRET } = process.env;

export class encrypt {

    static async encryptpass(password: string) {
        return bcrypt.hashSync(password, 12);
    }

    static comparepassword(hashPassword: string, password: string) {
        return bcrypt.compareSync(password, hashPassword);
    }

    static generateToken(payload: payload) {
        return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
    }

    static generateTempsToken(payload: payload) {
        return jwt.sign(payload, JWT_TEMP_SECRET, { expiresIn: 5 * 60 });
    }

}