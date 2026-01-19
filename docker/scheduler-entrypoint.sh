#!/bin/sh

# Script de entrada para o container de scheduler
# Configura o cron e inicia o serviço

set -e

echo "Iniciando scheduler de check-out automático..."

# Aguardar o banco de dados estar pronto (opcional, pode ser necessário em alguns casos)
# sleep 5

# Criar arquivo de log se não existir
touch /var/log/cron.log

# Instalar o crontab usando arquivo simplificado
# Usar crontab command é mais confiável que /etc/cron.d/ no Alpine
if [ -f /etc/cron.d/scheduler-crontab-simple ]; then
  crontab /etc/cron.d/scheduler-crontab-simple
  echo "✓ Crontab instalado via crontab command"
elif [ -f /app/docker/scheduler-crontab-simple ]; then
  crontab /app/docker/scheduler-crontab-simple
  echo "✓ Crontab instalado via crontab command (arquivo local)"
else
  # Fallback: extrair a linha do cron do arquivo original e adicionar variáveis de ambiente
  CRON_LINE=$(grep -E "^0 18" /etc/cron.d/scheduler-crontab | sed 's/^0 18 \* \* \* root/0 18 * * */' | sed 's|cd /app &&|cd /app \&\& PORT=3333 HOST=0.0.0.0|')
  if [ -n "$CRON_LINE" ]; then
    echo "$CRON_LINE" | crontab -
    echo "✓ Crontab instalado via extração do arquivo original (com variáveis de ambiente)"
  else
    echo "⚠ AVISO: Não foi possível instalar o crontab"
  fi
fi

# Exibir o crontab ativo
echo ""
echo "Crontab ativo:"
crontab -l || echo "Nenhum crontab instalado"

# Verificar se o Node.js está disponível
echo "Verificando Node.js..."
which node || echo "AVISO: Node.js não encontrado no PATH"

# Iniciar o cron em foreground
# O -f mantém o cron em foreground (necessário para containers)
# O init: true no docker-compose permite que setpgid funcione corretamente
echo "Iniciando cron daemon..."
exec crond -f -l 2
