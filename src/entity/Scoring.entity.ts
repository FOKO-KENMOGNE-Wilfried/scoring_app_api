import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { Employee } from "./Employee.entity";

@Entity()
export class Scoring {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @ManyToOne(() => Employee, employee => employee.id)
    employee_id: number;

    @Column({ nullable: false })
    start_time: Date;

    @Column({ nullable: false })
    end_time: Date;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
