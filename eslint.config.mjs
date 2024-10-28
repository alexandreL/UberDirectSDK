import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import eslintJs from '@eslint/js'
import eslintTs from 'typescript-eslint'
import stylisticTs from '@stylistic/eslint-plugin-ts'


const tsFiles = [ '{src,example}/**/*.ts' ]

const languageOptions = {
    globals: {
        ...globals.node,
    },
    ecmaVersion: 2023,
    sourceType: 'module',
}

const customTypescriptConfig = {
    files: tsFiles,
    plugins: {
        import: importPlugin,
        'import/parsers': tsParser,
        '@stylistic/ts': stylisticTs
    },
    languageOptions: {
        ...languageOptions,
        parser: tsParser,
        parserOptions: {
            project: './tsconfig.json',
        },
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': [ '.ts' ],
        },
    },
    rules: {
        ...importPlugin.configs.typescript.rules,
        '@stylistic/ts/indent': ['error', 4],
        '@stylistic/ts/semi': ['error', 'never'],
        '@stylistic/ts/quotes': ['error', 'single'],
        'object-curly-newline': 'error',
        'object-curly-spacing': [
            'error',
            'always',
        ],
        'no-duplicate-imports': 'error',
    },
}

// Add the files for applying the recommended TypeScript configs
// only for the Typescript files.
// This is necessary when we have the multiple extensions files
// (e.g. .ts, .tsx, .js, .cjs, .mjs, etc.).
const recommendedTypeScriptConfigs = [
    ...eslintTs.configs.recommended.map((config) => ({
        ...config,
        files: tsFiles,
    })),
    ...eslintTs.configs.stylistic.map((config) => ({
        ...config,
        files: tsFiles,
    })),

]

export default [
    { ignores: [ 'lib/*', 'dist/*' ] }, // global ignores
    eslintJs.configs.recommended,
    ...recommendedTypeScriptConfigs,
    customTypescriptConfig,
]
