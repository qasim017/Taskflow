const express = require("express");
require("dotenv").config();

const userRoutes = require("./routes/user");
const taskRotes = require("./routes/task");
const mongoose  = require("mongoose");
const app = express();

// Middleware
app.use(express.json()); // parse JSON request bodies
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// Routes
app.use("/api/user", userRoutes);
app.use("/api/tasks",taskRotes);
// Listen
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`connect to db & Server listening on port `, process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
