import { PaletteMode } from '@mui/material';
import React, { createContext } from 'react';

export const colorThemeContext = createContext<{
  mode: PaletteMode;
  toggleColorMode: () => void;
}>({
  mode: 'dark',
  toggleColorMode: () => {},
});

export const ColorThemeProvider = colorThemeContext.Provider;

export const useColorTheme = () => React.useContext(colorThemeContext);
