import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	// The dev proxy has to point at the same port the API server binds to.
	const apiTarget = env.VITE_SERVER_URL || 'http://localhost:8000';

	return {
		server: {
			port: 5173,
			host: true,
			open: true,
			proxy: {
				'/api': {
					target: apiTarget,
					changeOrigin: true,
					secure: false,
				},
				'/socket.io': {
					target: apiTarget,
					changeOrigin: true,
					secure: false,
					ws: true,
				},
			},
		},

		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url)),
			},
		},

		css: {
			preprocessorOptions: {
				scss: {
					// Lets every module resolve `@use 'variables'` from the project
					// root regardless of how deeply it is nested.
					loadPaths: [fileURLToPath(new URL('.', import.meta.url))],
				},
			},
		},

		build: {
			target: 'es2020',
			cssCodeSplit: true,
			// Inline anything under 4KB as a data URI; larger assets stay as
			// separate cacheable files.
			assetsInlineLimit: 4096,
			rollupOptions: {
				output: {
					// Split vendor code so an app change does not invalidate the
					// cached React/Socket.IO bundles. Rolldown (Vite 8) only accepts
					// the function form here, not the object map.
					manualChunks(id) {
						if (!id.includes('node_modules')) return;
						if (/[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id))
							return 'react-vendor';
						if (/[\\/]node_modules[\\/](socket\.io-client|engine\.io-client|socket\.io-parser)[\\/]/.test(id))
							return 'socket-vendor';
						if (/[\\/]node_modules[\\/](react-toastify|react-colorful|react-icons)[\\/]/.test(id))
							return 'ui-vendor';
					},
				},
			},
		},

		plugins: [react()],
	};
});
