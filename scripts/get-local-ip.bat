@echo off
setlocal enabledelayedexpansion
REM Script para descobrir o IP local na rede WiFi (Windows)

echo 🔍 Descobrindo IP local na rede WiFi...
echo.

REM Obter IP da interface WiFi (ignorar 127.0.0.1)
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    set IP=!IP:~1!
    REM Remover espaços em branco
    set IP=!IP: =!
    
    REM Ignorar localhost
    if not "!IP!"=="127.0.0.1" (
        echo ✅ IP local encontrado: !IP!
        echo.
        echo 🌐 Acesse a API de outros dispositivos usando:
        echo    http://!IP!:3333
        echo.
        echo 📝 Certifique-se de que:
        echo    1. HOST=0.0.0.0 está configurado no .env
        echo    2. O firewall permite conexões na porta 3333
        echo    3. Todos os dispositivos estão na mesma rede WiFi
        goto :end
    )
)

echo ❌ Não foi possível descobrir o IP local
echo 💡 Execute manualmente: ipconfig
echo 💡 Ou verifique suas conexões de rede no Windows

:end

