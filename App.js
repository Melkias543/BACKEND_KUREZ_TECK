const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const doten = require("dotenv")
const dotenv = doten.config()
const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  database: process.env.database,
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  connectionLimit: process.env.connectionLimit,
});

db.connect((err, res) => {
  if (err) {
    return console.log("error whith db connection", err);
  }
  console.log("database connection is established successfully");
});

app.listen(5000, (err, res) => {
  if (err) {
    console.log("connection to server is fail", err);
    return;
  }
  console.log("server connection is established successfully.");
});

app.post("/api/tasks", (req, res) => {
  const task = req.body.task;
  const createdAt = new Date();
  const insert =
    "INSERT INTO taskLists (task, createdAt, taskStatus) VALUES (?, ?, ?)";

  db.query(insert, [task, createdAt, "active"], (err, result) => {
    if (err) {
      console.log("err at inserting", err);
      return res.status(500).send("Error during inserting");
    }
    res.send("task added");
    // console.log(task);
  });
});
app.get("/api/tasks", (req, res) => {
  const select = "SELECT * FROM taskLists";

  db.query(select, (err, result) => {
    if (err) {
      console.error("Error during fetching:", err);
      return res.status(500).json({ msg: "Error during fetching" }); // 🔴 Use 500 for internal server error
    }

    res.status(200).json(result);
  });
});

app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  const deleteSql = "DELETE FROM tasklists WHERE id=?";
  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ error: "Failed to delete task", details: err.message });
    }

    res.status(200).json({ message: "Data is deleted successfully." });
  });
});

app.put("/api/tasks/:id", (req, res) => {
  const { id } = req.params;
  const taskStatus = req.body.taskStatus;
  console.log(taskStatus);
  const status = "UPDATE tasklists SET taskStatus=? WHERE id=?";
  db.query(status, [taskStatus, id], (err, result) => {
    if (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Error during Delete", error: err });
    }
    res.status(200).json("Status is updated successfully");
  });
});
