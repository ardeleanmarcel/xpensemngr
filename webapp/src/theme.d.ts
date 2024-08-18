// src/theme.d.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    customBackground?: Palette['primary'];
    inputsColor: Palette['primary'];
  }

  interface PaletteOptions {
    customBackground?: PaletteOptions['primary'];
    inputsColor?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/TextField' {
  interface TextFieldPropsColorOverrides {
    inputsColor: true;
  }
}
