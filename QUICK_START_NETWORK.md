# 🚀 Início Rápido - Rede Local WiFi

## Passo a Passo

### 1️⃣ Configurar .env

```env
HOST=0.0.0.0
PORT=3333
```

### 2️⃣ Descobrir seu IP local

```bash
# macOS/Linux
npm run get-ip

# Ou manualmente
# macOS: ipconfig getifaddr en0
# Linux: hostname -I
# Windows: ipconfig
```

### 3️⃣ Iniciar a aplicação

```bash
# Sem Docker
npm run dev:network

# Com Docker (já configurado)
docker-compose -f docker-compose.dev.yml up
```

### 4️⃣ Acessar de outros dispositivos

Use o IP descoberto no passo 2:
```
http://SEU_IP:3333
```

**Exemplo:** Se seu IP for `192.168.1.100`:
- API: `http://192.168.1.100:3333`
- Login: `http://192.168.1.100:3333/admin/login`

## ⚠️ Importante

- Todos os dispositivos devem estar na **mesma rede WiFi**
- O firewall deve permitir conexões na porta **3333**
- Use apenas em **redes confiáveis**

## 📖 Documentação Completa

Veja `NETWORK_SETUP.md` para mais detalhes e troubleshooting.

