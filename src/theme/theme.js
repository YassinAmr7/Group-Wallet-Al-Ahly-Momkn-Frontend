const theme = {
  palette: {
    primary: {
      main: "#FA9905",
      light: "#FED7A2",
      dark: "#CB7C04",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#0A7D6B",
      light: "#E8F6F4",
      dark: "#07594C",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#0A7D6B",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#0A7D6B",
      muted: "#6B7280",
    },
    neutral: {
      white: "#FFFFFF",
      soft: "#F3F4F6",
      border: "#E5E7EB",
    },
  },
  typography: {
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    h1: {
      fontSize: "2.5rem",
      fontWeight: 800,
      lineHeight: 1.1,
    },
    h2: {
      fontSize: "1.5rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      lineHeight: 1.6,
    },
    button: {
      fontSize: "0.95rem",
      fontWeight: 700,
      letterSpacing: "0.02em",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};

export default theme;
