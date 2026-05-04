# API Documentation - Llama Chat

## 📚 Endpoints da API

### Base URL
```
http://localhost:3000
```

---

## ✅ Health Check

### GET /health
Verifica o status do servidor.

**Response (200):**
```json
{
  "status": "success",
  "message": "Servidor operacional",
  "data": {
    "status": "OK",
    "uptime": 3600.5,
    "conversationCount": 5
  },
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

---

## 💬 Chat

### POST /chat
Envia uma mensagem e recebe resposta da IA.

**Request:**
```json
{
  "message": "Olá! Como você está?",
  "conversationId": "conv_1234567890_abc123def" // opcional
}
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Mensagem processada com sucesso",
  "data": {
    "conversationId": "conv_1234567890_abc123def",
    "response": "Olá! Estou bem, obrigado por perguntar!"
  },
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

**Error (400):**
```json
{
  "status": "error",
  "message": "Erro de validação",
  "code": "VALIDATION_ERROR",
  "errors": ["Mensagem não pode estar vazia"],
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

**Regras de Validação:**
- `message` é obrigatório
- Mínimo 2 caracteres
- Máximo 5000 caracteres
- Não pode conter apenas espaços em branco

---

## 📚 Conversas

### GET /conversations
Lista todas as conversas.

**Response (200):**
```json
{
  "status": "success",
  "message": "Conversas listadas com sucesso",
  "data": {
    "conversations": [
      {
        "id": "conv_1234567890_abc123def",
        "messageCount": 5,
        "createdAt": "2026-05-04T10:00:00.000Z",
        "lastMessageAt": "2026-05-04T10:30:00.000Z"
      }
    ],
    "totalConversations": 1
  },
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

---

### GET /conversations/:conversationId
Obtém o histórico completo de uma conversa.

**Response (200):**
```json
{
  "status": "success",
  "message": "Histórico obtido com sucesso",
  "data": {
    "conversationId": "conv_1234567890_abc123def",
    "messages": [
      {
        "role": "user",
        "message": "Olá!",
        "timestamp": "2026-05-04T10:10:00.000Z"
      },
      {
        "role": "assistant",
        "message": "Olá! Como posso ajudá-lo?",
        "timestamp": "2026-05-04T10:10:05.000Z"
      }
    ],
    "messageCount": 2
  },
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

**Error (404):**
```json
{
  "status": "error",
  "message": "Conversa não encontrado",
  "code": "NOT_FOUND",
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

---

### GET /conversations/:conversationId/context
Obtém apenas as últimas mensagens (contexto) de uma conversa.

**Query Parameters:**
- `limit` (optional, default: 10) - Quantidade de mensagens a retornar

**Request:**
```
GET /conversations/conv_1234567890_abc123def/context?limit=5
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Contexto obtido com sucesso",
  "data": {
    "conversationId": "conv_1234567890_abc123def",
    "messages": [
      {
        "role": "user",
        "message": "Qual é o capital da França?",
        "timestamp": "2026-05-04T10:25:00.000Z"
      },
      {
        "role": "assistant",
        "message": "O capital da França é Paris.",
        "timestamp": "2026-05-04T10:25:05.000Z"
      }
    ],
    "messageCount": 2
  },
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

---

### DELETE /conversations/:conversationId
Deleta uma conversa.

**Response (200):**
```json
{
  "status": "success",
  "message": "Conversa deletada com sucesso",
  "data": {
    "conversationId": "conv_1234567890_abc123def"
  },
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

**Error (404):**
```json
{
  "status": "error",
  "message": "Conversa não encontrado",
  "code": "NOT_FOUND",
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

---

## 🔄 Fluxo Típico para Frontend

### 1. Iniciar nova conversa
```javascript
// POST /chat
{
  "message": "Primeira mensagem"
  // Não enviar conversationId
}

// Response conterá um novo conversationId
```

### 2. Continuar a conversa
```javascript
// POST /chat
{
  "message": "Próxima mensagem",
  "conversationId": "conv_1234567890_abc123def" // Do response anterior
}
```

### 3. Obter histórico
```javascript
// GET /conversations/conv_1234567890_abc123def
// Retorna todas as mensagens
```

### 4. Obter contexto recente
```javascript
// GET /conversations/conv_1234567890_abc123def/context?limit=10
// Retorna últimas 10 mensagens
```

### 5. Listar conversas
```javascript
// GET /conversations
// Lista todas as conversas com informações resumidas
```

---

## 📝 Exemplo com Fetch API (JavaScript)

```javascript
// Enviar mensagem
async function sendMessage(message, conversationId = null) {
  const response = await fetch('http://localhost:3000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      ...(conversationId && { conversationId })
    })
  });

  return await response.json();
}

// Obter histórico
async function getHistory(conversationId) {
  const response = await fetch(`http://localhost:3000/conversations/${conversationId}`);
  return await response.json();
}

// Listar conversas
async function listConversations() {
  const response = await fetch('http://localhost:3000/conversations');
  return await response.json();
}

// Uso
const result = await sendMessage('Olá!');
console.log(result.data.conversationId); // Novo ID da conversa

// Usar o ID em próximas mensagens
const response2 = await sendMessage('Próxima mensagem', result.data.conversationId);
```

---

## ⚙️ Status Code HTTP

| Code | Significado |
|------|------------|
| 200  | OK - Requisição bem-sucedida |
| 400  | Bad Request - Dados inválidos |
| 404  | Not Found - Recurso não encontrado |
| 500  | Internal Server Error - Erro no servidor |

---

## 🔒 Formato de Resposta

Todas as respostas seguem este formato:

```json
{
  "status": "success" | "error",
  "message": "Descrição da operação",
  "code": "CÓDIGO_DE_ERRO (apenas em caso de erro)",
  "data": { /* dados específicos */ },
  "errors": [ /* erros de validação */ ],
  "timestamp": "ISO 8601 timestamp"
}
```

---

## 🧪 Teste com cURL

```bash
# Health check
curl http://localhost:3000/health

# Enviar mensagem
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Olá!"}'

# Listar conversas
curl http://localhost:3000/conversations

# Obter histórico
curl http://localhost:3000/conversations/conv_1234567890_abc123def

# Deletar conversa
curl -X DELETE http://localhost:3000/conversations/conv_1234567890_abc123def
```

---

## 💡 Dicas para Frontend

1. **Salve o conversationId** após a primeira mensagem
2. **Use o contexto** ao invés do histórico completo para economia de banda
3. **Implemente debounce** para evitar múltiplas requisições
4. **Trate erros** verificando `status` === "error"
5. **Use timestamps** para ordenar mensagens
6. **Implemente loading states** durante a requisição
