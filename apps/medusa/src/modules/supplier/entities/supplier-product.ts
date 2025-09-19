import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Supplier } from './supplier.js';
import { SupplierVariant } from './supplier-variant.js';

@Entity({ name: 'supplier_product' })
export class SupplierProduct {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Index()
  @Column({ name: 'supplier_sku' })
  supplierSku: string;

  @Column({ nullable: true })
  ean: string | null;

  @Column({ nullable: true })
  name: string | null;

  @Column({ name: 'raw_payload', type: 'jsonb', nullable: true })
  rawPayload: unknown;

  @Column({ name: 'medusa_product_id', nullable: true })
  medusaProductId: string | null;

  @Column({ name: 'last_synced_at', type: 'timestamptz', nullable: true })
  lastSyncedAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Supplier, (supplier) => supplier.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @OneToMany(() => SupplierVariant, (variant) => variant.product)
  variants: SupplierVariant[];
}
