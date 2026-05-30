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
function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errorMessage, setErrorMessage] = useState("");
const navigate = useNavigate();
const handleRegister = async () => {
  try {
    setErrorMessage("");
    await api.post("/auth/register", {
      name,
      email,
      password,
    });    localStorage.setItem("name", name);
    localStorage.setItem("userName", name);    alert("Account created successfully");
    navigate("/");
  } catch (error) {
    console.error(error);
    setErrorMessage(
      error?.response?.data?.message || "Registration failed"
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
          width: 400,
          borderRadius: 4,
          border: "1px solid #e5e5e5",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={1}
          sx={{
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          Create Account
        </Typography>

        <Typography
          color="text.secondary"
          mb={4}
          sx={{
            fontSize: "1rem",
            fontWeight: 500,
            letterSpacing: "0.01em",
            opacity: 0.88,
            maxWidth: 360,
            mx: "auto",
          }}
        >
          Start organizing your work.
        </Typography>

        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            mb: 2,
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
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{
            mb: 2,
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
          onClick={handleRegister}
        >
          Register
        </Button>
        <Typography
  mt={3}
  textAlign="center"
>
  Already have an account?{" "}
  <Link
    to="/"
    style={{
      textDecoration: "none",
      color: "#0071e3",
      fontWeight: "600",
    }}
  >
    Login
  </Link>
</Typography>
      </Paper>
    </Box>
  );
}
export default Register;