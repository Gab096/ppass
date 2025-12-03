# 🐳 Guia Rápido - Docker Compose

## 📋 Pré-requisitos

1. **Docker e Docker Compose instalados**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Arquivo .env configurado**
   ```env
   NODE_ENV=development
   PORT=3333
   HOST=0.0.0.0
   APP_KEY=sua-chave-aqui
   LOG_LEVEL=info
   DB_HOST=postgres
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=p_pass
   ```

   **Importante:** Gere a APP_KEY:
   ```bash
   node ace generate:key
   ```

## 🚀 Como Rodar

### Opção 1: Usando Makefile (Recomendado)

```bash
# Desenvolvimento
make dev              # Inicia em modo desenvolvimento
make dev-logs         # Ver logs
make dev-migrate      # Executar migrations
make dev-down         # Parar containers

# Produção
make build            # Construir imagens
make up               # Iniciar em produção
make migrate          # Executar migrations
make logs             # Ver logs
make down             # Parar containers
```

### Opção 2: Usando Docker Compose Diretamente

#### Desenvolvimento

```bash
# Iniciar containers
docker-compose -f docker-compose.dev.yml up

# Em background (detached)
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f

# Executar migrations
docker-compose -f docker-compose.dev.yml exec app node ace migration:run

# Parar containers
docker-compose -f docker-compose.dev.yml down
```

#### Produção

```bash
# Construir imagens
docker-compose build

# Iniciar containers
docker-compose up -d

# Ver logs
docker-compose logs -f

# Executar migrations
docker-compose exec app node ace migration:run

# Parar containers
docker-compose down
```

## 📝 Passo a Passo Completo

### 1. Configurar .env

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
PORT=3333
HOST=0.0.0.0
APP_KEY=gerar-com-node-ace-generate-key
LOG_LEVEL=info
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=p_pass
```

### 2. Gerar APP_KEY

```bash
node ace generate:key
```

Copie a chave gerada para o `.env`.

### 3. Iniciar em Desenvolvimento

```bash
# Usando Makefile
make dev

# Ou usando docker-compose diretamente
docker-compose -f docker-compose.dev.yml up
```

### 4. Executar Migrations

```bash
# Aguarde o PostgreSQL estar pronto (alguns segundos)
# Depois execute:

# Com Makefile
make dev-migrate

# Ou diretamente
docker-compose -f docker-compose.dev.yml exec app node ace migration:run
```

### 5. Acessar a API

A API estará disponível em:
- **Local:** http://localhost:3333
- **Rede local:** http://SEU_IP:3333

Para descobrir seu IP:
```bash
npm run get-ip
# ou
./scripts/get-local-ip.sh
```

## 🔍 Comandos Úteis

### Ver status dos containers
```bash
docker-compose ps
```

### Ver logs em tempo real
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml logs -f app

# Produção
docker-compose logs -f app
```

### Acessar shell do container
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml exec app sh

# Produção
docker-compose exec app sh
```

### Reconstruir imagens
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml build --no-cache

# Produção
docker-compose build --no-cache
```

### Limpar tudo
```bash
# Parar e remover containers, volumes e redes
docker-compose down -v

# Remover imagens também
docker-compose down -v --rmi all
```

## 🐛 Troubleshooting

### Erro: "APP_KEY is required"
```bash
# Gere a chave
node ace generate:key
# Adicione ao .env
```

### Erro: "Port already in use"
```bash
# Altere a porta no .env
PORT=3334
# Ou pare o processo que está usando a porta
```

### Erro: "Cannot connect to database"
```bash
# Verifique se o PostgreSQL está rodando
docker-compose ps postgres

# Verifique os logs
docker-compose logs postgres

# Aguarde alguns segundos para o banco inicializar
```

### Container não inicia
```bash
# Ver logs detalhados
docker-compose logs app

# Reconstruir
docker-compose build --no-cache
docker-compose up -d
```

## 📊 Diferenças: Desenvolvimento vs Produção

| Aspecto | Desenvolvimento | Produção |
|---------|----------------|----------|
| Arquivo | `docker-compose.dev.yml` | `docker-compose.yml` |
| Hot Reload | ✅ Sim | ❌ Não |
| Build | Não precisa buildar | Precisa buildar |
| Volumes | Código montado | Código copiado |
| Logs | Mais verbosos | Menos verbosos |

## 🌐 Acesso em Rede Local

Para acessar de outros dispositivos na mesma rede WiFi:

1. Certifique-se que `HOST=0.0.0.0` no `.env`
2. Descubra o IP do servidor: `npm run get-ip`
3. Acesse: `http://SEU_IP:3333`

## 📚 Mais Informações

- Veja `DOCKER.md` para documentação completa
- Veja `NETWORK_SETUP.md` para configuração de rede

