import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SupplierProduct } from './supplier-product.js';
import { SupplierOrder } from './supplier-order.js';
import { SupplierInventorySnapshot } from './supplier-inventory-snapshot.js';

@Entity({ name: 'supplier' })
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  endpoint: string | null;

  @Column({ type: 'varchar', length: 16, default: 'json' })
  type: 'json' | 'xml' | 'csv' | 'rest';

  @Column({ name: 'auth_token', nullable: true, type: 'text' })
  authToken: string | null;

  @Column({ nullable: true })
  username: string | null;

  @Column({ nullable: true })
  password: string | null;

  @Column({ name: 'schedule_expr', nullable: true, default: '0 */6 * * *' })
  scheduleExpression: string | null;

  @Column({ name: 'default_currency', nullable: true, length: 3 })
  defaultCurrency: string | null;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => SupplierProduct, (product) => product.supplier)
  products: SupplierProduct[];

  @OneToMany(() => SupplierOrder, (order) => order.supplier)
  orders: SupplierOrder[];

  @OneToMany(() => SupplierInventorySnapshot, (snapshot) => snapshot.supplier)
  inventorySnapshots: SupplierInventorySnapshot[];
}
