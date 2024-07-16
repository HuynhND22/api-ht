import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTriggerPreventStatusUpdates implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        CREATE TRIGGER PreventStatusUpdate
        ON dbo.Orders
        FOR UPDATE, DELETE
        AS
        BEGIN
            IF EXISTS (SELECT 1 FROM deleted WHERE statusId IN (3, 4))
            BEGIN
                RAISERROR ('can't update or delete Orders with statusId [3,4]', 16, 1);
                ROLLBACK TRANSACTION;
                RETURN;
            END;
        END;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TRIGGER [PreventStatusUpdate];
        `);
    }
}
