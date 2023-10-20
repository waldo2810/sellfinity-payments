-- CreateTable
CREATE TABLE "billboard" (
    "id" BIGSERIAL NOT NULL,
    "create_at" TIMESTAMP(6),
    "image_url" VARCHAR(255),
    "label" VARCHAR(255),
    "update_at" TIMESTAMP(6),
    "category_id" BIGINT,
    "store_id" BIGINT,

    CONSTRAINT "billboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "updated_at" TIMESTAMP(6),
    "store_id" BIGINT NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colors" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "updated_at" TIMESTAMP(6),
    "value" VARCHAR(255) NOT NULL,
    "store_id" BIGINT NOT NULL,

    CONSTRAINT "colors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "updated_at" TIMESTAMP(6),
    "url" VARCHAR(255) NOT NULL,
    "product_id" BIGINT NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_category" (
    "id" BIGSERIAL NOT NULL,
    "category_id" BIGINT,
    "product_id" BIGINT,
    "store_id" BIGINT,

    CONSTRAINT "product_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_color" (
    "id" BIGSERIAL NOT NULL,
    "color_id" BIGINT,
    "product_id" BIGINT,
    "store_id" BIGINT,

    CONSTRAINT "product_color_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_size" (
    "id" BIGSERIAL NOT NULL,
    "product_id" BIGINT,
    "size_id" BIGINT,
    "store_id" BIGINT,

    CONSTRAINT "product_size_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "is_archived" BOOLEAN,
    "is_featured" BOOLEAN,
    "name" VARCHAR(255),
    "price" DOUBLE PRECISION,
    "updated_at" TIMESTAMP(6),
    "store_id" BIGINT NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sizes" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "updated_at" TIMESTAMP(6),
    "value" VARCHAR(255) NOT NULL,
    "store_id" BIGINT NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMP(6),
    "name" VARCHAR(255),
    "updated_at" TIMESTAMP(6),
    "user_email" VARCHAR(255),

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" BIGSERIAL NOT NULL,
    "storeId" BIGINT NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL DEFAULT '',
    "address" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" BIGSERIAL NOT NULL,
    "orderId" BIGINT NOT NULL,
    "productId" BIGINT NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "order_storeId_idx" ON "order"("storeId");

-- CreateIndex
CREATE INDEX "order_item_orderId_idx" ON "order_item"("orderId");

-- CreateIndex
CREATE INDEX "order_item_productId_idx" ON "order_item"("productId");

-- AddForeignKey
ALTER TABLE "billboard" ADD CONSTRAINT "fk1ckbb8919w6uu7kex00d8fdn" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "billboard" ADD CONSTRAINT "fk8dn6yafr5et2sb4hvnfj5i9g1" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "fkpq1rrk85xcdwf8socc6prhkm3" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "colors" ADD CONSTRAINT "fk9ntn4atxn12170x4bynglujj3" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "images" ADD CONSTRAINT "fkghwsjbjo7mg3iufxruvq6iu3q" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "fk5mgiulv3ujobf8du8pqbq3yjo" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "fk5w81wp3eyugvi2lii94iao3fm" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_category" ADD CONSTRAINT "fkdswxvx2nl2032yjv609r29sdr" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_color" ADD CONSTRAINT "fkjs0ht7btbgt5u0jpossmgvfk5" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_color" ADD CONSTRAINT "fkof8r2dgk9wegx2jwapq0qmkjw" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_color" ADD CONSTRAINT "fkpk6riqswj8f8ldulumm9hmpq" FOREIGN KEY ("color_id") REFERENCES "colors"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_size" ADD CONSTRAINT "fk1yl8bbmokvonm64131xlscnci" FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_size" ADD CONSTRAINT "fk9qjgp0xvl5jfetdt683i7wqwr" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "product_size" ADD CONSTRAINT "fkdotp6riw7ksp59ivcdj4kxvnv" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "fkj6t0t0nb9wyi1fjyacp5643n9" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sizes" ADD CONSTRAINT "fkm250yqqlyfss91qqk7e2wqsx" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
