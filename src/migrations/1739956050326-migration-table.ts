import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739956050326 implements MigrationInterface {
    name = 'MigrationTable1739956050326'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" DROP CONSTRAINT "FK_164e828a84d297d07d197c66bea"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP CONSTRAINT "FK_6dd5b9d8cbf8928c053352b6d3c"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "employeeIdId"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "siteIdId"`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "employeeId" uuid`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "siteId" integer`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD CONSTRAINT "FK_7c60b0efedfbb09af4699103ced" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD CONSTRAINT "FK_9526c5e93437111f0b8349ba8b8" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" DROP CONSTRAINT "FK_9526c5e93437111f0b8349ba8b8"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP CONSTRAINT "FK_7c60b0efedfbb09af4699103ced"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "siteId"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "employeeId"`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "siteIdId" integer`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "employeeIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD CONSTRAINT "FK_6dd5b9d8cbf8928c053352b6d3c" FOREIGN KEY ("siteIdId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD CONSTRAINT "FK_164e828a84d297d07d197c66bea" FOREIGN KEY ("employeeIdId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
