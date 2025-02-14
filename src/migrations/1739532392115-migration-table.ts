import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739532392115 implements MigrationInterface {
    name = 'MigrationTable1739532392115'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "employee_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "site_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "site_id"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "employee_id"`);
    }

}
