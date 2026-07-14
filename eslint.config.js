// ESLint "flat config" — this is what `npm run lint` reads.
// It checks index.js and the tests for real problems.
module.exports = [
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        // Node.js globals
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        // Jest globals (used in index.test.js)
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'error',  // catches variables you declared but never used
      'no-undef': 'error'         // catches typos / undefined variables
    }
  }
];
