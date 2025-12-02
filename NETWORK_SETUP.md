# 🌐 Configuração para Rede Interna WiFi

Este guia explica como configurar a API para ser acessível em uma rede interna WiFi.

## 📋 Pré-requisitos

- Todos os dispositivos devem estar na mesma rede WiFi
- Firewall deve permitir conexões na porta 3333 (ou a porta configurada)

## 🔧 Configuração

### 1. Configurar variáveis de ambiente

No arquivo `.env`, configure:

```env
# Para aceitar conexões de qualquer IP na rede local
HOST=0.0.0.0
PORT=3333
```

**Importante:** `HOST=0.0.0.0` permite que a API aceite conexões de qualquer IP da rede local.

### 2. Descobrir o IP local do servidor

#### No macOS/Linux:
```bash
# Descobrir IP na rede WiFi
ifconfig | grep "inet " | grep -v 127.0.0.1

# Ou mais específico
ipconfig getifaddr en0  # WiFi no macOS
```

#### No Windows:
```bash
ipconfig
# Procure por "IPv4 Address" na interface WiFi
```

#### Usando o script helper:
```bash
# No macOS/Linux
chmod +x scripts/get-local-ip.sh
./scripts/get-local-ip.sh

# No Windows
scripts\get-local-ip.bat
```

### 3. Iniciar a aplicação

#### Sem Docker:
```bash
npm run dev
```

#### Com Docker:
```bash
docker-compose -f docker-compose.dev.yml up
```

### 4. Acessar de outros dispositivos

Após descobrir o IP do servidor (ex: `192.168.1.100`), acesse de qualquer dispositivo na mesma rede:

```
http://192.168.1.100:3333
```

**Exemplo de endpoints:**
- `http://192.168.1.100:3333/admin/login`
- `http://192.168.1.100:3333/inmates`

## 🔒 Segurança

### Firewall

#### macOS:
```bash
# Permitir porta 3333
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

#### Linux (UFW):
```bash
sudo ufw allow 3333/tcp
```

#### Windows:
1. Abra "Firewall do Windows Defender"
2. Clique em "Configurações Avançadas"
3. Crie uma regra de entrada para a porta 3333

### Recomendações

1. **Use apenas em rede confiável**: Não exponha em redes públicas
2. **Considere usar HTTPS**: Para produção, configure SSL/TLS
3. **Limite acesso**: Configure firewall para permitir apenas IPs específicos se necessário

## 🐳 Docker em Rede Local

Se estiver usando Docker, o `docker-compose.dev.yml` já está configurado com `HOST: 0.0.0.0`.

O mapeamento de porta `"${PORT:-3333}:3333"` permite acesso externo.

## 📱 Testando de dispositivos móveis

1. Certifique-se de que o celular está na mesma rede WiFi
2. Descubra o IP do servidor (ex: `192.168.1.100`)
3. Acesse: `http://192.168.1.100:3333`

### Exemplo com Postman/Insomnia

Configure a base URL como:
```
http://192.168.1.100:3333
```

## 🔍 Troubleshooting

### Não consigo acessar de outros dispositivos

1. **Verifique o firewall:**
   ```bash
   # Teste se a porta está aberta
   telnet 192.168.1.100 3333
   ```

2. **Verifique se está escutando em 0.0.0.0:**
   ```bash
   # No servidor
   netstat -an | grep 3333
   # Deve mostrar: 0.0.0.0:3333
   ```

3. **Verifique se os dispositivos estão na mesma rede:**
   - Todos devem estar conectados ao mesmo WiFi
   - Verifique o gateway (ex: `192.168.1.1`)

4. **Teste localmente primeiro:**
   ```bash
   curl http://localhost:3333
   ```

### Erro "Connection refused"

- Verifique se `HOST=0.0.0.0` está configurado
- Verifique se a aplicação está rodando
- Verifique o firewall

### IP muda constantemente

Considere configurar um IP estático no roteador ou usar mDNS (Bonjour).

## 📝 Exemplo de .env para rede local

```env
NODE_ENV=development
PORT=3333
HOST=0.0.0.0
APP_KEY=sua-chave-aqui
LOG_LEVEL=info

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=p_pass
```

## 🚀 Produção em Rede Local

Para produção em rede local, considere:

1. Usar um IP estático
2. Configurar um nome de domínio local (ex: `p-pass.local`)
3. Usar HTTPS com certificado auto-assinado
4. Configurar proxy reverso (nginx)

