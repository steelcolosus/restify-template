import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseEntity } from './BaseEntity';

@Entity()
export class Customer extends BaseEntity {

    @Column()
    public firstName: string;
    @Column()
    public lastName: string;
}