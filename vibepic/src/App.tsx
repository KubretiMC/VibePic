import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import AppRoutes from './Routes';

function App() {

  const theme = createTheme({
    components: {
      MuiButton: {
        defaultProps: {
          disableTouchRipple: true,
        },
        styleOverrides: {
          root: {
            backgroundColor: 'transparent',
            '&:hover': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
  });
  
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <AppRoutes />
      </ThemeProvider>
    </div>
  );
}

export default App;
