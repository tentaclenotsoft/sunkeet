module.exports = {
  env: {
    es2021: true,
    node: true,
    jest: true
  },
  extends: ['standard', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prettier', 'eslint-plugin-import-helpers'],
  rules: {
    'import-helpers/order-imports': [
      'warn',
      {
        newlinesBetween: 'always',
        groups: ['module', ['parent', 'sibling', 'index']],
        alphabetize: { order: 'asc', ignoreCase: true }
      }
    ],
    'space-before-function-paren': ['error', 'always'],
    'prettier/prettier': 'off'
  }
}
