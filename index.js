const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./server");

const app = express();

//medleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.get("/", (req, res) => {
  res.send("Connected");
});

//get all users data
app.get("/user/datas", (req, res) => {
  const query = "SELECT * FROM person";

  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send(err);
    }
    res.status(200).json(results);
  });
});

//get one data
app.get("/user/data/:id", (req, res) => {
  const { id } = req.params;

  const query = "SELECT * FROM person WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (result.length === 0) {
      res.status(404).send("Not Found");
    }

    res.status(200).json(results[0]);
  });
});

//add user data
app.post("/user/data", (req, res) => {
  const { name, gender, age } = req.body;

  const query = "INSERT INTO person(name, gender, age) VALUES (?, ?, ?)";

  db.query(query, [name, gender, age], (err, results) => {
    if (err) {
      res.status(500).send(err);
    }

    res.status(201).json({ id: results.insertId, name, gender, age });
  });
});

//update user data
app.put("/user/data/:id", (req, res) => {
  const { id } = req.params;
  const { name, gender, age } = req.body;

  const query = "UPDATE person SET name = ?, gender = ?, age = ? WHERE id = ?";

  db.query(query, [name, gender, age, id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.affectedRows === 0) {
      res.status(404).send("Not Found");
    }

    res.status(201).send({ id, name, gender, age });
  });
});

//delete user data
app.delete("/user/data/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM person WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else if (results.affectedRows === 0) {
      res.status(404).send("Not Found");
    }

    res.status(200).send("Successful deleted user data");
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
