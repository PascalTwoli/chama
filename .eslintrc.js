module.exports = {
  root: true,
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'build/',
    'coverage/',
    'generated/',
    '*.config.js',
    '*.config.ts',
  ],
  overrides: [
    {
      files: ['chama-core/**/*'],
      extends: ['./chama-core/.eslintrc.js'],
    },
    {
      files: ['chama-frontend/**/*'],
      extends: ['./chama-frontend/.eslintrc.js'],
    },
  ],
};

