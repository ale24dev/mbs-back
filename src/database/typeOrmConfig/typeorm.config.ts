import { join } from 'path';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';


export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  // port: process.env.RDS_PORT || 5432,
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  // database: process.env.RDS_DB_NAME || dbConfig.database,
  database: 'Ciudad_Libertad',
  entities: [join(__dirname, '..', '..', 'modules', '**', '*.entity.{js,ts}')],
  // seeds: ['src/seeds/**/*{.ts,.js}'],
  // factories: ['src/factories/**/*{.ts,.js}'],
  //synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
  synchronize: true,
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  cli: {
    migrationsDir: join('src', 'database', 'migrations'),
  },
};
