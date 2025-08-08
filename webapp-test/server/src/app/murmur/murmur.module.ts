import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MurmurService } from "./murmur.service";
import { MurmurController } from "./murmur.controller";
import { Follow, Like, Murmur } from "src/entities";

@Module({
  imports: [TypeOrmModule.forFeature([Murmur, Like, Follow])],
  providers: [MurmurService],
  controllers: [MurmurController],
})
export class MurmurModule {}
