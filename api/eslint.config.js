import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

const config = [
  {
    rules: {
      'no-undef': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
    },
    files: ['src/**/*.{js,mjs,cjs,ts}'],
  },
  {
    languageOptions: {
      globals: globals.browser,

      parserOptions: {
        project: './tsconfig.json',
      },
      parser: '@typescript-eslint/parser',
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

export default config;
