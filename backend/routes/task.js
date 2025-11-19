const express = require("express");
const router = express.Router();

const { getTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const  requireAuth  = require("../middleware/requireAuth");

router.use(requireAuth);
//route handlers

router.get("/",getTasks );

router.post("/",createTask );

router.patch("/:id",updateTask );

router.delete("/:id",deleteTask );

module.exports = router;
