import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import helmet from "helmet";
import * as cors from 'cors';
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";
import { ResponseMessageInterceptor } from "./common/interceptor/response-message.interceptor";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ミドルウェアの設定
  app.use(helmet());
  app.use(cors());
  app.useGlobalInterceptors(new ResponseMessageInterceptor());
  app.use(cookieParser("test-secret"));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
  app.setGlobalPrefix('api/v1');
  await app.listen(3001);
  console.log("Example app listening on port 3001!");
}
bootstrap();
