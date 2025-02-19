import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739972089388 implements MigrationInterface {
    name = 'MigrationTable1739972089388'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" DROP CONSTRAINT "PK_76879d276229eb941c4f256d9e9"`);
        await queryRunner.query(`ALTER TABLE "scoring" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "scoring" ADD "id" SERIAL NOT NULL`);
        await queryRunner.query(`ALTER TABLE "scoring" ADD CONSTRAINT "PK_76879d276229eb941c4f256d9e9" PRIMARY KEY ("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" DROP CONSTRAINT "PK_76879d276229eb941c4f256d9e9"`);
        await queryRunner.query(`ALTER TABLE "scoring" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "scoring" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "scoring" ADD CONSTRAINT "PK_76879d276229eb941c4f256d9e9" PRIMARY KEY ("id")`);
    }

}
