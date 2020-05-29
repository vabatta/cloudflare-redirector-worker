module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	roots: ['./src'],
	testMatch: ['**/*.spec.ts'],
	// collectCoverage: true,
	collectCoverageFrom: ['**/*.ts', '!**/*.spec.ts', '!**/*.d.ts'],
	coverageDirectory: 'coverage'
};
