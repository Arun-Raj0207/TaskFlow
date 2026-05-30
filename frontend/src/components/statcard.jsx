import {
  Paper,
  Typography,
} from "@mui/material";

function StatCard({
  title,
  value,
}) {
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
        color="text.secondary"
      >
        {title}
      </Typography>

      <Typography
        variant="h4"
        fontWeight="bold"
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default StatCard;