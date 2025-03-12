import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToMany, ManyToOne } from "typeorm"
import { Employee } from "./Employee.entity";
import { Site } from "./Site.entity";

@Entity()
export class Employee_Site {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Employee, employee => employee.employeeSites)
    employee: Employee;

    @ManyToOne(() => Site, site => site.id)
    site: number;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
