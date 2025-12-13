#!/usr/bin/env node

import { spawn } from 'child_process';

// Definir HOST=0.0.0.0 para escutar em todas as interfaces
process.env.HOST = '0.0.0.0';

// Executar o comando ace serve --hmr (mesmo método usado no script "dev")
const child = spawn('node', ['ace', 'serve', '--hmr'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd(),
  env: {
    ...process.env,
    HOST: '0.0.0.0',
  },
});

child.on('error', (error) => {
  console.error('Erro ao iniciar servidor:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

