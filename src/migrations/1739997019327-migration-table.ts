import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739997019327 implements MigrationInterface {
    name = 'MigrationTable1739997019327'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scoring_request" ("id" SERIAL NOT NULL, "is_validated" boolean NOT NULL DEFAULT true, "is_rejected" boolean NOT NULL DEFAULT true, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), "employeeId" uuid, CONSTRAINT "PK_e5592ac2deeb7dbfe19e41bef99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "scoring_request" ADD CONSTRAINT "FK_88478981f24f8f301159455b189" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring_request" DROP CONSTRAINT "FK_88478981f24f8f301159455b189"`);
        await queryRunner.query(`DROP TABLE "scoring_request"`);
    }

}
