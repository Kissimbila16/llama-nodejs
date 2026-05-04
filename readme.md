
# Llama Node.js - API com Arquitetura SOLID

Um servidor Node.js que comunica com um modelo Llama local utilizando Express e arquitetura SOLID.

## ✨ Características

- 🤖 Integração com Llama via `node-llama-cpp`
- 🏗️ Arquitetura SOLID bem estruturada
- 💉 Injeção de Dependência com DIContainer
- 📝 Logging estruturado com Winston
- ⚙️ Configuração via variáveis de ambiente
- 📊 Endpoints RESTful
- ✅ Tratamento de erros centralizado
- 🧪 Fácil de testar

## 📁 Estrutura do Projeto

```
llama-nodejs/
├── src/
│   ├── di/
│   │   └── DIContainer.js           # Container de injeção de dependência
│   ├── services/
│   │   ├── LlamaChatService.js      # Serviço de chat com Llama
│   │   ├── ConfigService.js         # Serviço de configuração
│   │   └── LoggerService.js         # Serviço de logging
│   ├── controllers/
│   │   └── ChatController.js        # Controller de chat
│   ├── interfaces/
│   │   ├── IChatService.js          # Interface do serviço de chat
│   │   ├── ILogger.js               # Interface do logger
│   │   └── IConfig.js               # Interface de configuração
│   ├── middleware/
│   │   ├── cors.js                  # Middleware CORS
│   │   ├── errorHandler.js          # Middleware de tratamento de erros
│   │   └── requestLogger.js         # Middleware de log de requisições
│   └── routes/
│       └── chatRoutes.js            # Definição das rotas
├── logs/                            # Logs da aplicação
├── .env                             # Variáveis de ambiente
├── .env.example                     # Template de variáveis de ambiente
├── index.js                         # Arquivo principal
├── package.json
└── README.md
```

## 🚀 Começar Rápido

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

### 3. Iniciar Servidor
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Endpoints

### Health Check
```bash
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2026-05-04T10:30:00.000Z"
}
```

### Chat
```bash
POST /chat
Content-Type: application/json

{
  "message": "como usar count no adonisjs"
}
```

**Resposta:**
```json
{
  "response": "A resposta da IA..."
}
```

## ⚙️ Configuração

Edite o arquivo `.env`:

```env
# Porta do servidor
PORT=3000

# Ambiente (development, production)
NODE_ENV=development

# Nível de log (debug, info, warn, error)
LOG_LEVEL=debug

# Caminho do modelo Llama
MODEL_PATH=./Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf

# CORS Origin
CORS_ORIGIN=*
```

## 📝 Logging

Os logs são salvos em:
- `logs/all.log` - Todos os logs
- `logs/error.log` - Apenas erros

Também aparecem no console com cores para melhor visualização.

## 🏗️ Arquitetura SOLID

Este projeto implementa todos os 5 princípios SOLID:

- **S**ingle Responsibility - Cada classe tem UMA responsabilidade
- **O**pen/Closed - Aberto para extensão, fechado para modificação
- **L**iskov Substitution - Implementações são intercambiáveis
- **I**nterface Segregation - Interfaces pequenas e específicas
- **D**ependency Inversion - Injeção de dependências

Veja [SOLID_ARCHITECTURE.md](SOLID_ARCHITECTURE.md) para mais detalhes.

## 🧪 Como Estender

### Adicionar um novo Serviço

```javascript
// 1. Crie a interface (src/interfaces/INewService.js)
export class INewService {
    async doSomething() {
        throw new Error("doSomething() deve ser implementado");
    }
}

// 2. Implemente (src/services/NewService.js)
export class NewService extends INewService {
    constructor(config, logger) {
        super();
        this.config = config;
        this.logger = logger;
    }

    async doSomething() {
        // Implementação
    }
}

// 3. Registre no container (src/di/DIContainer.js)
const newService = new NewService(config, logger);
this.register('newService', () => newService);

// 4. Use no controller!
```

## 📦 Dependências

- `express` - Framework web
- `node-llama-cpp` - Integração com Llama
- `winston` - Logging estruturado
- `dotenv` - Variáveis de ambiente

## 📄 Licença

ISC

## 👨‍💻 Desenvolvido por

Lucia