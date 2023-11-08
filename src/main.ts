import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 8081;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors();
  await app.listen(port, '0.0.0.0');
}
bootstrap();
