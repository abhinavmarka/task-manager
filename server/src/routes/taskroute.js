import express  from "express";
import { getAllTasks, getTaskById, createTask, updateTask, deleteTask } from "../controllers/taskscontrollers.js";

const router = express.Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);



export default router;