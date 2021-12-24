// Jest & TypeScript help:
// https://github.com/basarat/typescript-book/blob/master/docs/testing/jest.md
// https://jestjs.io/docs/en/getting-started

module.exports = {
  "roots": [
    "<rootDir>",
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(.*.test).tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "testEnvironment": "node" // Apollo is a service therefore it doesn't need a browser-like env (defaults to jsDom)
}
