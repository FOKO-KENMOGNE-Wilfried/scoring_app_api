import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739972671529 implements MigrationInterface {
    name = 'MigrationTable1739972671529'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" DROP CONSTRAINT "FK_681b92cf9321011774066ab378c"`);
        await queryRunner.query(`ALTER TABLE "scoring" RENAME COLUMN "employeeIdId" TO "employeeId"`);
        await queryRunner.query(`ALTER TABLE "scoring" ADD CONSTRAINT "FK_272c245293dc849c46c5c76f722" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" DROP CONSTRAINT "FK_272c245293dc849c46c5c76f722"`);
        await queryRunner.query(`ALTER TABLE "scoring" RENAME COLUMN "employeeId" TO "employeeIdId"`);
        await queryRunner.query(`ALTER TABLE "scoring" ADD CONSTRAINT "FK_681b92cf9321011774066ab378c" FOREIGN KEY ("employeeIdId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
