import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/users/v1');

  // app.enableCors({
  //   origin: 'http://localhost:3000', // или ['http://localhost:3000']
  //   credentials: true,               // если используешь куки или токены
  // });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
  .setTitle('Auth API')
  .setDescription('Документация API авторизации и пользователей')
  .setVersion('1.0')
  .addBearerAuth() // JWT авторизация
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/users/v1', app, document); // http://localhost:3000/api
  await app.listen(3001, '0.0.0.0');
}
bootstrap();

