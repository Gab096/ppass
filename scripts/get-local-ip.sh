#!/bin/bash

# Script para descobrir o IP local na rede WiFi

echo "🔍 Descobrindo IP local na rede WiFi..."
echo ""

# macOS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Tentar en0 (WiFi mais comum no macOS)
    IP=$(ipconfig getifaddr en0 2>/dev/null)
    
    if [ -z "$IP" ]; then
        # Tentar en1
        IP=$(ipconfig getifaddr en1 2>/dev/null)
    fi
    
    if [ -z "$IP" ]; then
        # Fallback: usar ifconfig
        IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)
    fi
# Linux
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Tentar obter IP da interface WiFi
    IP=$(hostname -I | awk '{print $1}' 2>/dev/null)
    
    if [ -z "$IP" ]; then
        # Fallback: usar ip addr
        IP=$(ip addr show | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | cut -d/ -f1 | head -n 1)
    fi
fi

if [ -z "$IP" ]; then
    echo "❌ Não foi possível descobrir o IP local"
    echo "💡 Tente executar manualmente:"
    echo "   macOS: ipconfig getifaddr en0"
    echo "   Linux: hostname -I"
    exit 1
fi

echo "✅ IP local encontrado: $IP"
echo ""
echo "🌐 Acesse a API de outros dispositivos usando:"
echo "   http://$IP:3333"
echo ""
echo "📝 Certifique-se de que:"
echo "   1. HOST=0.0.0.0 está configurado no .env"
echo "   2. O firewall permite conexões na porta 3333"
echo "   3. Todos os dispositivos estão na mesma rede WiFi"

