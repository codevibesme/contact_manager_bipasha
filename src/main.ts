import { NestFactory } from '@nestjs/core';
import setupSwagger from 'swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  // if (process.env.APP_ENV !== 'STAGING' && process.env.APP_ENV !== 'PRODUCTION') {
    setupSwagger(app);
  // }

  await app.listen(parseInt(process.env.PORT as string), () => {
    console.log(`Server started on ${process.env.SERVER_URL} and Port: ${process.env.PORT}`)
  });
}
bootstrap();
