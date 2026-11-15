-- CreateEnum
CREATE TYPE "FacilityType" AS ENUM ('CAMPO', 'ACADEMIA', 'PISCINA', 'AUDITORIO', 'SALA_ANALISE', 'DEPARTAMENTO_MEDICO', 'REFEITORIO', 'ALOJAMENTO');

-- CreateEnum
CREATE TYPE "TeamCategory" AS ENUM ('MASCULINO', 'FEMININO');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('AUXILIAR_TECNICO', 'PREPARADOR_FISICO', 'PREPARADOR_GOLEIROS', 'ANALISTA_DESEMPENHO', 'FISIOLOGISTA', 'MEDICO', 'FISIOTERAPEUTA', 'NUTRICIONISTA', 'PSICOLOGO', 'ROUPEIRO');

-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GOLEIRO', 'ZAGUEIRO', 'LATERAL', 'VOLANTE', 'MEIA', 'ATACANTE');

-- CreateEnum
CREATE TYPE "PreferredFoot" AS ENUM ('DIREITO', 'ESQUERDO', 'AMBIDESTRO');

-- CreateEnum
CREATE TYPE "PlayerStatus" AS ENUM ('DISPONIVEL', 'EM_TRATAMENTO', 'SUSPENSO');

-- CreateEnum
CREATE TYPE "KitType" AS ENUM ('JOGO_1', 'JOGO_2', 'JOGO_3', 'GOLEIRO', 'TREINO', 'VIAGEM');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('TATICO', 'TECNICO', 'FISICO', 'REGENERATIVO', 'BOLA_PARADA');

-- CreateTable
CREATE TABLE "training_centers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "area_ha" DECIMAL(6,2),
    "opened_year" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_centers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facilities" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "type" "FacilityType" NOT NULL,
    "capacity" INTEGER,
    "training_center_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "facilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "category" "TeamCategory" NOT NULL,
    "nickname" VARCHAR(80),
    "competitions" TEXT[],
    "training_center_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaches" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "nationality" VARCHAR(60) NOT NULL,
    "license" VARCHAR(40),
    "contract_start" DATE NOT NULL,
    "team_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_members" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "role" "StaffRole" NOT NULL,
    "coach_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "staff_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "shirt_name" VARCHAR(40) NOT NULL,
    "number" INTEGER NOT NULL,
    "position" "Position" NOT NULL,
    "preferred_foot" "PreferredFoot" NOT NULL,
    "birth_date" DATE NOT NULL,
    "status" "PlayerStatus" NOT NULL DEFAULT 'DISPONIVEL',
    "team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kits" (
    "id" SERIAL NOT NULL,
    "type" "KitType" NOT NULL,
    "season" INTEGER NOT NULL,
    "colors" VARCHAR(120) NOT NULL,
    "supplier" VARCHAR(60) NOT NULL,
    "team_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_sessions" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "start_time" VARCHAR(5) NOT NULL,
    "end_time" VARCHAR(5) NOT NULL,
    "type" "SessionType" NOT NULL,
    "notes" VARCHAR(500),
    "team_id" INTEGER NOT NULL,
    "facility_id" INTEGER NOT NULL,
    "kit_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "training_centers_name_key" ON "training_centers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "facilities_training_center_id_name_key" ON "facilities"("training_center_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "teams_name_key" ON "teams"("name");

-- CreateIndex
CREATE UNIQUE INDEX "teams_category_key" ON "teams"("category");

-- CreateIndex
CREATE UNIQUE INDEX "coaches_team_id_key" ON "coaches"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "players_team_id_number_key" ON "players"("team_id", "number");

-- CreateIndex
CREATE UNIQUE INDEX "kits_team_id_type_season_key" ON "kits"("team_id", "type", "season");

-- CreateIndex
CREATE INDEX "training_sessions_facility_id_date_idx" ON "training_sessions"("facility_id", "date");

-- AddForeignKey
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_training_center_id_fkey" FOREIGN KEY ("training_center_id") REFERENCES "training_centers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_training_center_id_fkey" FOREIGN KEY ("training_center_id") REFERENCES "training_centers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coaches" ADD CONSTRAINT "coaches_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_members" ADD CONSTRAINT "staff_members_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kits" ADD CONSTRAINT "kits_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_kit_id_fkey" FOREIGN KEY ("kit_id") REFERENCES "kits"("id") ON DELETE SET NULL ON UPDATE CASCADE;
