import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerUpdateLimitPromotion implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE OR ALTER TRIGGER UpdateLimitOnOrderStatus
        ON Orders
        AFTER UPDATE
        AS
        BEGIN
            DECLARE @orderId INT, @statusId INT;
        
            SELECT @orderId = orderId, @statusId = statusId
            FROM inserted;
        
            IF @statusId = 3
            BEGIN
                UPDATE Promotions
                SET limit = limit - 1
                FROM Promotions p
                JOIN OrderDetails od ON p.promotionId = od.promotionId
                WHERE od.orderId = @orderId;
            END;
        END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER [UpdateLimitOnOrderStatus];
        `);
    }
}
