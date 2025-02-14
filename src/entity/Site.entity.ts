import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm"

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

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateat: Date;

}
