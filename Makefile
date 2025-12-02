.PHONY: help build up down restart logs shell migrate seed dev prod

help: ## Mostra esta mensagem de ajuda
	@echo "Comandos disponíveis:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

build: ## Constrói as imagens Docker
	docker-compose build

up: ## Inicia os containers em modo produção
	docker-compose up -d

down: ## Para e remove os containers
	docker-compose down

restart: ## Reinicia os containers
	docker-compose restart

logs: ## Mostra os logs dos containers
	docker-compose logs -f

shell: ## Abre shell no container da aplicação
	docker-compose exec app sh

migrate: ## Executa as migrations
	docker-compose exec app node ace migration:run

seed: ## Executa os seeders
	docker-compose exec app node ace db:seed

dev: ## Inicia em modo desenvolvimento
	docker-compose -f docker-compose.dev.yml up

dev-down: ## Para os containers de desenvolvimento
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Mostra os logs em modo desenvolvimento
	docker-compose -f docker-compose.dev.yml logs -f

dev-shell: ## Abre shell no container de desenvolvimento
	docker-compose -f docker-compose.dev.yml exec app sh

dev-migrate: ## Executa migrations em desenvolvimento
	docker-compose -f docker-compose.dev.yml exec app node ace migration:run

prod-build: ## Constrói para produção
	docker-compose build --no-cache

prod-up: ## Inicia em produção
	docker-compose up -d

prod-logs: ## Logs em produção
	docker-compose logs -f app

