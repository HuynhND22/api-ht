import { MigrationInterface, QueryRunner } from 'typeorm';

export class checkCartsUnique implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE OR ALTER TRIGGER CheckCarts
        ON dbo.Carts
        AFTER INSERT, UPDATE
        AS
        BEGIN
            IF EXISTS (SELECT 1 FROM inserted WHERE (promotionId IS NULL AND productSizeId IS NULL))
            BEGIN
                RAISERROR ('promotionId or productSizeId is required', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
            IF EXISTS (SELECT 1 FROM inserted WHERE promotionId IS NOT NULL AND productSizeId IS NOT NULL)
            BEGIN
                RAISERROR ('only promotionId or productSizeId', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
            IF EXISTS (
                SELECT 1
                FROM dbo.Carts AS c
                INNER JOIN inserted AS i ON c.tableId = i.tableId
                WHERE (c.promotionId = i.promotionId OR c.productSizeId = i.productSizeId) AND c.cartId <> i.cartId
            )
            BEGIN
                RAISERROR ('promotionId or productSizeId already exists ', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
        END;
        
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER [CheckCarts];
        `);
    }
}
