"use client";

import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0F6B63",
      dark: "#0A4F49",
      light: "#4F9D94"
    },
    secondary: {
      main: "#D97706"
    },
    background: {
      default: "#F6F3EE",
      paper: "rgba(255,255,255,0.92)"
    },
    text: {
      primary: "#1D2433",
      secondary: "#5E6678"
    }
  },
  shape: {
    borderRadius: 8
  },
  typography: {
    fontFamily: '"Manrope", "Avenir Next", "Segoe UI", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: "-0.04em"
    },
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 700,
      letterSpacing: "-0.02em"
    },
    h6: {
      fontWeight: 700
    },
    button: {
      textTransform: "none",
      fontWeight: 700
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          border: "1px solid rgba(15, 107, 99, 0.03)",
          boxShadow: "none"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 4
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 18
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "rgba(15, 107, 99, 0.08)"
        },
        head: {
          color: "#5E6678",
          backgroundColor: "rgba(15, 107, 99, 0.03)"
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: "all 160ms ease"
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined"
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.86)"
        }
      }
    }
  }
});
