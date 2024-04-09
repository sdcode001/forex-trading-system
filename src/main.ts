import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  

  const options = new DocumentBuilder()
        .setTitle('Forex-Trading-System')
        .setDescription('APIs that allow users to top up their account, fetch live FX conversion rates, perform FX conversions, and check their account balances.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();


