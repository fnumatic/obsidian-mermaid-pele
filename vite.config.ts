import { defineConfig } from 'vite';
import { builtinModules } from 'node:module';
import path from 'node:path';

export default defineConfig({
    build: {
        lib: {
            entry: path.join(import.meta.dirname, 'src/main.ts'),
            formats: ['cjs'],
            fileName: () => 'main.js',
            cssFileName: 'styles',
        },
        minify: 'esbuild',
        rollupOptions: {
            external: ['obsidian', 'electron', ...builtinModules],
            output: {
                entryFileNames: 'main.js',
                codeSplitting: false,
                exports: 'named',
            },
        },
        target: 'esnext',
        sourcemap: false,
        emptyOutDir: true,
    },
});
