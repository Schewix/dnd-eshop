import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SupplierProduct } from './supplier-product.js';

@Entity({ name: 'supplier_variant' })
export class SupplierVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'supplier_product_id' })
  supplierProductId: string;

  @Index()
  @Column({ name: 'supplier_variant_id' })
  supplierVariantId: string;

  @Column({ name: 'medusa_variant_id', nullable: true })
  medusaVariantId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  attributes: Record<string, unknown> | null;

  @Column({ name: 'stock_quantity', type: 'int', default: 0 })
  stockQuantity: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, nullable: true })
  price: string | null;

  @Column({ name: 'currency_code', length: 3, nullable: true })
  currencyCode: string | null;

  @Column({ name: 'lead_time_days', type: 'int', nullable: true })
  leadTimeDays: number | null;

  @ManyToOne(() => SupplierProduct, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'supplier_product_id' })
  product: SupplierProduct;
}
