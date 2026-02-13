import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';

/**
 * Reconstructs directory context for the ESM runtime.
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '');

  /**
   * Resolves host and port used by the dev server and HMR client.
   */
  const viteHost = env.VITE_HOST || 'localhost';
  const vitePort = Number(env.VITE_PORT) || 5173;

  /**
   * Applies dev-server exposure only when running `vite` (serve).
   * Production builds do not require a dev server configuration.
   */
  const isDevServer = command === 'serve';

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
       * Ensures a single instance for React related packages.
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
           * Groups vendor core and internal i18n modules into dedicated chunks.
           */
          manualChunks: (id) => {
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

            if (id.includes('resources/js/common/i18n')) {
              return 'app-i18n';
            }

            return undefined;
          },
        },
      },
    },
    server: isDevServer
      ? {
          host: env.VITE_BIND || '0.0.0.0',
          port: vitePort,
          strictPort: true,
          cors: {
            origin: [
              `http://${viteHost}`,
              `http://${viteHost}:80`,
              'http://localhost',
              'http://localhost:80',
            ],
          },
          hmr: {
            host: viteHost,
            port: vitePort,
            clientPort: vitePort,
            protocol: 'ws',
          },
        }
      : undefined,
  };
});
