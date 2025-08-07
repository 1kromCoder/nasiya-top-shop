import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as basicAuth from 'express-basic-auth';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(
  //   ['/docs', '/docs-json'],
  //   basicAuth({
  //     challenge: true,
  //     users: {
  //       [process.env.SWAGGER_USER || 'ake']:
  //         process.env.SWAGGER_PASS || 'ake123',
  //     },
  //   }),
  // );

  const config = new DocumentBuilder()
    .setTitle('Nasiya-Top-Shop')
    .setDescription('Nasiya-Top-Shop API')
    .setVersion('1.0')
    .addSecurityRequirements('bearer', ['bearer'])
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  app.enableCors({
    origin: '*',
  });
  SwaggerModule.setup('docs', app, documentFactory);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
