import { ResponseHelper } from '../utils/ResponseHelper.js';
import { InputValidator } from '../utils/InputValidator.js';



/**
 * ChatController - Controller para gerenciar requisições de chat
 * Responsabilidade única: Processar requisições HTTP e delegar para o serviço
 */
export class ChatController {
    constructor(chatService, logger, config) {
        this.chatService = chatService;
        this.logger = logger;
        this.config = config;
    }

    /**
     * Processa requisição de chat
     * @param {Object} req - Requisição Express
     * @param {Object} res - Resposta Express
     */
    async sendMessage(req, res) {
        try {
            const { message, history } = req.body;
            this.logger.http(`📨 Requisição recebida: ${message ? message.substring(0, 50) : 'vazia'}`);

            // Validação da mensagem atual
            const msgValidation = InputValidator.validateChatMessage(message);
            if (!msgValidation.isValid) {
                return res.status(400).json(ResponseHelper.validationError(msgValidation.error));
            }

            // Validação do histórico opcional
            const historyValidation = InputValidator.validateChatHistory(history);
            if (!historyValidation.isValid) {
                return res.status(400).json(ResponseHelper.validationError(historyValidation.error));
            }

            // Delega para o serviço
            const aiResponse = await this.chatService.sendMessage(msgValidation.data, historyValidation.data);

            this.logger.http('📤 Resposta enviada ao cliente');
            res.json(ResponseHelper.success({
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
                modelName: this.config.getModelPath(),
                status: "OK",
                uptime: process.uptime(),
            }, 'Servidor operacional'));
        } catch (error) {
            this.logger.error(`❌ Erro em ChatController.health: ${error.message}`);
            res.status(500).json(ResponseHelper.error(error.message, 'HEALTH_ERROR'));
        }
    }

}
