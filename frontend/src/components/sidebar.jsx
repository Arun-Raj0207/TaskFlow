import {
  Dashboard,
  Task,
  Logout,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("token");
  navigate("/");
};
  return (
    <Box
      sx={{
        width: 260,
        minHeight: "100vh",
        bgcolor: "#fff",
        borderRight: "1px solid #e5e5e5",
        p: 3,
      }}
    >
      <Typography
  variant="h4"
  fontWeight={700}
  mb={5}
  sx={{
    color: "#1d1d1f",
    letterSpacing: "-0.03em",
  }}
>
  TaskFlow
</Typography>

      <List>
  <ListItemButton
  component={Link}
  to="/dashboard"
  sx={{
    borderRadius: 3,
    mb: 1,
    py: 1.2,
    "&:hover": {
      backgroundColor: "#f5f5f7",
    },
  }}
>
  <ListItemIcon
    sx={{
      color: "#1d1d1f",
      minWidth: 40,
    }}
  >
    <Dashboard />
  </ListItemIcon>

  <ListItemText
    primary="Dashboard"
    primaryTypographyProps={{
      sx: {
        color: "#1d1d1f",
        fontWeight: 500,
      },
    }}
  />
</ListItemButton>

<ListItemButton
  component={Link}
  to="/tasks"
  sx={{
    borderRadius: 3,
    mb: 1,
    py: 1.2,
    "&:hover": {
      backgroundColor: "#f5f5f7",
    },
  }}
>
  <ListItemIcon
    sx={{
      color: "#1d1d1f",
      minWidth: 40,
    }}
  >
    <Task />
  </ListItemIcon>

  <ListItemText
    primary="Tasks"
    primaryTypographyProps={{
      sx: {
        color: "#1d1d1f",
        fontWeight: 500,
      },
    }}
  />
</ListItemButton>

<ListItemButton
  onClick={handleLogout}
  sx={{
    borderRadius: 3,
    mt: 2,
    py: 1.2,
    "&:hover": {
      backgroundColor: "#fff2f2",
    },
  }}
>
  <ListItemIcon
    sx={{
      color: "#d32f2f",
      minWidth: 40,
    }}
  >
    <Logout />
  </ListItemIcon>

  <ListItemText
    primary="Logout"
    primaryTypographyProps={{
      sx: {
        color: "#d32f2f",
        fontWeight: 500,
      },
    }}
  />
</ListItemButton>
</List>
    </Box>
  );
}

export default Sidebar;