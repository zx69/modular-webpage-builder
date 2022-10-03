const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  globals: {
    globalThis: false,
    __adobe_cep__: 'readonly',
    cep_node: 'readonly',
    NodeJS: 'readonly',
    GetArrayItem: 'readonly',
    AsyncReturnType: 'readonly',
    Obj: 'readonly',
    valueof: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-mixed-operators': [
      'error', {
        groups: [
          ['&', '|', '^', '~', '<<', '>>', '>>>'],
          ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
          ['&&', '||'],
          ['in', 'instanceof'],
        ],
        allowSamePrecedence: true,
      },
    ],
    'no-multiple-empty-lines': ['error', {
      max: 2,
    }],
    'no-console': isProd ? ['warn', {
      allow: ['warn', 'error', 'info', 'groupCollapsed', 'group', 'groupEnd'],
    }] : 'off',
    'no-debugger': isProd ? 'warn' : 'off',
    'no-await-in-loop': 0,
    'no-empty': ['error', {
      allowEmptyCatch: true,
    }],
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'no-underscore-dangle': 0,
    'max-classes-per-file': 'off',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', {
      vars: 'all',
      args: 'after-used',
      ignoreRestSiblings: false,
    }],
    'no-redeclare': 'off',
    '@typescript-eslint/no-redeclare': ['error', {
      ignoreDeclarationMerge: true,
    }],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    semi: 0,
    '@typescript-eslint/semi': ['error', 'always'],
    quotes: 0,
    '@typescript-eslint/quotes': ['error', 'single'],
    'lines-between-class-members': 'off',
    'global-require': 0,
    'arrow-parens': 0,
    'arrow-body-style': 0,
    'prefer-const': ['error', {
      destructuring: 'all',
    }],
    'no-nested-ternary': 1,
    'max-len': [
      'error',
      {
        code: 150,
      },
    ],
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': [
      1,
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],
    'import/order': ['error', {
      pathGroups: [
        {
          pattern: '@/**',
          group: 'external',
        },
        {
          pattern: '_/**',
          group: 'external',
        },
      ],
      groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
    }],

    'import/extensions': 0,
    'import/named': 0,
    'import/no-cycle': 0,
    'import/no-named-as-default': 0,
    'import/no-extraneous-dependencies': 0,
    'vue/custom-event-name-casing': 'warn',
    'vue/no-mutating-props': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'vuejs-accessibility/mouse-events-have-key-events': 'off',
  },
};
