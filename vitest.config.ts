import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import { loadEnv } from 'vite'
import { resolve } from 'node:path';

export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        include: ['**/*.test.tsx'],
        environment: 'jsdom',
        globals: true,
        env: loadEnv('', process.cwd(), ''),
        setupFiles: ['__tests__/setup/setup.tsx', 'dotenv/config']
    },
    resolve: {
        alias: [{ find: '@', replacement: resolve(__dirname, './') }]
    }
})