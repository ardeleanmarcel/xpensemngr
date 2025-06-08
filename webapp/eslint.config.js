import eslint from '@eslint/js';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import storybook from 'eslint-plugin-storybook';
import eslintGlobals from 'globals';
import tseslint from 'typescript-eslint';

const globals = {
  React: 'readonly',
  ...eslintGlobals.browser,
};

delete globals['AudioWorkletGlobalScope ']; // workaround fix because this global has a trailing space

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
  {
    extends: [eslint.configs.recommended, tseslint.configs.recommended],
    files: ['src/**/*.{js,jsx,ts,tsx}', 'eslint.config.js'],
    rules: {
      'require-await': 'error',
    },
  },
  {
    plugins: {
      'react-hooks': eslintPluginReactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    plugins: {
      storybook: storybook,
    },
  },
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
    plugins: {
      'react-refresh': reactRefresh,
    },
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      globals,
      parser: tseslint.parser,
    },
  }
);
