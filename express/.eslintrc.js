module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  rules: { 'prettier/prettier': 'error', 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off', 'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off' },
}
// module.exports = {
//   root: true,
//   env: {
//     node: true,
//   },
//   extends: ['plugin:vue/essential', 'eslint:recommended', '@vue/prettier'],
//   parserOptions: {
//     parser: 'babel-eslint',
//   },
//   rules: {
//     'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//     'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
//   },
// }
