import { createTheme } from '@mui/material/styles';

// Create a theme instance with the custom font
const theme = createTheme({
  typography: {
    fontFamily: 'Source Sans 3, Arial, sans-serif', // Set the custom font
    h1: {
      fontFamily: 'Source Sans 3, Arial, sans-serif',
    },
    h2: {
      fontFamily: 'Source Sans 3, Arial, sans-serif',
    },
    body1: {
      fontFamily: 'Source Sans 3, Arial, sans-serif',
    },
    // Add more typography variants if needed
  },
});

export default theme;
