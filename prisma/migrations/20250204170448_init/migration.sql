-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "policy_id" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "vehicle_registration" TEXT NOT NULL,
    "transaction_token" TEXT,
    "company_ref" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_token_key" ON "transactions"("transaction_token");
