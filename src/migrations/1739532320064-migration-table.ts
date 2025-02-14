import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739532320064 implements MigrationInterface {
    name = 'MigrationTable1739532320064'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" DROP COLUMN "surname"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee_site" ADD "surname" character varying NOT NULL`);
    }

}
