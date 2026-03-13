import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>("API_PORT") ?? 4000;

  app.setGlobalPrefix("api");

  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API server is running on port ${port}`);
}

bootstrap();

