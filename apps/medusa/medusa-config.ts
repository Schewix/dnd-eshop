import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

type ModuleResolution = (moduleName: string) => string | undefined;

const moduleResolutions: ModuleResolution[] = [];

export default {
  projectConfig: {
    redis_url: process.env.REDIS_URL || 'redis://localhost:6379',
    database_url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost/medusa',
    database_extra: {},
  },
  modulesConfig: moduleResolutions,
};
