import { Module, MiddlewareConsumer, NestModule } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "../../entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
// import * as csurf from "csurf";
import { CsrfGuard } from "../../common/guards/csrf-guard";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: "test-secret",
      signOptions: { expiresIn: "1h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CsrfGuard],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(csurf({ cookie: { httpOnly: true, signed: false } }))
    //   .forRoutes("*");
  }
}
