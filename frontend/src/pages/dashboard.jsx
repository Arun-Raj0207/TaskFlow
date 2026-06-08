import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import api from "../services/api";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import StatCard from "../components/statcard";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const totalTasks = tasks.length;
  const pendingTasks =
  tasks.filter(
    (task) => !task.completed
  ).length;
  const completedTasks =
  tasks.filter(
    (task) => task.completed
  ).length;
  const overdueTasks =
  tasks.filter(
    (task) =>
      !task.completed &&
      new Date(task.dueDate) < new Date()
  ).length;
  const completionRate =
  totalTasks === 0
    ? 0
    : Math.round(
        (completedTasks /
          totalTasks) *
          100
      );
  useEffect(() => {
  const fetchTasks = async () => {
    try {
      const response =
        await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchTasks();
}, []);
const upcomingTasks = tasks
  .filter((task) => !task.completed)
  .slice(0, 3);
  const formatDueDate = (dateString) =>
    new Date(dateString).toLocaleDateString();

  const daysUntil = (dateString) => {
    const diff = Math.ceil(
      (new Date(dateString) - new Date()) / (1000 * 60 * 60 * 24)
    );
    if (diff < 0) return `${Math.abs(diff)}d overdue`;
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
    return `in ${diff}d`;
  };
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

{/* Greeting provided by Navbar; duplicate removed */}

<Grid container spacing={3}>

  <Grid item xs={12} md={3}>
    <StatCard
      title="Total Tasks"
      value={totalTasks}
    />
  </Grid>

  <Grid item xs={12} md={3}>
    <StatCard
      title="Pending"
      value={pendingTasks}
    />
  </Grid>

  <Grid item xs={12} md={3}>
    <StatCard
      title="Completed"
      value={completedTasks}
    />
  </Grid>

  <Grid item xs={12} md={3}>
    <StatCard
      title="Overdue"
      value={overdueTasks}
    />
  </Grid>

  <Grid item xs={12}>
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 6,
        border: "1px solid #e5e5e5",
      }}
    >
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
      >
        Completion Progress
      </Typography>

      <LinearProgress
        variant="determinate"
        value={completionRate}
        sx={{
          height: 10,
          borderRadius: 5,
        }}
      />

      <Typography
        mt={2}
        color="text.secondary"
      >
        {completionRate}% Complete
      </Typography>
    </Paper>
  </Grid>

  <Grid item xs={12}>
    <Paper
      elevation={0}
      sx={{
        p: 4,
        borderRadius: 6,
        border: "1px solid #e5e5e5",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={600}
        mb={3}
      >
        Upcoming Tasks
      </Typography>

      {upcomingTasks.length > 0 ? (
        upcomingTasks.map((task) => {
          const dueLabel = daysUntil(task.dueDate);
          const isOverdue = new Date(task.dueDate) < new Date();
          const statusColor = isOverdue ? "#ff6b6b" : "#ffd166";

          return (
            <Box
              key={task._id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 2,
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                <Box
                  sx={{
                    width: 6,
                    minHeight: 48,
                    borderRadius: 2,
                    background: statusColor,
                    alignSelf: "stretch",
                  }}
                />

                <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", flex: 1, minWidth: 0 }}>
                  <Typography fontWeight={600} sx={{ lineHeight: 1.2, textAlign: "left" }}>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, textAlign: "left" }}>
                    {task.description
                      ? `${task.description.slice(0, 80)}${
                          task.description.length > 80 ? "…" : ""
                        }`
                      : "No description"}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: "right", minWidth: 110, ml: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  {formatDueDate(task.dueDate)}
                </Typography>
                <Chip
                  label={dueLabel}
                  size="small"
                  variant="outlined"
                  sx={{ mt: 1, borderColor: statusColor, color: statusColor }}
                />
              </Box>
            </Box>
          );
        })
      ) : (
        <Typography color="text.secondary">No upcoming tasks.</Typography>
      )}
    </Paper>
  </Grid>

</Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;