// eslint-disable-next-line no-undef
module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': 'eslint:recommended',
    'overrides': [],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module'
    },
    'rules': {
        'eol-last': ['error', 'always'],
        'indent': ['error', 4],
        'key-spacing': ['error', {'beforeColon': false }],
        'linebreak-style': ['error', 'unix'],
        'no-console': 'error',
        'no-duplicate-imports': 'error',
        'no-multi-spaces': 'error',
        'quotes': ['error', 'single'],
        'semi': ['error', 'never']
    }
}
