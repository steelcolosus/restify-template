import { BaseEntity } from "./BaseEntity";
import { Entity, Column } from "typeorm";

@Entity()
export class User extends BaseEntity{
    @Column()
    public firstName: string;
    @Column()
    public lastName: string;
    @Column()
    public username: string;
    @Column()
    public password: string;
}