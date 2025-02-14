import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1739531781835 implements MigrationInterface {
    name = 'MigrationTable1739531781835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "site" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, "area" integer NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT false, "position" character varying NOT NULL, "profile" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scoring" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start_time" TIMESTAMP NOT NULL, "end_time" TIMESTAMP NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), "employeeIdId" uuid, CONSTRAINT "PK_76879d276229eb941c4f256d9e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_site" ("id" SERIAL NOT NULL, "surname" character varying NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_72953417d3d7e75b72ca0918d53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "scoring" ADD CONSTRAINT "FK_681b92cf9321011774066ab378c" FOREIGN KEY ("employeeIdId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" DROP CONSTRAINT "FK_681b92cf9321011774066ab378c"`);
        await queryRunner.query(`DROP TABLE "employee_site"`);
        await queryRunner.query(`DROP TABLE "scoring"`);
        await queryRunner.query(`DROP TABLE "employee"`);
        await queryRunner.query(`DROP TABLE "site"`);
    }

}
