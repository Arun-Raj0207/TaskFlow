import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    background: {
      default: "#f5f5f7",
    },
    primary: {
      main: "#0071e3",
    },
    text: {
      primary: "#1d1d1f",
      secondary: "#6e6e73",
    },
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily:
      "-apple-system, BlinkMacSystemFont, sans-serif",
  },
});

export default theme;