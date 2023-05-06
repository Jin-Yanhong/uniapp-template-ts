import { defineConfig, loadEnv } from 'vite';
import path from 'path';
import uni from '@dcloudio/vite-plugin-uni';

const port = 5000;

export default ({ mode }) => {
	const config = loadEnv(mode, './');

	return defineConfig({
		base: mode == 'production' ? '/threejs-project' : '/',
		plugins: [uni()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
		server: {
			hmr: true,
			open: true,
			port: port,
			proxy: {
				'/api': {
					target: config.VITE_BASE_API,
					changeOrigin: true,
					rewrite: path => path.replace(/api/, '/api'),
				},
			},
		},
	});
};
