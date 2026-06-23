const pool = require("../src/db");

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 5000;

const categories = ["Electronics", "Clothing", "Books", "Home", "Sports"];

function randomPrice() {
  return (Math.random() * 999 + 1).toFixed(2);
}

function randomCategory(index) {
  return categories[index % categories.length];
}

function createProductRows(startIndex, batchSize) {
  const rows = [];

  for (let i = 0; i < batchSize; i++) {
    const productNumber = startIndex + i + 1;
    const category = randomCategory(productNumber);

    const createdAt = new Date(Date.now() - productNumber * 1000);
    const updatedAt = createdAt;

    rows.push([
      `Product ${productNumber}`,
      category,
      randomPrice(),
      createdAt,
      updatedAt
    ]);
  }

  return rows;
}

async function seedProducts() {
  try {
    console.log("Starting seed...");

    console.log("Deleting old products...");
    await pool.query("DELETE FROM products");

    console.log("Resetting product IDs...");
    await pool.query("ALTER TABLE products AUTO_INCREMENT = 1");

    let insertedProducts = 0;

    while (insertedProducts < TOTAL_PRODUCTS) {
      const remainingProducts = TOTAL_PRODUCTS - insertedProducts;
      const currentBatchSize = Math.min(BATCH_SIZE, remainingProducts);

      const rows = createProductRows(insertedProducts, currentBatchSize);

      await pool.query(
        `
        INSERT INTO products
          (name, category, price, created_at, updated_at)
        VALUES ?
        `,
        [rows]
      );

      insertedProducts += currentBatchSize;

      console.log(`Inserted ${insertedProducts} products...`);
    }

    console.log("Finished seeding products.");
  } catch (error) {
    console.error("Seed failed:", error);
  } finally {
    await pool.end();
  }
}

seedProducts();