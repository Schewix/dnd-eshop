import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateSupplierTables1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.createTable(
      new Table({
        name: 'supplier',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'code', type: 'varchar', isUnique: true },
          { name: 'name', type: 'varchar' },
          { name: 'endpoint', type: 'varchar', isNullable: true },
          { name: 'type', type: 'varchar', length: '16', default: '"json"' },
          { name: 'auth_token', type: 'text', isNullable: true },
          { name: 'username', type: 'varchar', isNullable: true },
          { name: 'password', type: 'varchar', isNullable: true },
          { name: 'schedule_expr', type: 'varchar', isNullable: true, default: '"0 */6 * * *"' },
          { name: 'default_currency', type: 'char', length: '3', isNullable: true },
          { name: 'active', type: 'boolean', default: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'supplier_product',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'supplier_id', type: 'uuid' },
          { name: 'supplier_sku', type: 'varchar' },
          { name: 'ean', type: 'varchar', isNullable: true },
          { name: 'name', type: 'varchar', isNullable: true },
          { name: 'raw_payload', type: 'jsonb', isNullable: true },
          { name: 'medusa_product_id', type: 'varchar', isNullable: true },
          { name: 'last_synced_at', type: 'timestamptz', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'supplier_product',
      new TableIndex({ name: 'IDX_supplier_product_sku', columnNames: ['supplier_sku'] }),
    );

    await queryRunner.createForeignKey(
      'supplier_product',
      new TableForeignKey({
        columnNames: ['supplier_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'supplier',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'supplier_variant',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'supplier_product_id', type: 'uuid' },
          { name: 'supplier_variant_id', type: 'varchar' },
          { name: 'medusa_variant_id', type: 'varchar', isNullable: true },
          { name: 'attributes', type: 'jsonb', isNullable: true },
          { name: 'stock_quantity', type: 'int', default: 0 },
          { name: 'price', type: 'numeric', precision: 12, scale: 2, isNullable: true },
          { name: 'currency_code', type: 'char', length: '3', isNullable: true },
          { name: 'lead_time_days', type: 'int', isNullable: true },
        ],
      }),
    );

    await queryRunner.createIndex(
      'supplier_variant',
      new TableIndex({ name: 'IDX_supplier_variant_external', columnNames: ['supplier_variant_id'] }),
    );

    await queryRunner.createForeignKey(
      'supplier_variant',
      new TableForeignKey({
        columnNames: ['supplier_product_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'supplier_product',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'supplier_inventory_snapshot',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'supplier_id', type: 'uuid' },
          { name: 'metrics', type: 'jsonb', isNullable: true },
          { name: 'captured_at', type: 'timestamptz' },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'supplier_inventory_snapshot',
      new TableForeignKey({
        columnNames: ['supplier_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'supplier',
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'supplier_order',
        columns: [
          { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
          { name: 'order_id', type: 'varchar' },
          { name: 'supplier_id', type: 'uuid' },
          { name: 'status', type: 'varchar', length: '32', default: '"queued"' },
          { name: 'payload', type: 'jsonb', isNullable: true },
          { name: 'tracking_number', type: 'varchar', isNullable: true },
          { name: 'last_error', type: 'text', isNullable: true },
          { name: 'attempt_count', type: 'int', default: 0 },
          { name: 'dispatched_at', type: 'timestamptz', isNullable: true },
          { name: 'acknowledged_at', type: 'timestamptz', isNullable: true },
          { name: 'created_at', type: 'timestamptz', default: 'now()' },
          { name: 'updated_at', type: 'timestamptz', default: 'now()' },
        ],
      }),
    );

    await queryRunner.createIndex(
      'supplier_order',
      new TableIndex({ name: 'IDX_supplier_order_order_id', columnNames: ['order_id'] }),
    );

    await queryRunner.createForeignKey(
      'supplier_order',
      new TableForeignKey({
        columnNames: ['supplier_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'supplier',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('supplier_order');
    await queryRunner.dropTable('supplier_inventory_snapshot');
    await queryRunner.dropTable('supplier_variant');
    await queryRunner.dropTable('supplier_product');
    await queryRunner.dropTable('supplier');
  }
}
