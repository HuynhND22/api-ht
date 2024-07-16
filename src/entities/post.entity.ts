import { BaseEntity, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { IsNotEmpty, validateOrReject } from 'class-validator';
import { Category } from './category.entity';

@Entity({ name: 'Post' })
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn({ name: 'postId' })
  postId: number;

  @IsNotEmpty()
  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'varchar', nullable: true })
  cover?: string;

  @Column({ type: 'int', nullable: true })
  view?: number;

  @Column({ type: 'int' })
  statusId: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true, onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt?: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Category, (c) => c.posts)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  // HOOKS (AUTO VALIDATE)
  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
