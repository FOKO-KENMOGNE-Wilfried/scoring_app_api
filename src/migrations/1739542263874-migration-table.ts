import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739542263874 implements MigrationInterface {
    name = 'MigrationTable1739542263874'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "employee_id"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "site_id"`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "employeeIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "siteIdId" integer`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD CONSTRAINT "FK_164e828a84d297d07d197c66bea" FOREIGN KEY ("employeeIdId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD CONSTRAINT "FK_6dd5b9d8cbf8928c053352b6d3c" FOREIGN KEY ("siteIdId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" DROP CONSTRAINT "FK_6dd5b9d8cbf8928c053352b6d3c"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP CONSTRAINT "FK_164e828a84d297d07d197c66bea"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "siteIdId"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "employeeIdId"`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "site_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "employee_id" integer NOT NULL`);
    }

}
