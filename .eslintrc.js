module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    //edited for prettier use;
    'airbnb-base',
    'prettier',
  ],
  //created for prettier use
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    //edited
    "prettier/prettier": "error", //eslint will recognize prettier errors
    "class-methods-use-this": "off", //may write methods without "this"
    "no-param-reassign": "off", //sequelize needs this configuration
    "camelcase": "off",
    "no-unused-vars": ["error", { "argsIgnorePattern": "next"}],
    //needed to use "next" of express

  },
};
