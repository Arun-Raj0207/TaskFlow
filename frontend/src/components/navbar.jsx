import { Box, Typography } from "@mui/material";

function Navbar() {
  const name =
    localStorage.getItem("name") ||
    localStorage.getItem("userName");

  return (
    <Box
      sx={{
        mb: 4,
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
      >
        {name ? `Welcome back, ${name}` : "Welcome back"}
      </Typography>

      <Typography
        color="text.secondary"
      >
        Manage your productivity today.
      </Typography>
    </Box>
  );
}

export default Navbar;