const js = require("@eslint/js");

module.exports = [
  js.configs.recommended,
  {
    ignores: ["node_modules/**", "public/css/output.css", "coverage/**"],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        require: "readonly",
        module: "writable",
        exports: "writable",
        process: "readonly",
        __dirname: "readonly",
        console: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  {
    files: ["public/js/**/*.js"],
    languageOptions: {
      sourceType: "script",
      globals: {
        window: "readonly",
        document: "readonly",
        localStorage: "readonly",
        fetch: "readonly",
        console: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        URLSearchParams: "readonly",
        gsap: "readonly",
      },
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      globals: { describe: "readonly", test: "readonly", expect: "readonly", beforeAll: "readonly", afterAll: "readonly", it: "readonly" },
    },
  },
];
