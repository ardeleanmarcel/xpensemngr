import eslint from '@eslint/js';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';
import eslintGlobals from 'globals';
import tseslint, { parser } from 'typescript-eslint';

const globals = {
  React: 'readonly',
  ...eslintGlobals.browser,
};

delete globals['AudioWorkletGlobalScope ']; // workaround fix because this global has a trailing space

export default tseslint.config(
  { ...eslint.configs.recommended, files: ['src/**/*.{js,jsx,ts,tsx}'] },
  tseslint.configs.recommended, // TODO -> need to stop this from linting the dist folder
  {
    plugins: {
      'react-hooks': eslintPluginReactHooks,
    },
  },
  // eslintPluginReactHooks.configs.recommended, // TODO -> does not work with eslint new config file structure
  // storybook.configs.recommended, // TODO -> does not work with eslint new config file structure
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals,
      parser: tseslint.parser,
    },
  }
  // plugins: {
  //   'react-refresh': reactRefresh,
  // },

  //
  //   parser: '@typescript-eslint/parser',

  //   rules: {
  //     'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  //   },
  // },
);

// export default [
//   { ...eslint.configs.recommended, files: ['src/**/*.{js,jsx,ts,tsx}'] },
//   // tseslint.configs.recommended,
//   {
//     plugins: {
//       'react-hooks': eslintPluginReactHooks,
//     },
//   },
//   // eslintPluginReactHooks.configs.recommended, // TODO -> does not work with eslint new config file structure
//   // storybook.configs.recommended, // TODO -> does not work with eslint new config file structure
//   {
//     plugins: {
//       'simple-import-sort': simpleImportSort,
//     },
//     rules: {
//       'simple-import-sort/imports': 'error',
//       'simple-import-sort/exports': 'error',
//     },
//   },
//   {
//     languageOptions: {
//       ecmaVersion: 'latest',
//       globals,
//       parser: tseslint.parser,
//     },
//   },
//   // plugins: {
//   //   'react-refresh': reactRefresh,
//   // },

//   //
//   //   parser: '@typescript-eslint/parser',

//   //   rules: {
//   //     'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
//   //   },
//   // },
// ];
