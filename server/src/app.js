import express from "express";
import taskroute from "./routes/taskroute.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
   res.json({
    success: true,
    message: "Welcome to the Task Manager API",
  });
});


app.use("/tasks", taskroute);

export default app;

