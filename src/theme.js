import { createTheme } from '@mui/material/styles';

// Define core colors based on screenshots
const PRIMARY_COLOR = '#28A79F'; // Teal
const SECONDARY_COLOR = '#6c757d'; // Grey for secondary elements
const BACKGROUND_DEFAULT = '#F8F9FA'; // Light grey main background
const BACKGROUND_PAPER = '#FFFFFF'; // White for cards, paper
const TEXT_PRIMARY = '#212529'; // Dark grey/black
const TEXT_SECONDARY = '#6c757d'; // Medium grey
const BORDER_RADIUS = 8;

// Create the MUI theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY_COLOR,
      contrastText: '#ffffff', // White text on primary background
    },
    secondary: {
      main: SECONDARY_COLOR,
      contrastText: '#ffffff',
    },
    background: {
      default: BACKGROUND_DEFAULT,
      paper: BACKGROUND_PAPER,
    },
    text: {
      primary: TEXT_PRIMARY,
      secondary: TEXT_SECONDARY,
    },
    action: {
      active: PRIMARY_COLOR, // Use primary color for active icons/elements
      hover: 'rgba(40, 167, 159, 0.08)', // Light teal hover for list items etc.
    },
    divider: 'rgba(0, 0, 0, 0.08)', // Lighter divider
    // Add other colors if needed (success, error, warning, info)
    success: {
      main: '#28a745', // Example green
    },
    error: {
      main: '#dc3545', // Example red
    },
    warning: {
        main: '#ffc107', // Example yellow/orange
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h4: {
        fontWeight: 700,
        fontSize: '1.75rem',
        color: TEXT_PRIMARY,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
      color: TEXT_PRIMARY,
    },
    h6: {
        fontWeight: 600,
        fontSize: '1.25rem',
        color: TEXT_PRIMARY,
    },
    subtitle1: {
        color: TEXT_SECONDARY,
    },
    body1: {
        color: TEXT_PRIMARY,
    },
    body2: {
        color: TEXT_SECONDARY,
    },
    button: {
        textTransform: 'none', // Prevent uppercase buttons by default
        fontWeight: 600,
    }
  },
  shape: {
    borderRadius: BORDER_RADIUS,
  },
  components: {
    // --- Global Component Overrides --- 
    MuiCssBaseline: {
        styleOverrides: {
            body: {
                backgroundColor: BACKGROUND_DEFAULT, // Ensure body background matches theme
            }
        }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS,
          boxShadow: 'none',
          '&:hover': {
              boxShadow: 'none',
          }
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#239089', // Slightly darker teal on hover
          },
        },
        // Add styles for outlined, text variants if needed
      },
    },
    MuiTextField: {
        defaultProps: {
            variant: 'outlined',
            size: 'small',
        }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: BORDER_RADIUS,
          backgroundColor: BACKGROUND_PAPER,
          // Remove default outline unless focused
          '& fieldset': {
             borderColor: 'rgba(0, 0, 0, 0.1)', // Subtle border
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(0, 0, 0, 0.2)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: PRIMARY_COLOR,
            borderWidth: '1px',
          },
        },
        // Specific style for search bars if needed (e.g., no border)
        // Consider adding a className for search bars and targetting that
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: BACKGROUND_PAPER,
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)', // Subtle shadow for paper
          borderRadius: BORDER_RADIUS,
        },
      },
    },
    MuiAppBar: {
        styleOverrides: {
            root: {
                backgroundColor: BACKGROUND_PAPER,
                color: TEXT_PRIMARY,
                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.05)', // Consistent shadow
            }
        }
    },
    MuiDrawer: {
        styleOverrides: {
            paper: {
                borderRight: 'none',
            }
        }
    },
    MuiChip: {
        styleOverrides: {
            root: {
                borderRadius: BORDER_RADIUS / 2, // Slightly smaller radius for chips
                fontWeight: 500,
            }
        }
    },
    MuiListItemButton: {
        styleOverrides: {
            root: {
                borderRadius: BORDER_RADIUS,
                '&.Mui-selected': {
                    backgroundColor: PRIMARY_COLOR,
                    color: '#ffffff',
                    '& .MuiListItemIcon-root': {
                        color: '#ffffff',
                    },
                    '&:hover': {
                        backgroundColor: '#239089', // Darker primary on hover
                    }
                },
                '&:hover': {
                     backgroundColor: 'rgba(40, 167, 159, 0.08)', // Use theme action hover
                }
            }
        }
    },
    MuiTableHead: {
        styleOverrides: {
            root: {
                backgroundColor: '#F1F3F4', // Light grey for table headers
                 '& .MuiTableCell-root': {
                    fontWeight: 600,
                    color: TEXT_PRIMARY,
                 }
            }
        }
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                borderColor: 'rgba(0, 0, 0, 0.05)', // Lighter table cell borders
            }
        }
    },
    MuiAccordion: {
        styleOverrides: {
            root: {
                boxShadow: 'none',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: BORDER_RADIUS,
                 '&:before': {
                    display: 'none', // Remove default top border line
                },
                '&.Mui-expanded': {
                    margin: '8px 0', // Adjust margin when expanded
                }
            },
        }
    },
    MuiAccordionSummary: {
        styleOverrides: {
            root: {
                 borderRadius: BORDER_RADIUS,
                '&.Mui-expanded': {
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                }
            }
        }
    },
    MuiAccordionDetails: {
        styleOverrides: {
            root: {
                 borderBottomLeftRadius: BORDER_RADIUS,
                 borderBottomRightRadius: BORDER_RADIUS,
                 paddingTop: 0,
                 paddingBottom: '16px',
            }
        }
    }
    // Add more component overrides as needed based on detailed review
  },
});

export default theme; 