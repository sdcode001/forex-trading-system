import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataFetcherService } from './data-fetcher-service/data-fetcher.service';
import { DataFetcherModule } from './data-fetcher-service/data-fetcher.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserSchema } from '../models/user.schema';
import { AccountsModule } from './accounts/accounts.module';
import { APP_FILTER } from '@nestjs/core';
import { UnauthorizedExceptionFilter } from '../src/auth/unauthorized.exception';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES'),
          },
        };
      },
    }),
    ScheduleModule.forRoot(),
    DataFetcherModule,
    AuthModule,
    AccountsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService, 
    DataFetcherService, 
    AuthService, 
    {
      provide: APP_FILTER,
      useClass: UnauthorizedExceptionFilter,
    }
 ],
})

export class AppModule {}
