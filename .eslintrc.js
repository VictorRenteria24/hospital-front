module.exports = {
    root: true,
    env: {
      browser: true,
      node: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:vue/vue3-essential'
    ],
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    globals: {
      defineProps: 'readonly',
      defineEmits: 'readonly'
    },
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  };
  