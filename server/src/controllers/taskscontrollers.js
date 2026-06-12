
const tasks = [
  {
    id: 1,
    title: "Learn Express",
    status: "pending"
  },
  {
    id: 2,
    title: "Learn Node.js",
    status: "completed"
  }
];

const getAllTasks = (req, res) => {
  res.json({
    success: true,
    tasks,
  });
};

const getTaskById = (req, res) => {
  const { id, title } = req.params;

  res.json({
    success: true,
    task: {
      id,
      title,
      status: "pending"
    }
  });
};

const createTask = (req, res) => {
  const { title, status } = req.body;

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required"
    });
  }

  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required"
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    status,
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created",
    task: newTask
  });
};

const updateTask = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = tasks.find(
    task => task.id === Number(id)
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  task.status = status;

  res.json({
    success: true,
    task
  });
};

const deleteTask = (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex(
    task => task.id === Number(id)
  );

  if (taskIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(taskIndex, 1);

  res.json({
    success: true,
    message: "Task deleted",
    task :  deletedTask[0]
  });
};

export  {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} 