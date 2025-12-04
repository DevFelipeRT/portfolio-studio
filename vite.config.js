// vite.config.ts

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import path from 'path';
import { defineConfig } from 'vite';

/**
 * Vite configuration for Laravel + Blade over LAN or Docker.
 * Uses a fixed dev host (0.0.0.0) and exposes HMR to the browser-facing host.
 * Enables CORS so the Blade page (different port) can load JS/CSS and @vite/client.
 */
const HOST = process.env.VITE_HOST || 'localhost';
const PORT = Number(process.env.VITE_PORT || 5173);

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js/'),
        },
        dedupe: ['react', 'react-dom', 'react-i18next'],
    },
    server: {
        host: '0.0.0.0',
        port: PORT,
        strictPort: true,

        // Allow the Blade origin to fetch assets from the Vite server (different port).
        cors: {
            origin: [`http://${HOST}`, 'http://localhost'],
            credentials: false,
        },

        // Extra safety for some proxy setups.
        headers: {
            'Access-Control-Allow-Origin': '*',
        },

        // HMR: point to the host the browser actually uses to reach your machine.
        hmr: {
            host: HOST,
            port: PORT,
            protocol: 'ws',
            clientPort: PORT,
        },
    },
});
