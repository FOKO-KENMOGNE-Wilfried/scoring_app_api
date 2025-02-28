import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { Employee_Site } from "./Employee_Site.entity";

@Entity()
export class Site {

    @PrimaryGeneratedColumn("increment")
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    location: string;

    @Column({ nullable: false })
    area: number;

    @OneToMany(() => Employee_Site, employeeSite => employeeSite.site)
    employeeSites: Employee_Site[];

    @Column({ nullable: false })
    siteSchedules: string;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
