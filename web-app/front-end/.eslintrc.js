module.exports =  {
    parser:  '@typescript-eslint/parser',  // Specifies the ESLint parser
    extends:  [
        'eslint:recommended',
        'plugin:react/recommended',  // Uses the recommended rules from @eslint-plugin-react
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from @typescript-eslint/eslint-plugin
    ],
    env: {
        browser: true,
    },
    parserOptions:  {
        ecmaVersion:  2018,  // Allows for the parsing of modern ECMAScript features
        sourceType:  'module',  // Allows for the use of imports
        ecmaFeatures:  {
            jsx:  true,  // Allows for the parsing of JSX
        },
    },
    plugins: ['import'],
    rules:  {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'indent': ['error', 4],
        'no-param-reassign': ['error', { 'props': false }],
        '@typescript-eslint/interface-name-prefix' : [2, { 'prefixWithI': 'always' }],
        'quotes': [2, 'single', { 'avoidEscape': true }],
        'jsx-quotes': [2, 'prefer-single'],
        'import/no-commonjs': [2],
        'import/no-amd': [2],
        'comma-dangle': ['error', 'always-multiline'],
    },
    settings:  {
        react:  {
            version:  'detect',  // Tells eslint-plugin-react to automatically detect the version of React to use
        },
        'naming-convention': [
            {
                selector: 'interface',
                format: 'camelCase',
                prefix: 'I',
            }
        ],
    },
};
