import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import "reflect-metadata";
import { AppModule } from "./module";

async function start() {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)
    throw Error("JWT_SECRET must be 32+ characters");

  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.enableCors({
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix("api");
  await app.listen(3000, "0.0.0.0");
}

start();
