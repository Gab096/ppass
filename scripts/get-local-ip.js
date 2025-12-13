#!/usr/bin/env node

import { execSync } from 'child_process';

console.log('🔍 Descobrindo IP local na rede WiFi...\n');

let ip = null;

try {
  if (process.platform === 'win32') {
    // Windows
    const output = execSync('ipconfig', { encoding: 'utf-8' });
    const lines = output.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('IPv4')) {
        const match = lines[i].match(/(\d+\.\d+\.\d+\.\d+)/);
        if (match && match[1] !== '127.0.0.1') {
          ip = match[1];
          break;
        }
      }
    }
  } else if (process.platform === 'darwin') {
    // macOS
    try {
      ip = execSync('ipconfig getifaddr en0', { encoding: 'utf-8' }).trim();
    } catch {
      try {
        ip = execSync('ipconfig getifaddr en1', { encoding: 'utf-8' }).trim();
      } catch {
        const output = execSync('ifconfig', { encoding: 'utf-8' });
        const match = output.match(/inet (\d+\.\d+\.\d+\.\d+)/);
        if (match && match[1] !== '127.0.0.1') {
          ip = match[1];
        }
      }
    }
  } else {
    // Linux
    try {
      ip = execSync('hostname -I', { encoding: 'utf-8' }).trim().split(' ')[0];
    } catch {
      const output = execSync('ip addr show', { encoding: 'utf-8' });
      const match = output.match(/inet (\d+\.\d+\.\d+\.\d+)\/\d+/);
      if (match && match[1] !== '127.0.0.1') {
        ip = match[1];
      }
    }
  }

  if (ip) {
    console.log(`✅ IP local encontrado: ${ip}\n`);
    console.log('🌐 Acesse a API de outros dispositivos usando:');
    console.log(`   http://${ip}:3333\n`);
    console.log('📝 Certifique-se de que:');
    console.log('   1. HOST=0.0.0.0 está configurado no .env');
    console.log('   2. O firewall permite conexões na porta 3333');
    console.log('   3. Todos os dispositivos estão na mesma rede WiFi');
  } else {
    throw new Error('IP não encontrado');
  }
} catch (error) {
  console.error('❌ Não foi possível descobrir o IP local\n');
  console.log('💡 Tente executar manualmente:');
  if (process.platform === 'win32') {
    console.log('   ipconfig');
  } else if (process.platform === 'darwin') {
    console.log('   ipconfig getifaddr en0');
  } else {
    console.log('   hostname -I');
  }
  process.exit(1);
}

