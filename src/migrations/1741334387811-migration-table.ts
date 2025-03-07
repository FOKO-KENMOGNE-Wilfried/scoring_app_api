import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1741334387811 implements MigrationInterface {
    name = 'MigrationTable1741334387811'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" ADD "faceEncoding" bytea`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "faceEncoding"`);
    }

}
