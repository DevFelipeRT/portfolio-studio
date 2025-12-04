import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

/**
 * Reconstructs directory context for ESM environment.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    const host = env.VITE_HOST || 'localhost';
    const port = parseInt(env.VITE_PORT || '5173');

    return {
        plugins: [
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.tsx'],
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        resolve: {
            /**
             * Forces resolution to a single instance of React packages.
             */
            dedupe: ['react', 'react-dom', 'react-i18next', 'i18next'],
            alias: {
                '@': path.resolve(__dirname, './resources/js/'),
                react: path.resolve(__dirname, 'node_modules/react'),
                'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    /**
                     * Defines manual chunking strategies for vendor and internal core logic.
                     */
                    manualChunks: (id) => {
                        // Strategy 1: External Vendor Core
                        if (id.includes('node_modules')) {
                            if (
                                id.includes('react') ||
                                id.includes('react-dom') ||
                                id.includes('i18next') ||
                                id.includes('@inertiajs')
                            ) {
                                return 'vendor-core';
                            }
                        }

                        // Strategy 2: Internal I18n Core
                        // Groups the i18n context definition and provider into a shared chunk.
                        if (id.includes('resources/js/i18n')) {
                            return 'app-i18n';
                        }
                    },
                },
            },
        },
        server: {
            host: '0.0.0.0',
            port: port,
            strictPort: true,
            cors: {
                origin: '*',
                credentials: true,
            },
            hmr: {
                host: host === 'localhost' ? 'localhost' : host,
                clientPort: port,
            },
        },
    };
});
