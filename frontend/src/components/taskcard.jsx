import {
  Paper,
  Typography,
  Chip,
  Box,
  Button,
} from "@mui/material";

function TaskCard({
  title,
  description,
  dueDate,
  priority,
  status,
  onComplete,
  onDelete,
}) {
  const getStatusColor = () => {
    switch (status) {
      case "Completed":
        return "success";

      case "Overdue":
        return "error";

      default:
        return "warning";
    }
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 4,
        border: "1px solid #e5e5e5",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
      >
        {title}
      </Typography>

      <Typography
        color="text.secondary"
        mt={1}
      >
        {description}
      </Typography>

      <Box
        mt={2}
        display="flex"
        justifyContent="center"
        flexWrap="wrap"
        gap={1}
      >
        <Chip
          label={`Priority: ${priority}`}
          size="small"
        />

        <Chip
          label={`Status: ${status}`}
          color={getStatusColor()}
          size="small"
        />
      </Box>
      <Box
        mt={2}
        display="flex"
        justifyContent="center"
        gap={1}
      >
        {status !== "Completed" && (
          <Button
            variant="outlined"
            size="small"
            onClick={onComplete}
          >
            Mark Complete
          </Button>
        )}

        <Button
          color="error"
          size="small"
          onClick={onDelete}
        >
          Delete
        </Button>
      </Box>
      <Typography
        mt={2}
        color="text.secondary"
      >
        Due: {formatDueDate(dueDate)}
      </Typography>
    </Paper>
  );
}

export default TaskCard;