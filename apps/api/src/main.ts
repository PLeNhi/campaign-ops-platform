import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
    credentials: true
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>("API_PORT") ?? 4000;

  app.setGlobalPrefix("api");

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API server is running on port ${port}`);
}

bootstrap();

