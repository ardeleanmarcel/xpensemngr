import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import {
  Button,
  GlobalStyles,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import Register from './Pages/Register/Register';
import LoginWithFormik from './Pages/Home/Home';
import './App.css';
import { EmailForNewPassword } from './Pages/Home/EmailForNewPassword';

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#4B0082',
          },
          secondary: {
            main: '#121212',
          },
          inputsColor: {
            main: '#121212',
          },
          background: {
            default: '#F8F8FF',
          },
          text: {
            primary: '#141414 ',
            secondary: '#4B0082',
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#4B0082',
          },
          secondary: {
            main: '#F8F8FF',
          },
          inputsColor: {
            main: '#F8F8FF',
          },
          background: {
            default: '#121212',
          },
          text: {
            primary: '#F5F5F5',
            secondary: '#ffcccb',
          },
        }),
  },
  components: {
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          style: {
            color: mode === 'light' ? '#121212' : '#F8F8FF', // Default label color for TextField
          },
        },
      },
    },
  },
});

export const ColorModeContext = React.createContext({
  mode: 'light',
  toggleColorMode: () => {},
});

export default function App() {
  const [mode, setMode] = React.useState<PaletteMode>('light');
  const colorMode = React.useMemo(
    () => ({
      // The dark mode switch would invoke this method
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light'
        );
      },
    }),
    []
  );

  const changeTheme = () => {
    setMode((prevMode: PaletteMode) =>
      prevMode === 'light' ? 'dark' : 'light'
    );
  };

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ColorModeContext.Provider
      value={{ mode, toggleColorMode: colorMode.toggleColorMode }}
    >
      <ThemeProvider theme={theme}>
        <GlobalStyles
          styles={{
            body: {
              backgroundColor: theme.palette.background.default,
            },
          }}
        />
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          onClick={changeTheme}
          sx={{
            top: 50,
          }}
        >
          {mode === 'light' ? 'Dark Theme' : 'Light Theme'}
        </Button>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginWithFormik />} />
            <Route path="register" element={<Register />} />
            <Route path="reset-email" element={<EmailForNewPassword />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
