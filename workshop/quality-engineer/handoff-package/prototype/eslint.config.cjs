// Minimal ESLint flat config (no 'extends' to avoid migration issues)
const globals = require('globals')

module.exports = [
  {
    ignores: ['node_modules/**', 'db.json', 'static/**', 'coverage/**', '.github/**']
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: Object.assign({}, globals.browser, globals.node, globals.jest)
    },
    rules: {
      // basic recommended-like rules
      'no-unused-vars': ['warn', { args: 'none', vars: 'all' }],
      'no-undef': 'error',
      'no-console': 'off'
    }
  }
]
