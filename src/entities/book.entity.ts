import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { Category } from './category.entity';

@Entity({ name: 'Book' })
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'bookId' })
  bookId: number;

  @IsNotEmpty()
  @Column({ unique: true, type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  url?: string;

  @Column({ type: 'int', nullable: true })
  categoryId?: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Category, (c) => c.books)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
