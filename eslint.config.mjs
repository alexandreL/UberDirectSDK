import importPlugin from 'eslint-plugin-import'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import eslintJs from '@eslint/js'
import eslintTs from 'typescript-eslint'
import stylisticTs from '@stylistic/eslint-plugin-ts'
import stylistic from '@stylistic/eslint-plugin'


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
        '@stylistic/ts': stylisticTs,
        '@stylistic': stylistic,
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
        '@stylistic/ts/indent': [ 'error', 4 ],
        '@stylistic/ts/semi': [ 'error', 'never' ],
        '@stylistic/ts/quotes': [ 'error', 'single' ],
        '@stylistic/ts/object-curly-newline': 'error',
        '@stylistic/ts/object-curly-spacing': [
            'error',
            'always',
        ],
        '@stylistic/array-bracket-spacing': [
            'error',
            'always',
        ],
        '@stylistic/array-element-newline': [
            'error',
            'consistent',
        ],
        '@stylistic/comma-dangle': [
            'error',
            'always-multiline',
        ],
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
