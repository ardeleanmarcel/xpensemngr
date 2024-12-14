import './App.scss';
// TODO -> check best practices for this (imports might not actually be needed for fonts and colors)
import './css/colors.scss';
import './css/fonts.scss';

import { createTheme, GlobalStyles, PaletteMode, ThemeProvider } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { DesktopLayout } from './components/layout/DesktopLayout/DesktopLayout';
import { PATH } from './constants/paths';
import { NotificationContextProvider } from './contexts/notification/NotificationContextProvider';
import { UserContextProvider } from './contexts/user/UserContextProivder';
import { ProtectedExpensesDashboard } from './Pages/Expenses/ExpensesDashboard/ExpensesDashboard';
import { ProtectedManageLabels } from './Pages/Expenses/ManageLabels/ManageLabels';
import { EmailForNewPassword } from './Pages/Home/EmailForNewPassword';
import LoginWithFormik from './Pages/Home/Home';
import Register from './Pages/Register/Register';
import { VerifyEmail } from './Pages/VerifyEmail/VerifyEmail';

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

export const ColorModeContext = createContext<{
  mode: PaletteMode;
  toggleColorMode: () => void;
}>({
  mode: 'dark',
  toggleColorMode: () => {},
});

export default function App() {
  const [mode, setMode] = useState<PaletteMode>('light');

  const toggleColorMode = () => {
    setMode((prevMode: PaletteMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  const themeContext = useMemo(
    () => ({
      mode,
      toggleColorMode,
    }),
    [mode]
  );

  return (
    <UserContextProvider>
      <ColorModeContext.Provider value={themeContext}>
        <ThemeProvider theme={theme}>
          <GlobalStyles
            styles={{
              body: {
                backgroundColor: theme.palette.background.default,
              },
            }}
          />
          <NotificationContextProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LoginWithFormik />} />
                <Route path="register" element={<Register />} />
                <Route path="reset-email" element={<EmailForNewPassword />} />
                <Route path="verify-email" element={<VerifyEmail />} />
                <Route path="*" element={null} />
              </Routes>
              <DesktopLayout>
                <Routes>
                  <Route path={PATH.ExpenseDashboard.Segment} element={<ProtectedExpensesDashboard />} />
                  <Route path={PATH.ExpenseLabels.Segment} element={<ProtectedManageLabels />} />
                  <Route path="*" element={null} />
                </Routes>
              </DesktopLayout>
            </BrowserRouter>
          </NotificationContextProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </UserContextProvider>
  );
}
