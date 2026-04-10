"use client";

import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3c8dbc",
      dark: "#2c6d95",
      light: "#67a7cf"
    },
    secondary: {
      main: "#00a65a"
    },
    background: {
      default: "#f4f6f9",
      paper: "#ffffff"
    },
    text: {
      primary: "#1f2d3d",
      secondary: "#6c757d"
    },
    success: {
      main: "#00a65a"
    },
    warning: {
      main: "#f39c12"
    },
    info: {
      main: "#00c0ef"
    }
  },
  shape: {
    borderRadius: 6
  },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h3: {
      fontWeight: 600,
      letterSpacing: "-0.02em"
    },
    h4: {
      fontWeight: 600
    },
    h5: {
      fontWeight: 600,
      letterSpacing: "-0.01em"
    },
    h6: {
      fontWeight: 600
    },
    body2: {
      fontSize: "0.92rem"
    },
    button: {
      textTransform: "none",
      fontWeight: 600
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          border: "1px solid #dee2e6",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.08)"
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          borderRadius: 6
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          paddingInline: 16,
          boxShadow: "none"
        },
        containedPrimary: {
          "&:hover": {
            boxShadow: "none"
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: "#e9ecef"
        },
        head: {
          color: "#495057",
          backgroundColor: "#f8f9fa",
          fontWeight: 700
        }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          transition: "all 160ms ease",
          borderRadius: 4
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
          backgroundColor: "#ffffff",
          borderRadius: 4
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 4
        }
      }
    }
  }
});
