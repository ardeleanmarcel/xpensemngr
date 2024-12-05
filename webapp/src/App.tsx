import React, { createContext, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import {
  GlobalStyles,
  PaletteMode,
  ThemeProvider,
  createTheme,
} from '@mui/material';

import { UserContextProvider } from './contexts/user/UserContextProivder';
import { NotificationContextProvider } from './contexts/notification/NotificationContextProvider';
import { EmailForNewPassword } from './Pages/Home/EmailForNewPassword';
import { VerifyEmail } from './Pages/VerifyEmail/VerifyEmail';
import { ProtectedExpensesDashboard } from './Pages/Expenses/ExpensesDashboard/ExpensesDashboard';
import { ProtectedAddExpensesPage } from './Pages/Expenses/AddExpenses/AddExpenses';
import Register from './Pages/Register/Register';
import LoginWithFormik from './Pages/Home/Home';
import MenuNavigation from './Pages/Expenses/AddExpenses/MenuNavigation';
import { ProtectedManageLabels } from './Pages/Expenses/ManageLabels/ManageLabels';

// TODO -> check best practices for this
import './css/fonts.scss';
import './css/colors.scss';
import './App.scss';

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
    setMode((prevMode: PaletteMode) =>
      prevMode === 'light' ? 'dark' : 'light'
    );
  };

  // Update the theme only if the mode changes
  const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <UserContextProvider>
      <ColorModeContext.Provider
        value={{
          mode,
          toggleColorMode,
        }}
      >
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
              <MenuNavigation />
              <Routes>
                <Route path="/" element={<LoginWithFormik />} />
                <Route path="register" element={<Register />} />
                <Route path="reset-email" element={<EmailForNewPassword />} />
                <Route path="verify-email" element={<VerifyEmail />} />
                <Route
                  path="add-expenses"
                  element={<ProtectedAddExpensesPage />}
                />
                <Route
                  path="expenses-dashboard"
                  element={<ProtectedExpensesDashboard />}
                />
                <Route
                  path="expense-labels"
                  element={<ProtectedManageLabels />}
                />
              </Routes>
            </BrowserRouter>
          </NotificationContextProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </UserContextProvider>
  );
}
