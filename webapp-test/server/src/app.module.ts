import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Follow } from './entities/follow.entity';
import { Murmur } from './entities/murmur.entity';
import { AuthModule } from './app/auth/auth.module';
import { MurmurModule } from './app/murmur/murmur.module';
import { Like } from './entities/like.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'docker',
      password: 'docker',
      database: 'test',
      entities: [User,Follow,Murmur,Like],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([User,Follow,Murmur,Like]),
    AuthModule,
    MurmurModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
