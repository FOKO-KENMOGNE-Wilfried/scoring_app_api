import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, ManyToMany, ManyToOne } from "typeorm"
import { Employee } from "./Employee.entity";
import { Site } from "./Site.entity";

@Entity()
export class Employee_Site {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Employee, employee => employee.id)
    employee: number;

    @ManyToOne(() => Site, site => site.id)
    site: number;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
