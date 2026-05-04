import { ResponseHelper } from '../utils/ResponseHelper.js';
import { InputValidator } from '../utils/InputValidator.js';

/**
 * ChatController - Controller para gerenciar requisições de chat
 * Responsabilidade única: Processar requisições HTTP e delegar para o serviço
 */
export class ChatController {
    constructor(chatService, logger, historyService) {
        this.chatService = chatService;
        this.logger = logger;
        this.historyService = historyService;
    }

    /**
     * Processa requisição de chat
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    async sendMessage(req, res) {
        try {
            const { message, conversationId } = req.body;
            this.logger.http(`📨 Requisição recebida: ${message ? message.substring(0, 50) : 'vazia'}`);

            // Validação da mensagem
            const validation = InputValidator.validateChatMessage(message);
            if (!validation.isValid) {
                return res.status(400).json(ResponseHelper.validationError(validation.error));
            }

            // Obter ou criar conversa
            let chatConversationId = conversationId;
            if (!chatConversationId) {
                chatConversationId = this.historyService.createConversation();
            }

            // Adicionar mensagem do usuário ao histórico
            this.historyService.addMessage(chatConversationId, 'user', validation.data);

            // Delega para o serviço
            const aiResponse = await this.chatService.sendMessage(validation.data);
            
            // Adicionar resposta da IA ao histórico
            this.historyService.addMessage(chatConversationId, 'assistant', aiResponse);

            this.logger.http('📤 Resposta enviada ao cliente');
            res.json(ResponseHelper.success({
                conversationId: chatConversationId,
                response: aiResponse,
            }, 'Mensagem processada com sucesso'));
        } catch (error) {
            this.logger.error(`❌ Erro em ChatController.sendMessage: ${error.message}`);
            res.status(500).json(ResponseHelper.error(error.message, 'CHAT_ERROR'));
        }
    }

    /**
     * Processa requisição de health check
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    async health(req, res) {
        try {
            this.logger.http('✅ Requisição de health check');
            res.json(ResponseHelper.success({ 
                status: "OK",
                uptime: process.uptime(),
                conversationCount: this.historyService.listConversations().length,
            }, 'Servidor operacional'));
        } catch (error) {
            this.logger.error(`❌ Erro em ChatController.health: ${error.message}`);
            res.status(500).json(ResponseHelper.error(error.message, 'HEALTH_ERROR'));
        }
    }

    /**
     * Obtém métricas de performance e uso de recursos
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    async getMetrics(req, res) {
        try {
            this.logger.http('📊 Requisição de métricas do sistema');
            
            const memory = process.memoryUsage();
            const cpu = process.cpuUsage();
            
            const metrics = {
                uptime: process.uptime(),
                memory: {
                    rss: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
                    heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
                    heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
                    external: `${(memory.external / 1024 / 1024).toFixed(2)} MB`,
                },
                cpu: {
                    user: `${(cpu.user / 1000).toFixed(2)} ms`,
                    system: `${(cpu.system / 1000).toFixed(2)} ms`,
                },
                process: {
                    nodeVersion: process.version,
                    pid: process.pid,
                    platform: process.platform
                }
            };

            res.json(ResponseHelper.success(metrics, 'Métricas obtidas com sucesso'));
        } catch (error) {
            this.logger.error(`❌ Erro em ChatController.getMetrics: ${error.message}`);
            res.status(500).json(ResponseHelper.error(error.message, 'METRICS_ERROR'));
        }
    }

    /**
     * Obtém histórico de uma conversa
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    async getConversation(req, res) {
        try {
            const { conversationId } = req.params;

            // Validação
            const validation = InputValidator.validateConversationId(conversationId);
            if (!validation.isValid) {
                return res.status(400).json(ResponseHelper.validationError(validation.error));
            }

            // Obter histórico
            const conversation = this.historyService.getConversation(conversationId);
            
            this.logger.http(`📖 Histórico enviado: ${conversationId}`);
            res.json(ResponseHelper.success({
                conversationId,
                messages: conversation,
                messageCount: conversation.length,
            }, 'Histórico obtido com sucesso'));
        } catch (error) {
            this.logger.warn(`⚠️ Conversa não encontrada: ${error.message}`);
            res.status(404).json(ResponseHelper.notFound('Conversa'));
        }
    }

    /**
     * Lista todas as conversas
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    async listConversations(req, res) {
        try {
            const conversations = this.historyService.listConversations();
            
            this.logger.http(`📚 Listagem de conversas enviada`);
            res.json(ResponseHelper.success({
                conversations,
                totalConversations: conversations.length,
            }, 'Conversas listadas com sucesso'));
        } catch (error) {
            this.logger.error(`❌ Erro em ChatController.listConversations: ${error.message}`);
            res.status(500).json(ResponseHelper.error(error.message, 'LIST_ERROR'));
        }
    }

    /**
     * Deleta uma conversa
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    async deleteConversation(req, res) {
        try {
            const { conversationId } = req.params;

            // Validação
            const validation = InputValidator.validateConversationId(conversationId);
            if (!validation.isValid) {
                return res.status(400).json(ResponseHelper.validationError(validation.error));
            }

            // Deletar conversa
            this.historyService.deleteConversation(conversationId);
            
            this.logger.http(`🗑️ Conversa deletada: ${conversationId}`);
            res.json(ResponseHelper.success({
                conversationId,
            }, 'Conversa deletada com sucesso'));
        } catch (error) {
            this.logger.warn(`⚠️ Conversa não encontrada: ${error.message}`);
            res.status(404).json(ResponseHelper.notFound('Conversa'));
        }
    }

    /**
     * Obtém contexto da conversa (últimas mensagens)
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    async getConversationContext(req, res) {
        try {
            const { conversationId } = req.params;
            const { limit = 10 } = req.query;

            // Validação
            const validation = InputValidator.validateConversationId(conversationId);
            if (!validation.isValid) {
                return res.status(400).json(ResponseHelper.validationError(validation.error));
            }

            // Obter contexto
            const context = this.historyService.getContext(conversationId, parseInt(limit));
            
            this.logger.http(`📖 Contexto enviado: ${conversationId}`);
            res.json(ResponseHelper.success({
                conversationId,
                messages: context,
                messageCount: context.length,
            }, 'Contexto obtido com sucesso'));
        } catch (error) {
            this.logger.warn(`⚠️ Conversa não encontrada: ${error.message}`);
            res.status(404).json(ResponseHelper.notFound('Conversa'));
        }
    }
}
