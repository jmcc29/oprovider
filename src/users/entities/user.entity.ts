import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  ci: string;

  @Column()
  first_name: string;

  @Column({ nullable: true })
  second_name: string;

  @Column()
  lastname: string;

  @Column({ nullable: true })
  mother_lastname: string;

  @Column({ type: 'date' })
  birthdate: Date;

  @Column({ nullable: true })
  celphone: string;
}
