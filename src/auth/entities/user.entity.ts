import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  birthdate: string;

  @Column({ nullable: true })
  celphone: string;

  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @Column('bool', { default: true })
  is_active: boolean;
}
