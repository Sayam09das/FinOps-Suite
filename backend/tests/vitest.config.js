"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("vitest/config");
const path_1 = __importDefault(require("path"));
const vite_tsconfig_paths_1 = __importDefault(require("vite-tsconfig-paths"));
exports.default = (0, config_1.defineConfig)({
    plugins: [(0, vite_tsconfig_paths_1.default)()],
    test: {
        globals: true,
        environment: 'node',
        include: ['tests/**/*.{test,spec}.ts'],
        exclude: ['node_modules', 'dist'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['tests/setup.ts', '**/*.d.ts'],
        },
        setupFiles: ['tests/setup.ts'],
    },
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, '../src'),
        },
    },
});
