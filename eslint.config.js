import tsParser from '@typescript-eslint/parser';

const browserGlobals = {
  window: 'readonly', document: 'readonly', navigator: 'readonly', localStorage: 'readonly',
  matchMedia: 'readonly', innerWidth: 'readonly', innerHeight: 'readonly', scrollY: 'readonly',
  addEventListener: 'readonly', removeEventListener: 'readonly', requestAnimationFrame: 'readonly',
  cancelAnimationFrame: 'readonly', devicePixelRatio: 'readonly', setTimeout: 'readonly', clearTimeout: 'readonly',
  IntersectionObserver: 'readonly', console: 'readonly', URL: 'readonly', Blob: 'readonly', fetch: 'readonly',
};

export default [
  {
    files: ['src/**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: browserGlobals,
    },
    rules: { 'no-undef': 'error', 'no-unreachable': 'error', 'no-constant-condition': 'error' },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: browserGlobals,
    },
    rules: { 'no-unreachable': 'error', 'no-constant-condition': 'error' },
  },
];
