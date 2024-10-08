import { Inject, MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
const cookieSesion = require('cookie-session');


@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `.env.${process.env.NODE_ENV}`,
  }),
  TypeOrmModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
      return {
        type: 'sqlite',
        database: config.get<string>('DB_NAME'),
        entities: [User, Report],
        synchronize: true,
      }
    }
  }),UsersModule, ReportsModule],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true
      }),
    }
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(
      cookieSesion({
        keys: ['abscsdf'],
      })
    ).forRoutes('*')
  }
}
