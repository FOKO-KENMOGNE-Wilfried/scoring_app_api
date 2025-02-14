import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739542810850 implements MigrationInterface {
    name = 'MigrationTable1739542810850'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "profile" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ALTER COLUMN "profile" SET NOT NULL`);
    }

}
