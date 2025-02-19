import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739976226312 implements MigrationInterface {
    name = 'MigrationTable1739976226312'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" ADD "is_closed" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" DROP COLUMN "is_closed"`);
    }

}
