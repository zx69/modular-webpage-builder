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
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-mixed-operators': [
      'error', {
        groups: [
          // 默认值包含算数运算优先级，项目预设所有人应该熟知运算优先级，所以屏蔽掉
          // ["+", "-", "*", "/", "%", "**"],
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

    // debugger改为警告
    'no-debugger': isProd ? 'warn' : 'off',

    // 在循环里边使用await在一定场合中是合理的
    'no-await-in-loop': 0,

    // 在es2019中catch是可以为空的
    'no-empty': ['error', {
      allowEmptyCatch: true,
    }],

    // 由于一定情况函数实参跟形参类型一样，为了减少变量名，可以重新赋值
    'no-param-reassign': 0,

    // 运行在循环里边使用i++，或者单行的i++，但不建议将i++进行赋值运算
    'no-plusplus': 0,

    // 允许下划线变量以及成员
    'no-underscore-dangle': 0,

    // 一个文件包含多个类被认为没问题
    'max-classes-per-file': 'off',

    // 这个必须覆盖避免只有类型的构造器错误
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

    // 'no-undef': 'off',

    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',

    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    // 团队内部规则认为必须添加分号
    semi: 0,
    '@typescript-eslint/semi': ['error', 'always'],

    // 团队内部规则认为强制使用单引号
    quotes: 0,
    '@typescript-eslint/quotes': ['error', 'single'],

    // 这个置为off是因为避免装饰器被分行
    'lines-between-class-members': 'off',

    // 不要求全局的require函数，对于动态请求也是不可能要求全局的
    'global-require': 0,

    // 不强求箭头函数的括号问题
    'arrow-parens': 0,
    'arrow-body-style': 0,

    // 对于声明，解构的情况，不要求部分变量没重新赋值的情况必须使用const
    // 用于简化解构的写法
    'prefer-const': ['error', {
      destructuring: 'all',
    }],

    // 对于内联的三元运算给予警告，但还是允许编译通过
    'no-nested-ternary': 1,

    // 默认值80有点短，改成150
    'max-len': [
      'error',
      {
        code: 150,
      },
    ],

    // 'max-len': 0,

    // 不允许短路运算和三元运算与函数的结合
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': [
      1,
      {
        allowShortCircuit: true,
        allowTernary: true,
      },
    ],

    // 排序请求
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
    'import/no-extraneous-dependencies': 0, // 历史原因没有使用snake，改成warn
    'vue/custom-event-name-casing': 'warn',
    // https://github.com/vuejs/eslint-plugin-vue/issues/1314
    // 鉴于上述原因，暂时改成warn
    'vue/no-mutating-props': 'warn',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
};
