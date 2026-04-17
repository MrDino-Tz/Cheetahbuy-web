import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath, URL } from 'node:url';
// https://vite.dev/config/
export default defineConfig({
    base: '/Cheetahbuy-web/',
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        port: 3000,
        strictPort: true,
        host: true,
        allowedHosts: ['thirstiest-divina-noncentrally.ngrok-free.dev', '.ngrok-free.dev']
    },
});
