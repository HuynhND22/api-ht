import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';
import { IsIn, IsNotEmpty } from 'class-validator';

@Entity({ name: 'Users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'userId' })
  userId: number;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @IsNotEmpty()
  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fullName: string;

  @Column({ type: 'varchar', length: 11, default: 'Nam' })
  @IsIn(['Nam', 'Nữ'])
  gender: string;

  @Column({ unique: true, type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  phoneNumber?: string;

  @Column({ type: 'varchar', length: 20, default: 'Thành viên' })
  @IsIn(['Quản trị viên', 'Thành viên'])
  role: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    // Validation logic here, if needed
  }
}
