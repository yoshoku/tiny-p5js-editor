import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginVitest from 'eslint-plugin-vitest'
import tseslint from 'typescript-eslint'
import vueParser from 'vue-eslint-parser'
import prettierConfig from '@vue/eslint-config-prettier'
import globals from 'globals'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  prettierConfig,

  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'max-len': ['warn', { code: 96, ignoreStrings: true, ignorePattern: 'd="[^"]*"' }],
      'vue/multi-word-component-names': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },

  {
    files: ['*.config.{js,ts,mjs,cjs}', 'vite.config.ts', '**/*.cjs'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },

  {
    files: ['tests/**/*.test.ts'],
    plugins: {
      vitest: pluginVitest,
    },
    rules: {
      ...pluginVitest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...pluginVitest.environments.env.globals,
      },
    },
  },

  {
    ignores: ['dist/**', 'node_modules/**', '.husky/**', 'public/**', '*.min.js'],
  },
]
