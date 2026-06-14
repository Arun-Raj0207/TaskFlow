import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  Box,
  Paper,
  TextField,
  Typography,
  Button,
} from "@mui/material";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event?.preventDefault();
    try {
      setErrorMessage("");
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", response.data.token);
      const userName = response.data.name || response.data.user?.name || "";
      localStorage.setItem("name", userName);
      localStorage.setItem("userName", userName);
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message || "Invalid credentials"
      );
    }
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f7",
      }}
    >
      <Paper
        elevation={0}
        sx={{
  p: 5,
  width: 440,
  borderRadius: 6,
  border: "1px solid #e5e5e5",
  transition: "0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
  },
}}
      >
        <Box mb={5}>
  <Typography
    variant="h3"
    fontWeight={700}
    sx={{
      letterSpacing: "-0.03em",
      lineHeight: 1.05,
    }}
  >
    TaskFlow
  </Typography>

  <Typography
    mt={1}
    textAlign="center"
    color="text.secondary"
    sx={{
      fontSize: "1rem",
      fontWeight: 500,
      letterSpacing: "0.01em",
      opacity: 0.88,
      maxWidth: 360,
      mx: "auto",
    }}
  >
    Stay organized. Stay focused.
  </Typography>
</Box>
        <Box component="form" onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              mb: 2.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#fff",
                "&.Mui-focused": {
                  backgroundColor: "#fff",
                },
                "&:hover": {
                  backgroundColor: "#fff",
                },
              },
              "& .MuiOutlinedInput-input": {
                backgroundColor: "#fff",
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #fff inset",
                  WebkitTextFillColor: "#000",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: "#fff",
                "&.Mui-focused": {
                  backgroundColor: "#fff",
                },
                "&:hover": {
                  backgroundColor: "#fff",
                },
              },
              "& .MuiOutlinedInput-input": {
                backgroundColor: "#fff",
                "&:-webkit-autofill": {
                  WebkitBoxShadow: "0 0 0 1000px #fff inset",
                  WebkitTextFillColor: "#000",
                },
              },
            }}
          />

          {errorMessage && (
            <Typography color="error" mb={2}>
              {errorMessage}
            </Typography>
          )}
          <Button
            fullWidth
            variant="contained"
            size="large"
            type="submit"
            sx={{
              py: 1.5,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Sign In
          </Button>
        </Box>
        <Typography
  mt={3}
  textAlign="center"
>
  Don't have an account?{" "}
  <Link
    to="/register"
    style={{
      textDecoration: "none",
      color: "#0071e3",
      fontWeight: "600",
    }}
  >
    Register
  </Link>
</Typography>
      </Paper>
    </Box>
  );
}
export default Login;