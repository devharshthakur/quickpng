import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT!;
  await app.listen(port);
  logger.log(`QuickSVG API running at http://localhost:${port}/api`);
}
bootstrap();
