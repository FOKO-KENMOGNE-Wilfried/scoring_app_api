import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { Employee } from "./Employee.entity";

@Entity()
export class Scoring_Request {

    @PrimaryGeneratedColumn("increment")
    id: string

    @ManyToOne(() => Employee, employee => employee.id)
    employee: number;

    @Column({ default: true, nullable: false  })
    is_validated: boolean;

    @Column({ default: true, nullable: false  })
    is_rejected: boolean;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
