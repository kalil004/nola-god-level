import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Importe o 'path'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Diga ao Vite que seu código-fonte está na pasta 'src'
      root: path.resolve(__dirname, 'src'),
      
      base: './', // <--- ADICIONE ESTA LINHA

      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          // Ajuste o alias para funcionar a partir do novo root 'src'
          '@': path.resolve(__dirname, 'src'),
        }
      },
      build: {
        // Diga ao Vite para colocar o build na pasta 'dist'
        // no nível de 'frontend/', não 'frontend/src/dist'
        outDir: path.resolve(__dirname, 'dist')
      }
    };
});