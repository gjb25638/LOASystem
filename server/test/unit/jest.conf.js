const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: [
    'js',
    'json'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest'
  },
  testPathIgnorePatterns: [
    '<rootDir>/test/e2e'
  ],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/shared/report.js',
    // 'src/shared/*.js',
    '!src/shared/collection.js',
    '!src/shared/validation.js',
    '!src/app.js',
    '!**/node_modules/**'
  ]
}
