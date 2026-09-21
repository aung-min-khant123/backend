const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./database");

const app = express();
const PORT = 3306  || 8000;

app.use(cors());
app.use(express.json());  
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/products", (req, res) => {
  // res.json([
  //     {
  //         id: 1,
  //         name: "Product1",
  //         price: 50,
  //     },
  //     {
  //         id: 2,
  //         name: "Product2",
  //         price: 50,
  //     }
  // ])
  const sql = "SELECT * FROM products";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching products:", err);

      return res.status(500).json({
        error: "Database error",
      });
    }

    res.json(results);
  });
});

app.get("/api/products/:id", (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json(results[0]);
    });
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price, image_url } = req.body;

  const sql = `
    UPDATE products
    SET name = ?, price = ?, image_url = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [name, price, image_url, id],
    (err, result) => {
      if (err) {
        console.error("Error updating product:", err);

        return res.status(500).json({
          message: "Failed to update product",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      res.json({
        message: "Product updated successfully",
      });
    }
  );
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM products WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting product:", err);

      return res.status(500).json({
        message: "Failed to delete product",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.json({
      message: "Product deleted successfully",
    });
  });
});

app.post("/api/products", (req, res) => {
  const { name, price, image_url } = req.body;

  if (!name || !price || !image_url) {
    return res.status(400).json({
      message: "Name, price and image are required",
    });
  }

  const sql = `
    INSERT INTO products (name, price, image_url) 
    VALUES (?, ?, ?)
  `;

  db.query(
    sql,
    [name, price, image_url],
    (err, result) => {
      if (err) {
        console.log("Error adding product:", err);

        return res.status(500).json({
          message: "Failed to add product",
          error: err.message,
        });
      }

      res.status(201).json({
        message: "Product added successfully",
        product: {
          id: result.insertId,
          name,
          price,
          image_url,
        },
      });
    }
  );
});

app.listen(PORT, () => {
  console.log("Server is running");
});
