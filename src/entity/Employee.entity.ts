import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Employee_Site } from "./Employee_Site.entity"

@Entity()
export class Employee {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    surname: string

    @Column({ nullable: false })
    phone_number: string

    @Column({ nullable: false, unique: true })
    email: string

    @Column({ nullable: false, select: false })
    password: string

    @Column("simple-json", { nullable: true })
    face_encodings: number[][]

    @Column({ default: "employee" })
    role: string

    @Column({ nullable: false })
    position: string

    @Column({ default: true, nullable: false  })
    is_active: boolean;

    @OneToMany(() => Employee_Site, (employeeSite) => employeeSite.employee)
    employeeSites: Employee_Site[];


    @Column({ nullable: true })
    profile: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
