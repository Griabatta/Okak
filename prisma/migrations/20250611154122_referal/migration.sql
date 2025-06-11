-- CreateTable
CREATE TABLE "ReferralToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReferralToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReferralToken_token_key" ON "ReferralToken"("token");

-- AddForeignKey
ALTER TABLE "ReferralToken" ADD CONSTRAINT "ReferralToken_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralToken" ADD CONSTRAINT "ReferralToken_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "EducationalInstitution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
