module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:solid/typescript',
  ],
  plugins: ['@typescript-eslint', 'import', 'solid'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  rules: {
    // '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-default-export': 'off',
    'import/no-duplicates': 'error',
    'import/order': [
      'error',
      {
        'groups': ['external', 'internal', 'parent', 'index', 'sibling', 'type'],
        'newlines-between': 'ignore',
        'alphabetize': { order: 'asc', caseInsensitive: false }
      }
    ],
    'import/prefer-default-export': 'off',
    'camelcase': ['error', { properties: 'never' }],
    'class-methods-use-this': 'off',
    'lines-around-comment': [
      'error',
      {
        beforeBlockComment: false,
        afterBlockComment: false,
        beforeLineComment: false,
        afterLineComment: false,
      },
    ],
    'max-len': 'off',
    // 'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-mixed-operators': 'error',
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'no-tabs': 'error',
    'prefer-promise-reject-errors': 'off',
    'quotes': ['error', 'single', {
      avoidEscape: true,
      allowTemplateLiterals: false,
    }],
    'quote-props': ['error', 'consistent']
  },
  ignorePatterns: ['dist', 'node_modules'],
};