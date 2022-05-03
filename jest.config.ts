import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleFileExtensions: ["ts", "tsx", "js"],
  testEnvironment: "jest-environment-node",
  automock: false,
  clearMocks: true,
  watchman: true,
  moduleDirectories: ["node_modules"],
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|js?|tsx?|ts?)$",
  preset: "ts-jest",
  globals: {
    NODE_ENV: "test",
  },
  transform: {},
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "<rootDir>/configs/",
    "jest.config.ts",
    ".json",
    ".snap",
  ],
  coverageReporters: ["json", "lcov", "text", "text-summary"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/mocks.ts",
    "\\.(css|less|scss)$": "<rootDir>/__mocks__/mocks.ts",
  },
  testTimeout: 20000,
};

export default config;
