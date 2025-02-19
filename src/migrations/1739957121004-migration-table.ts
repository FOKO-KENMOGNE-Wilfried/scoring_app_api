import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739957121004 implements MigrationInterface {
    name = 'MigrationTable1739957121004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "employeeId" uuid`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD CONSTRAINT "FK_7c60b0efedfbb09af4699103ced" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" DROP CONSTRAINT "FK_7c60b0efedfbb09af4699103ced"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "employeeId"`);
    }

}
