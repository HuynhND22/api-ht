import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerCheckOrderDetail implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TRIGGER CheckOrderDetail
        ON dbo.OrderDetails
        AFTER INSERT, UPDATE
        AS
        BEGIN
            IF EXISTS (SELECT 1 FROM inserted WHERE (productSizeId IS NULL AND promotionId IS NULL))
            BEGIN
                RAISERROR ('promotionId or productSizeId is required', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
            IF EXISTS (SELECT 1 FROM inserted WHERE productSizeId IS NOT NULL AND promotionId IS NOT NULL)
            BEGIN
                RAISERROR ('only promotionId or productSizeId', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
            IF EXISTS (
                SELECT 1
                FROM dbo.OrderDetails AS od
                INNER JOIN inserted AS i ON od.orderId = i.orderId
                WHERE (od.productSizeId = i.productSizeId OR od.promotionId = i.promotionId) AND od.orderDetailId <> i.orderDetailId
            )
            BEGIN
                RAISERROR ('promotionId or productSizeId already exists ', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
        END
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER [CheckOrderDetail];
        `);
    }
}
