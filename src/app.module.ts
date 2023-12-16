import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { YoutubeModule } from './youtube/youtube.module';
import { AwsModule } from './aws/aws.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NcloudModule } from './ncloud/ncloud.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultNamingStrategy } from 'typeorm';
import { camelCase } from 'typeorm/util/StringUtils';
import { PostEntity } from './entities/post.entity';
import { LoggerMiddleware } from './middlewares/logger.middleware';

export class TypeOrmNamingStrategy extends DefaultNamingStrategy {
  tableName(targetName: string, userSpecifiedName: string | undefined): string {
    const table = camelCase(super.tableName(targetName, userSpecifiedName));
    return table[0].toUpperCase() + table.slice(1);
  }
}

@Module({
  imports: [
    AuthModule,
    YoutubeModule,
    AwsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    NcloudModule,
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: 3306,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: configService.get<string>('NODE_ENV') === 'local',
        logging: configService.get<string>('NODE_ENV') === 'local',
        entities: [PostEntity],
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([PostEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('/post');
  }
}
