import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Index(['key'], { unique: false })
@Entity()
export class PostEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    comment: 'Youtube 영상 제목',
    type: 'varchar',
    length: 300,
    default: 'DEFAULT_TITLE',
  })
  title: string;

  @Column({ comment: '기본 블로그 글', type: 'varchar', length: 3000 })
  blog: string;

  @Column({
    comment: '인스타그램 스타일의 블로그 글',
    type: 'varchar',
    length: 3000,
  })
  insta: string;

  @Column({
    comment: '브런치 스타일의 블로그 글',
    type: 'varchar',
    length: 3000,
  })
  brunch: string;

  @Column({ comment: 'Youtube key 값', type: 'varchar', length: 100 })
  key: string;

  @CreateDateColumn({ comment: '생성일시' })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정일시' })
  updatedAt: Date;
}
