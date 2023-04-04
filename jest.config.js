module.exports = {
  runner: "groups",
  testRunner: "jest-circus/runner",
  verbose: true,
  collectCoverage: true,  
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "/__tests__/.*(test|spec)\\.((t|j)sx?)$",
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  moduleNameMapper: {},
  moduleDirectories: ["node_modules", "src"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
};
