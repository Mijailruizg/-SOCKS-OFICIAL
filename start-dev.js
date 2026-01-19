#!/usr/bin/env node
/**
 * Script para iniciar el servidor de desarrollo
 * Inicia API (3000) y Vite (3002) en paralelo
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚀 Iniciando SOCKS OFICIAL en modo desarrollo...\n');

// Iniciar API Server
console.log('📍 Iniciando API Server (puerto 3000)...');
const apiProcess = spawn('node', ['api-server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Esperar 2 segundos y luego iniciar Vite
setTimeout(() => {
  console.log('\n📍 Iniciando Vite (puerto 3002)...\n');
  const viteProcess = spawn('npm', ['run', 'dev:vite'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Manejar cierre
  viteProcess.on('close', (code) => {
    console.log(`\n⏹️  Vite cerrado (código ${code})`);
    process.exit(code);
  });
}, 2000);

// Manejar cierre de API
apiProcess.on('close', (code) => {
  console.log(`\n⏹️  API cerrada (código ${code})`);
  process.exit(code);
});

// Manejar Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n⏹️  Deteniendo servidores...');
  apiProcess.kill();
  process.exit(0);
});
