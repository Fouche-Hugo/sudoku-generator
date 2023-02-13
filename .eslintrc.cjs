// basic config file for svelte
module.exports = {
  extends: ['standard-with-typescript', 'prettier'],
  plugins: ['svelte3', 'html', '@html-eslint'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      files: ['*.html'],
      parser: '@html-eslint/parser',
      extends: ['plugin:@html-eslint/recommended'],
      rules: {
        '@html-eslint/require-closing-tags': [
          2,
          {
            selfClosing: 'always',
          },
        ],
        '@html-eslint/no-extra-spacing-attrs': [
          2,
          { enforceBeforeSelfClose: true },
        ],
      },
    },
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      rules: {
        'no-use-before-define': 'off',
      },
    },
  ],
  env: {
    browser: true,
    es2021: true,
  },
  // parserOptions: {
  //   ecmaVersion: 'latest',
  //   sourceType: 'module',
  //   project: './tsconfig.json',
  // },
  rules: {
    'no-var': 'error',
    semi: 'error',
  },
  settings: {
    'svelte3/typescript': true,
  },
}
