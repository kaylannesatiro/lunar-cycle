-- CreateTable
CREATE TABLE "usuarias" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "signo" TEXT NOT NULL,
    "duracao_ciclo" INTEGER NOT NULL,
    "duracao_menstruacao" INTEGER NOT NULL,

    CONSTRAINT "usuarias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dias_menstruacao" (
    "data" DATE NOT NULL,
    "id_usuaria" TEXT NOT NULL,

    CONSTRAINT "dias_menstruacao_pkey" PRIMARY KEY ("id_usuaria","data")
);

-- CreateTable
CREATE TABLE "sonhos" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "data_sonho" DATE NOT NULL,
    "fase_lunar" TEXT NOT NULL,
    "id_usuaria" TEXT NOT NULL,

    CONSTRAINT "sonhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags_sonhos" (
    "nome_tag" VARCHAR(25) NOT NULL,
    "id_sonho" TEXT NOT NULL,

    CONSTRAINT "tags_sonhos_pkey" PRIMARY KEY ("id_sonho","nome_tag")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarias_email_key" ON "usuarias"("email");

-- AddForeignKey
ALTER TABLE "dias_menstruacao" ADD CONSTRAINT "dias_menstruacao_id_usuaria_fkey" FOREIGN KEY ("id_usuaria") REFERENCES "usuarias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sonhos" ADD CONSTRAINT "sonhos_id_usuaria_fkey" FOREIGN KEY ("id_usuaria") REFERENCES "usuarias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tags_sonhos" ADD CONSTRAINT "tags_sonhos_id_sonho_fkey" FOREIGN KEY ("id_sonho") REFERENCES "sonhos"("id") ON DELETE CASCADE ON UPDATE CASCADE;
