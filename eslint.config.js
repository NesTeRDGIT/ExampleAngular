// @ts-check
import  eslint from '@eslint/js';
import tsEslint from 'typescript-eslint'
import angular from 'angular-eslint';

// Export our config array, which is composed together thanks to the typed utility function from typescript-eslint
export default tsEslint.config(
  {    
    files: ['**/*.ts'],
    extends: [     
      eslint.configs.recommended,
      ...tsEslint.configs.recommended,
      ...tsEslint.configs.stylistic,
      ...angular.configs.tsRecommended
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        projectService: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'zms',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'zms',
          style: 'kebab-case',
        }
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@angular-eslint/no-input-rename": "off",
      "@angular-eslint/prefer-on-push-component-change-detection": "error",
      "@angular-eslint/no-duplicates-in-metadata-arrays": "error",
      "@angular-eslint/use-lifecycle-interface": "error",
      "@typescript-eslint/await-thenable": "error",
      "@typescript-eslint/explicit-function-return-type": ["error",
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true
        }
      ],
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/return-await": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/prefer-includes": "error",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-find": "error",
      "no-throw-literal": "off",
      "@typescript-eslint/only-throw-error": "error",
       "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error"
    },
  },
  {
    extends: [    
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility
    ],
    files: ['**/*.html'],    
    rules: {
      "@angular-eslint/template/prefer-self-closing-tags": "error"
    },
  },
);