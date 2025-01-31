import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({ nullable: false })
    name: string

    @Column({ nullable: false })
    email: string

    @Column({ nullable: false })
    password: string

    @Column({ default: false })
    role: string

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
