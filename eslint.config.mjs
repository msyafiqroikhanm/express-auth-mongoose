import eslintConfigPrettier from 'eslint-config-prettier';

const rules = {
    'no-console': 'warn',
    semi: ['error', 'always'],
    'no-unused-vars': [
        'warn',
        {
            args: 'all',
            argsIgnorePattern: '^_',
            varsIgnorePattern: '^_',
            ignoreRestSiblings: true,
        },
    ],
    quotes: ['error', 'single'],
    'prefer-const': 'error',
    'no-var': 'error',
    eqeqeq: 'error',
    'no-magic-numbers': [
        'warn',
        {
            ignore: [0, 1, 200, 201, 204, 400, 401, 403, 404, 500],
            ignoreArrayIndexes: true,
            enforceConst: true,
        },
    ],
    'object-curly-spacing': ['error', 'always'],
    'space-infix-ops': 'error',
    'space-in-parens': ['error', 'never'],
    'block-spacing': ['error', 'always'],
};

const languageOptions = {
    ecmaVersion: 'latest',
    sourceType: 'script',
    globals: {
        __dirname: true,
        require: true,
        module: true,
    },
};

export default [
    eslintConfigPrettier,
    {
        ignores: [
            '.github/*',
            '.husky/*',
            'coverage/*',
            'dist/*',
            'docs/*',
            'node_modules/*',
        ],
    },
    {
        name: 'js/default',
        files: ['**/*.js'],
        languageOptions,
        linterOptions: {
            noInlineConfig: false,
            reportUnusedDisableDirectives: true,
        },
        rules,
    },
    {
        name: 'js/test',
        files: ['test/**/*. js'],
        languageOptions,
        linterOptions: {
            noInlineConfig: false,
            reportUnusedDisableDirectives: true,
        },
        rules,
    },
];
