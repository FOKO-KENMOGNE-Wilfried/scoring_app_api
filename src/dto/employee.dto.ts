export class EmployeeResponse {
    id: string;
    name: string;
    surname: string;
    phone_number: string;
    email: string;
    role: string;
    position: string;
    profile: string;
}

export interface payload {
    id: string;
    role: string
}