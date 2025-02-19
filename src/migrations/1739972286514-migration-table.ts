import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739972286514 implements MigrationInterface {
    name = 'MigrationTable1739972286514'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" ALTER COLUMN "start_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scoring" ALTER COLUMN "end_time" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" ALTER COLUMN "end_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scoring" ALTER COLUMN "start_time" SET NOT NULL`);
    }

}
