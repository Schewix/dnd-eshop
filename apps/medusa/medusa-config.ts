import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

type ModuleResolution = (moduleName: string) => string | undefined;

const moduleResolutions: ModuleResolution[] = [];

const rootDir = process.cwd();
const isProduction = process.env.NODE_ENV === "production";
const sourceDir = path.join(rootDir, "apps/medusa", isProduction ? "dist" : "src");

export default {
  projectConfig: {
    redis_url: process.env.REDIS_URL || 'redis://localhost:6379',
    database_url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa',
    database_extra: {},
    entities: [
      path.join(sourceDir, '**/*.entity.js'),
      path.join(sourceDir, '**/*.entity.ts'),
      path.join(sourceDir, '**/*.model.js'),
      path.join(sourceDir, '**/*.model.ts'),
      path.join(sourceDir, 'modules/supplier/entities/*.js'),
      path.join(sourceDir, 'modules/supplier/entities/*.ts'),
      path.join(rootDir, 'node_modules/@medusajs/medusa/dist/models/*.js'),
    ],
    migrations: [
      path.join(sourceDir, 'migrations/*.js'),
      path.join(sourceDir, 'migrations/*.ts'),
      path.join(sourceDir, 'modules/supplier/migrations/*.js'),
      path.join(sourceDir, 'modules/supplier/migrations/*.ts'),
      path.join(rootDir, 'node_modules/@medusajs/medusa/dist/migrations/*.js'),
    ],
  },
  modulesConfig: moduleResolutions,
};
