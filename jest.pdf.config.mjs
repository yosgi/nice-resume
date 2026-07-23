/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "<rootDir>/src/app"],
  testMatch: ["**/ResumePDF.extreme-layout.test.tsx"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx|mjs)$": [
      "<rootDir>/node_modules/next/dist/build/swc/jest-transformer.js",
      {
        isEsmProject: false,
        resolvedBaseUrl: "<rootDir>/src/app",
        jsConfig: {
          compilerOptions: {
            target: "es2019",
            module: "commonjs",
            jsx: "preserve",
            baseUrl: "<rootDir>/src/app",
          },
        },
      },
    ],
  },
  transformIgnorePatterns: [],
  modulePathIgnorePatterns: ["<rootDir>/.next/"],
};

export default config;
