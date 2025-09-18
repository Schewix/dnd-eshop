import { DataSource } from 'typeorm';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export default async ({ container }: { container: { resolve: (key: string) => any } }) => {
  const manager = container.resolve('manager') as DataSource;

  // TODO: implement initial seeding (products, categories, shipping, payment).
  console.info('Seed script placeholder – přidejte logiku podle reálných dat dodavatele.');

  await manager.transaction(async () => {
    // Example stub: nothing for now.
  });
};
