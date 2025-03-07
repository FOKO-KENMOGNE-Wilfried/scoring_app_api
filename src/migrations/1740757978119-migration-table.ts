import { MigrationInterface, QueryRunner } from "typeorm";

export class MigrationTable1740757978119 implements MigrationInterface {
    name = 'MigrationTable1740757978119'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "surname" character varying NOT NULL, "phone_number" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL DEFAULT false, "position" character varying NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "profile" character varying, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "employee_site" ("id" SERIAL NOT NULL, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), "employeeId" uuid, "siteId" integer, CONSTRAINT "PK_72953417d3d7e75b72ca0918d53" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "site" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "location" character varying NOT NULL, "area" integer NOT NULL, "siteSchedules" character varying, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_635c0eeabda8862d5b0237b42b4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scoring_request" ("id" SERIAL NOT NULL, "is_validated" boolean NOT NULL DEFAULT false, "is_rejected" boolean NOT NULL DEFAULT false, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), "employeeId" uuid, CONSTRAINT "PK_e5592ac2deeb7dbfe19e41bef99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "scoring" ("id" SERIAL NOT NULL, "start_time" TIMESTAMP, "end_time" TIMESTAMP, "is_closed" boolean NOT NULL DEFAULT false, "createAt" TIMESTAMP NOT NULL DEFAULT now(), "updateat" TIMESTAMP NOT NULL DEFAULT now(), "employeeId" uuid, CONSTRAINT "PK_76879d276229eb941c4f256d9e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD CONSTRAINT "FK_7c60b0efedfbb09af4699103ced" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "employee_site" ADD CONSTRAINT "FK_9526c5e93437111f0b8349ba8b8" FOREIGN KEY ("siteId") REFERENCES "site"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scoring_request" ADD CONSTRAINT "FK_88478981f24f8f301159455b189" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "scoring" ADD CONSTRAINT "FK_272c245293dc849c46c5c76f722" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "scoring" DROP CONSTRAINT "FK_272c245293dc849c46c5c76f722"`);
        await queryRunner.query(`ALTER TABLE "scoring_request" DROP CONSTRAINT "FK_88478981f24f8f301159455b189"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP CONSTRAINT "FK_9526c5e93437111f0b8349ba8b8"`);
        await queryRunner.query(`ALTER TABLE "employee_site" DROP CONSTRAINT "FK_7c60b0efedfbb09af4699103ced"`);
        await queryRunner.query(`DROP TABLE "scoring"`);
        await queryRunner.query(`DROP TABLE "scoring_request"`);
        await queryRunner.query(`DROP TABLE "site"`);
        await queryRunner.query(`DROP TABLE "employee_site"`);
        await queryRunner.query(`DROP TABLE "employee"`);
    }

}
