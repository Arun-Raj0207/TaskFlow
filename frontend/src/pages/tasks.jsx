
import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import TaskCard from "../components/taskcard";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Chip,
  Stack,
  Button,
  Modal,
  MenuItem,
} from "@mui/material";

function Tasks() {
const [tasks, setTasks] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [open, setOpen] = useState(false);
const [title, setTitle] = useState("");
const [description, setDescription] = useState("");
const [dueDate, setDueDate] = useState("");
const [priority, setPriority] = useState("Medium");
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get("/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);
  const handleCreateTask = async () => {
    try {
      const response = await api.post("/tasks", {
        title,
        description,
        dueDate,
        priority,
      });

      setTasks((prevTasks) => [...prevTasks, response.data]);
      setTitle("");
      setDescription("");
      setDueDate("");
      setPriority("Medium");
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };
  const handleComplete = async (id) => {
    try {
      await api.patch(`/tasks/${id}`, {
        completed: true,
      });
      setTasks(
        tasks.map((task) =>
          task._id === id
            ? {
                ...task,
                completed: true,
              }
            : task
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(
        tasks.filter((task) => task._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };
  const filteredTasks = tasks.filter(
  (task) =>
    task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||

    task.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
);
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flex: 1,
          p: 5,
        }}
      >
        <Navbar />

        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
        >
          Tasks
        </Typography>

        <TextField
  fullWidth
  placeholder="Search tasks..."
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  variant="outlined"
  sx={{
    mb: 3,
    backgroundColor: "#ffffff",
    borderRadius: 3,

    "& .MuiOutlinedInput-root": {
      borderRadius: 3,
      backgroundColor: "#ffffff",
    },
  }}
/>
        <Stack
  direction="row"
  spacing={1}
  mb={4}
>
  <Chip
    label="All"
    clickable
    sx={{
      backgroundColor: "#1976d2",
      color: "#fff",
      fontWeight: 500,
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    }}
  />

  <Chip
    label="Pending"
    clickable
    sx={{
      backgroundColor: "#1976d2",
      color: "#fff",
      fontWeight: 500,
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    }}
  />

  <Chip
    label="Completed"
    clickable
    sx={{
      backgroundColor: "#1976d2",
      color: "#fff",
      fontWeight: 500,
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    }}
  />

  <Chip
    label="Overdue"
    clickable
    sx={{
      backgroundColor: "#1976d2",
      color: "#fff",
      fontWeight: 500,
      "&:hover": {
        backgroundColor: "#1565c0",
      },
    }}
  />
</Stack>
        <Box
  display="flex"
  justifyContent="flex-end"
  mb={3}
>
  <Button
    variant="contained"
    onClick={() => setOpen(true)}
  >
    + New Task
  </Button>
</Box>
        <Grid
          container
          spacing={3}
        >
          {filteredTasks.map((task) => (
            <Grid
              item
              xs={12}
              md={6}
              key={task._id}
            >
              <TaskCard
  title={task.title}
  description={task.description}
  dueDate={task.dueDate}
  priority={task.priority}
  status={
    task.completed
      ? "Completed"
      : "Pending"
  }
  onComplete={() =>
    handleComplete(task._id)
  }
  onDelete={() =>
    handleDelete(task._id)
  }
/>
            </Grid>
          ))}
        </Grid>
  {filteredTasks.length === 0 && (
  <Typography
    textAlign="center"
    color="text.secondary"
    mt={4}
  >
    No matching tasks found.
  </Typography>
)}
        <Modal
  open={open}
  onClose={() => setOpen(false)}
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      bgcolor: "white",
      p: 4,
      width: 500,
      borderRadius: 4,
    }}
  >
    <Typography
      variant="h5"
      fontWeight="bold"
      mb={3}
    >
      Create Task
    </Typography>

    <TextField
      fullWidth
      label="Title"
      value={title}
      onChange={(e) =>
        setTitle(e.target.value)
      }
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      multiline
      rows={3}
      label="Description"
      value={description}
      onChange={(e) =>
        setDescription(e.target.value)
      }
      sx={{ mb: 2 }}
    />

    <TextField
      fullWidth
      type="date"
      value={dueDate}
      onChange={(e) =>
        setDueDate(e.target.value)
      }
      sx={{ mb: 2 }}
    />

    <TextField
      select
      fullWidth
      label="Priority"
      value={priority}
      onChange={(e) =>
        setPriority(e.target.value)
      }
      sx={{ mb: 3 }}
    >
      <MenuItem value="Low">
        Low
      </MenuItem>

      <MenuItem value="Medium">
        Medium
      </MenuItem>

      <MenuItem value="High">
        High
      </MenuItem>
    </TextField>

    <Button
      fullWidth
      variant="contained"
      onClick={handleCreateTask}
    >
      Create Task
    </Button>
  </Box>
</Modal>
      </Box>
    </Box>
  );
}
export default Tasks;