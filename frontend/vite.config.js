import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => ({
  plugins: [
    react({
      // Only use Fast Refresh in development
      fastRefresh: mode === 'development',
      // Use React 17+ automatic JSX transform
      jsxRuntime: 'automatic',
      // Enable babel plugins in development
      babel: {
        plugins: mode === 'development' ? [] : [],
      },
    }),
  ],
  resolve: {
    alias: {
      // Add path aliases if needed
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    // Make sure .jsx files are resolved with higher priority
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  server: {
    port: 4200,
    strictPort: true,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:9001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Keycloak proxy
      '/auth': {
        target: 'http://localhost:9003',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/auth/, ''),
      },
    },
  },
  // Build optimization for production
  build: {
    outDir: 'dist',
    sourcemap: mode !== 'production',
    minify: mode === 'production' ? 'esbuild' : false,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['@react-keycloak/web', 'keycloak-js'],
        },
      },
    },
  },
  // Environment variables
  define: {
    'process.env': process.env,
    __APP_ENV__: JSON.stringify(mode),
  },
  // CSS handling
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
}));
