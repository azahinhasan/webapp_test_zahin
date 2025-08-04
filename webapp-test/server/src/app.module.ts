import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { User, Follow, Murmur, Like } from "./entities";
import { AuthModule, MurmurModule, UserModule } from "./app";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "docker",
      password: "docker",
      database: "test",
      entities: [User, Follow, Murmur, Like],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User, Follow, Murmur, Like]),
    AuthModule,
    MurmurModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
