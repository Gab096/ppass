# 🐳 Guia Docker

Este projeto está configurado para rodar com Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker Engine 20.10+
- Docker Compose 2.0+

## 🚀 Início Rápido

### 1. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Application
NODE_ENV=development
PORT=3333
HOST=0.0.0.0
APP_KEY=your-app-key-here-generate-with-node-ace-generate-key
LOG_LEVEL=info

# Database
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=p_pass
```

**Importante:** Gere uma chave APP_KEY executando:
```bash
node ace generate:key
```

### 2. Modo Desenvolvimento

```bash
# Iniciar containers
make dev
# ou
docker-compose -f docker-compose.dev.yml up

# Executar migrations
make dev-migrate
# ou
docker-compose -f docker-compose.dev.yml exec app node ace migration:run

# Ver logs
make dev-logs
# ou
docker-compose -f docker-compose.dev.yml logs -f
```

### 3. Modo Produção

```bash
# Construir imagens
make build
# ou
docker-compose build

# Iniciar containers
make up
# ou
docker-compose up -d

# Executar migrations
make migrate
# ou
docker-compose exec app node ace migration:run

# Ver logs
make logs
# ou
docker-compose logs -f
```

## 📦 Estrutura Docker

### Arquivos Criados

- **Dockerfile**: Imagem de produção multi-stage
- **Dockerfile.dev**: Imagem de desenvolvimento
- **docker-compose.yml**: Configuração para produção
- **docker-compose.dev.yml**: Configuração para desenvolvimento
- **.dockerignore**: Arquivos ignorados no build
- **Makefile**: Comandos úteis para gerenciar containers

### Serviços

#### App (Aplicação AdonisJS)
- **Porta**: 3333
- **Healthcheck**: Configurado para verificar saúde da aplicação

#### PostgreSQL
- **Versão**: 16-alpine
- **Porta**: 5432
- **Volume**: Dados persistidos em volume Docker
- **Healthcheck**: Verifica se o banco está pronto

## 🛠️ Comandos Úteis

### Usando Makefile

```bash
make help          # Mostra todos os comandos disponíveis
make build         # Constrói as imagens
make up            # Inicia em produção
make down          # Para os containers
make logs          # Mostra logs
make shell         # Abre shell no container
make migrate       # Executa migrations
make dev           # Inicia em desenvolvimento
make dev-down      # Para desenvolvimento
make dev-migrate   # Migrations em desenvolvimento
```

### Usando Docker Compose diretamente

```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yml up -d
docker-compose -f docker-compose.dev.yml exec app node ace migration:run
docker-compose -f docker-compose.dev.yml logs -f app

# Produção
docker-compose up -d
docker-compose exec app node ace migration:run
docker-compose logs -f app
```

## 🔧 Comandos AdonisJS no Container

```bash
# Executar migrations
docker-compose exec app node ace migration:run

# Reverter última migration
docker-compose exec app node ace migration:rollback

# Criar migration
docker-compose exec app node ace make:migration nome_da_migration

# Criar seeder
docker-compose exec app node ace make:seeder nome_do_seeder

# Executar seeders
docker-compose exec app node ace db:seed

# Gerar chave da aplicação
docker-compose exec app node ace generate:key
```

## 🗄️ Banco de Dados

### Acessar PostgreSQL

```bash
# Via docker-compose
docker-compose exec postgres psql -U postgres -d p_pass

# Ou conectando diretamente
psql -h localhost -p 5432 -U postgres -d p_pass
```

### Backup do Banco

```bash
docker-compose exec postgres pg_dump -U postgres p_pass > backup.sql
```

### Restaurar Backup

```bash
docker-compose exec -T postgres psql -U postgres p_pass < backup.sql
```

## 🐛 Troubleshooting

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs app

# Verificar status
docker-compose ps

# Reconstruir imagens
docker-compose build --no-cache
```

### Banco de dados não conecta

```bash
# Verificar se o PostgreSQL está saudável
docker-compose ps postgres

# Ver logs do PostgreSQL
docker-compose logs postgres

# Verificar variáveis de ambiente
docker-compose exec app env | grep DB_
```

### Limpar tudo e recomeçar

```bash
# Parar e remover containers, volumes e redes
docker-compose down -v

# Remover imagens também
docker-compose down -v --rmi all

# Reconstruir do zero
docker-compose build --no-cache
docker-compose up -d
```

## 📝 Notas

- Os volumes do PostgreSQL são persistidos mesmo após `docker-compose down`
- Use `docker-compose down -v` para remover volumes também
- Em desenvolvimento, o código é montado como volume para hot-reload
- Em produção, apenas o código buildado é copiado para a imagem

