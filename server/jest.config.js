/** @type {import('ts-jest').JestConfigWithTsJest} **/
process.env.NODE_ENV = "test";
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
};