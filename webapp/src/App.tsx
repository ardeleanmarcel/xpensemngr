import './App.scss';
// TODO -> check best practices for this (imports might not actually be needed for fonts and colors)
import './css/colors.scss';
import './css/fonts.scss';

import { createTheme, GlobalStyles, PaletteMode, ThemeProvider } from '@mui/material';
import React, { createContext, useMemo, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppLayout } from './components/layout/AppLayout/AppLayout';
import { AuthProtected } from './components/utils/AuthProtected';
import { PATH } from './constants/paths';
import { NotificationContextProvider } from './contexts/notification/NotificationContextProvider';
import { UserContextProvider } from './contexts/user/UserContextProivder';
import { ExpensesDashboard } from './Pages/Expenses/ExpensesDashboard/ExpensesDashboard';
import { ProtectedManageLabels } from './Pages/LabelManagement/LabelManagement';
import LoginWithFormik from './Pages/LandingPage/LandingPage';
import { EmailForNewPassword } from './Pages/ResetPassword/ResetPassword';
import Register from './Pages/UserRegistration/UserRegistration';
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
    <BrowserRouter>
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
              <Routes>
                <Route path="/" element={<LoginWithFormik />} />
                <Route path={PATH.UserRegistration.Segment} element={<Register />} />
                <Route path={PATH.ResetPassword.Segment} element={<EmailForNewPassword />} />
                <Route path="verify-email" element={<VerifyEmail />} />
                <Route path="*" element={null} />
              </Routes>
              <AuthProtected shouldRedirect={false}>
                <AppLayout>
                  <Routes>
                    <Route path={PATH.ExpenseDashboard.Segment} element={<ExpensesDashboard />} />
                    <Route path={PATH.ExpenseLabels.Segment} element={<ProtectedManageLabels />} />
                    <Route path="*" element={null} />
                  </Routes>
                </AppLayout>
              </AuthProtected>
            </NotificationContextProvider>
          </ThemeProvider>
        </ColorModeContext.Provider>
      </UserContextProvider>
    </BrowserRouter>
  );
}
