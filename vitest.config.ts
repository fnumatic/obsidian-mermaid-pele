import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
    resolve: {
        alias: {
            obsidian: path.join(import.meta.dirname, 'src/__mocks__/obsidian.ts'),
        },
    },
    test: {
        environment: 'node',
        globals: true,
        include: ['src/**/*.test.ts'],
    },
});
