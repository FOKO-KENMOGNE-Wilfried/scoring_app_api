import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { Employee } from "./Employee.entity";

@Entity()
export class Scoring {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @ManyToOne(() => Employee, employee => employee.id)
    employee: Employee;

    @Column({ nullable: true })
    start_time: Date;

    @Column({ nullable: true })
    end_time: Date;

    @Column({ nullable: false, default: false })
    is_closed: boolean;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
