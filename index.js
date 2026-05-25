import 'dotenv/config';
import express from 'express';
import { container } from './src/di/DIContainer.js';
import { ChatController } from './src/controllers/ChatController.js';
import { createChatRoutes } from './src/routes/chatRoutes.js';
import { createCorsMiddleware } from './src/middleware/cors.js';
import { createRequestLoggerMiddleware } from './src/middleware/requestLogger.js';
import { createErrorHandlerMiddleware } from './src/middleware/errorHandler.js';

/**
 * Cria a aplicação Express com todas as dependências injetadas
 * Princípio DIP: Injeta dependências ao invés de criá-las
 */
async function createApp() {
    // Resolve dependências do container
    const config = container.resolve('config');
    const logger = container.resolve('logger');
    const chatService = container.resolve('chatService');

    // Cria a aplicação Express
    const app = express();

    // Middlewares globais
    app.use(express.json());
    app.use(createCorsMiddleware(config.getCorsOrigin()));
    app.use(createRequestLoggerMiddleware(logger));

    // Cria o controller com dependências injetadas
    const chatController = new ChatController(chatService, logger, config);

    // Registra as rotas
    app.use('/', createChatRoutes(chatController));

    // Middleware de tratamento de erros (deve ser o último)
    app.use(createErrorHandlerMiddleware(logger));

    return { app, config, logger, chatService };
}

/**
 * Inicia o servidor
 */
async function startServer() {
    try {
        const { app, config, logger, chatService } = await createApp();

        // Inicializa o serviço de chat
        logger.info(`🌍 Ambiente: ${config.getNodeEnv()}`);
        logger.info(`📊 Nível de log: ${config.getLogLevel()}`);
        await chatService.initialize();

        // Inicia o servidor
        app.listen(config.getPort(), () => {
            logger.info(`🚀 Servidor iniciado com sucesso!`);
            logger.info(`📍 URL: http://localhost:${config.getPort()}`);
            logger.info(`📝 Endpoints disponíveis:`);
            logger.info(`   • GET  http://localhost:${config.getPort()}/health`);
            logger.info(`   • POST http://localhost:${config.getPort()}/chat`);
        });
    } catch (error) {
        console.error(`❌ Erro fatal: ${error.message}`);
        process.exit(1);
    }
}

startServer();
