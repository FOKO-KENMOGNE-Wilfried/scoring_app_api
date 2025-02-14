import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToMany, ManyToOne } from "typeorm"
import { Employee } from "./Employee.entity";
import { Site } from "./Site.entity";

@Entity()
export class Employee_Site {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Employee, employee => employee.id)
    employee_id: number;

    @ManyToOne(() => Site, site => site.id)
    site_id: number;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
