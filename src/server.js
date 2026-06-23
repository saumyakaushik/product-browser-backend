const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const pool = require("./db");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

function encodeCursor(product) {
  const cursorData = {
    created_at: product.created_at,
    id: product.id
  };

  return Buffer.from(JSON.stringify(cursorData)).toString("base64");
}

function decodeCursor(cursor) {
  try {
    return JSON.parse(Buffer.from(cursor, "base64").toString("utf8"));
  } catch {
    return null;
  }
}

app.get("/products", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 100);
    const category = req.query.category || null;
    const cursor = req.query.cursor || null;

    const values = [];
    const whereParts = [];

    if (category) {
      whereParts.push("category = ?");
      values.push(category);
    }

    if (cursor) {
      const decodedCursor = decodeCursor(cursor);

      if (!decodedCursor) {
        return res.status(400).json({ error: "Invalid cursor" });
      }

      whereParts.push(`
        (
          created_at < ?
          OR (created_at = ? AND id < ?)
        )
      `);

      values.push(
        decodedCursor.created_at,
        decodedCursor.created_at,
        decodedCursor.id
      );
    }

    const whereSql =
      whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : "";

    values.push(limit + 1);

    const [rows] = await pool.query(
      `
      SELECT id, name, category, price, created_at, updated_at
      FROM products
      ${whereSql}
      ORDER BY created_at DESC, id DESC
      LIMIT ?
      `,
      values
    );

    const hasNextPage = rows.length > limit;
    const products = rows.slice(0, limit);
    const lastProduct = products[products.length - 1];

    res.json({
      products,
      nextCursor: hasNextPage && lastProduct ? encodeCursor(lastProduct) : null,
      hasNextPage
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
    res.status(500).json({ error: "Unable to load products" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});