import { defineConfig } from 'vitest/config';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    resolve: {
        alias: {
            obsidian: resolve(__dirname, 'src/__mocks__/obsidian.ts'),
            src: resolve(__dirname, 'src'),
        },
    },
    test: {
        environment: 'node',
        globals: true,
        include: ['src/**/*.test.ts'],
    },
});
