import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739932444690 implements MigrationInterface {
    name = 'MigrationTable1739932444690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "is_active" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "is_active"`);
    }

}
