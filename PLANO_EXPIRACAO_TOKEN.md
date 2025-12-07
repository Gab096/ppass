# Plano de Solução: Gerenciamento de Expiração de Token

## Análise do Sistema Atual

### Backend (AdonisJS)
- ✅ Usa `DbAccessTokensProvider` - tokens são **hashes** armazenados no banco
- ✅ Expiração configurada: **24 horas** no campo `expires_at`
- ✅ Middleware valida automaticamente expiração
- ❌ Handler de exceções não retorna mensagens claras para token expirado

### Frontend (React Native)
- ❌ Tenta decodificar token como JWT (mas não é JWT, é hash)
- ✅ Já trata 401 nas requisições
- ⚠️ Verificação de expiração baseada em JWT (incorreta)

## Solução Proposta

### 1. Backend - Customizar Handler de Exceções
**Objetivo**: Retornar mensagens claras quando token expira

**Implementação**:
- Detectar exceções de autenticação do AdonisJS
- Retornar JSON com mensagem clara: "Sessão expirada" ou "Token inválido"
- Status code 401 mantido

### 2. Frontend - Simplificar Verificação
**Objetivo**: Confiar no servidor para validar expiração

**Implementação**:
- Remover tentativa de decodificar JWT
- `isAuthenticated()` apenas verifica se token existe
- `checkTokenExpiration()` faz requisição leve ao servidor
- Confiar nas respostas 401 do servidor (já implementado)

### 3. Fluxo de Verificação
1. **Inicial**: Verificar se token existe no storage
2. **Periódica**: Fazer requisição leve (ex: `/admin/profile`) para validar
3. **Em requisições**: Servidor retorna 401 se expirado → frontend remove token
4. **Background**: Mesma lógica da verificação periódica

## Benefícios

✅ **Simplicidade**: Frontend não precisa decodificar tokens
✅ **Confiabilidade**: Servidor é a fonte da verdade
✅ **Manutenibilidade**: Lógica centralizada no backend
✅ **Segurança**: Validação sempre no servidor
✅ **Performance**: Menos processamento no frontend

## Implementação

Ver arquivos:
- `app/exceptions/handler.ts` - Customizar tratamento de erros
- `src/services/auth.service.ts` - Simplificar verificação
- `App.tsx` - Ajustar verificação periódica

