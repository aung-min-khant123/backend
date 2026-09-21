const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  // host: "mysql.railway.internal",
  // user: "root",
  // password: "eUUIAsHmkjBOxQppveeOXzbVCYhCzcEu",
  // port: 3306,
  // database: "railway",
});

// 7
db.query("CREATE DATABASE IF NOT EXISTS ecommerce", (err) => {
  if (err) {
    console.error("Error creating database:", err);
    return;
  }

  console.log("Database created");

  // Select database
  db.changeUser({ database: "ecommerce" }, (err) => {
    if (err) {
      console.error("Error selecting database:", err);
      return;
    }

    // Create products table
    const sql = `
      CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) NOT NULL UNIQUE,
        price DECIMAL(10,2) NOT NULL,
        image_url VARCHAR(500)
      )
    `;

    db.query(sql, (err) => {
      if (err) {
        console.error("Error creating products table:", err);
        return;
      }

      console.log("Products table created");

      // Check if products already exist
      db.query(
        "SELECT COUNT(*) AS count FROM products",
        (err, row) => {
          if (err) {
            console.error("Error checking products:", err);
            return;
          }
          if (row[0].count == 0) {
            const products = [
              [
                "Argentina 2026 Messi Home Shirt",
                89.99,
                "http://localhost:8000/images/Lm2026.png",
              ],
              [
                "Brazil 2026 Neymar Home Shirt",
                84.99,
                "http://localhost:8000/images/Ney102026.png",
              ],
              [
                "France 2026 Mbappe Home Shirt",
                89.99,
                "http://localhost:8000/images/Mbappe2026.png",
              ],
              [
                "Portugal 2026 Ronaldo Home Shirt",
                89.99,
                "http://localhost:8000/images/Cr72026.png",
              ],
              [
                "Norway 2026 Haaland Home Shirt",
                89.99,
                "http://localhost:8000/images/Haaland2026.png",
              ],
              [
                "Spain 2026 Lamine Yamal Home Shirt",
                89.99,
                "http://localhost:8000/images/Lamine2026.png",
              ],
              [
                "Croatia 2026 Luka Modric Home Shirt",
                89.99,
                "http://localhost:8000/images/Modric2026.png"
              ],
              ["England 2026 Kane Home Shirt",
                89.99,
                "http://localhost:8000/images/Kane2026.png"
              ]
            ];

            const insertProducts = `
              INSERT INTO products (name, price, image_url)
              VALUES (?, ?, ?)
            `;

            db.query(
              insertProducts,
              [products],
              (err) => {
                if (err) {
                  console.error(
                    "Error inserting products:",
                    err
                  );
                  return;
                }

                console.log(
                  "Products inserted successfully"
                );
              }
            );
          } else {
            console.log(
              "Products already exist. Skipping insert."
            );
          }
        }
      );
    });
  });
});

module.exports = db;