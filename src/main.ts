import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT || 7100;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port, '0.0.0.0', async () => {
    const url = await app.getUrl();
    console.log(url);
  });
}

bootstrap();
