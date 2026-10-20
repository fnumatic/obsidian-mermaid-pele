import { defineConfig } from 'vite';
import { builtinModules } from 'module';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, 'src/main.ts'),
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
