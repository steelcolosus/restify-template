import { PrimaryGeneratedColumn, Column } from "typeorm";

export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    public id: number;


    @Column({ nullable: true })
    public description: string;
}