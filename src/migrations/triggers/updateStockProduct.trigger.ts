import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerUpdateStockProduct implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TRIGGER UpdateStockOnOrderStatus
        ON Orders
        AFTER INSERT
        AS
        BEGIN
            DECLARE @orderId INT, @statusId INT;
        
            SELECT @orderId = orderId, @statusId = statusId
            FROM inserted;
        
            IF @statusId = 3
            BEGIN
                UPDATE ProductSizes
                SET stock = stock - 1
                FROM ProductSizes ps
                JOIN OrderDetails od ON ps.productSizeId = od.productSizeId
                WHERE od.orderId = @orderId;
            END;
        END;
        
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER [UpdateStockOnOrderStatus];
        `);
    }
}
