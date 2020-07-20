module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      isolatedModules: true,
    },
  },
  reporters: ["default", "jest-junit"],
  coverageReporters: ["text", "cobertura"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
