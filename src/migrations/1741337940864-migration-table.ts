import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1741337940864 implements MigrationInterface {
    name = 'MigrationTable1741337940864'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "faceEncoding" TO "face_encodings"`);
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "face_encodings"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "face_encodings" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "employee" DROP COLUMN "face_encodings"`);
        await queryRunner.query(`ALTER TABLE "employee" ADD "face_encodings" bytea`);
        await queryRunner.query(`ALTER TABLE "employee" RENAME COLUMN "face_encodings" TO "faceEncoding"`);
    }

}
