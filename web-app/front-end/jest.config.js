module.exports = {
    testEnvironment: 'jsdom',
    collectCoverage: true,
    moduleDirectories: [
        'node_modules',
        'src/modules',
    ],
    'moduleNameMapper': {
        '.(scss|css|sass)$': '<rootDir>/__mocks__/emptyMock.js',
        '.svg': '<rootDir>/__mocks__/emptyMock.js',
    },
    modulePathIgnorePatterns: ['<rootDir>/__tests__/transformers/'],
    setupFiles: [
        '<rootDir>/jest.setup.js',
    ],
};
