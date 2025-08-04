import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MurmurService } from './murmur.service';
import { MurmurController } from './murmur.controller';
import { Murmur } from '../../entities/murmur.entity';
import { Like } from '../../entities/like.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Murmur, Like])],
  providers: [MurmurService],
  controllers: [MurmurController],
})
export class MurmurModule {}