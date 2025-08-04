import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Murmur } from './murmur.entity';

@Entity()
@Unique(['user', 'murmur'])
export class Like {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  user!: User;

  @ManyToOne(() => Murmur, murmur => murmur.id, { onDelete: 'CASCADE' })
  murmur!: Murmur;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt!: Date;
}
