import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ResponseMessageInterceptor } from "./common/interceptor/response-message.interceptor";
import * as csurf from "csurf";
import { ConfigService } from "@nestjs/config";
import { LoggingMonitoringInterceptor } from "./common/interceptor/logging-monitoring.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // ミドルウェアの設定
  app.use(helmet());
  app.use(cors());

  app.useGlobalInterceptors(
    new ResponseMessageInterceptor(),
    new LoggingMonitoringInterceptor()
  );
  app.use(cookieParser(configService.get<string>("jwt.secret")));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    })
  );
  app.use(
    csurf({
      cookie: {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      },
      //ignoreMethods: [], //Empty array = do not ignore any methods[GET, POST, PUT, DELETE]. Note: Defult GET method is ignored
    })
  );
  
  app.setGlobalPrefix("api/v1");
  await app.listen(3001);
  console.log("Example app listening on port 3001!");
}
bootstrap();
