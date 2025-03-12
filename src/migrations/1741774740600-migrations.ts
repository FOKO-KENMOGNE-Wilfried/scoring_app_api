import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1741774740600 implements MigrationInterface {
    name = 'Migrations1741774740600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" SET DEFAULT 'employee'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "role" SET DEFAULT false`);
    }

}
