import { ILogger } from '../interfaces/ILogger.js';

/**
 * ChatHistoryService - Gerencia histórico de conversas
 * Mantém histórico em memória (pode ser estendido para banco de dados)
 */
export class ChatHistoryService {
    constructor(logger) {
        this.logger = logger;
        this.conversations = new Map(); // conversationId -> array de mensagens
    }

    /**
     * Cria uma nova conversa
     * @returns {string} ID da conversa
     */
    createConversation() {
        const conversationId = this._generateId();
        this.conversations.set(conversationId, []);
        this.logger.debug(`📝 Nova conversa criada: ${conversationId}`);
        return conversationId;
    }

    /**
     * Adiciona mensagem ao histórico
     * @param {string} conversationId - ID da conversa
     * @param {string} role - 'user' ou 'assistant'
     * @param {string} message - Conteúdo da mensagem
     */
    addMessage(conversationId, role, message) {
        if (!this.conversations.has(conversationId)) {
            throw new Error(`Conversa ${conversationId} não encontrada`);
        }

        const conversation = this.conversations.get(conversationId);
        conversation.push({
            role,
            message,
            timestamp: new Date().toISOString(),
        });
    }

    /**
     * Obtém histórico da conversa
     * @param {string} conversationId - ID da conversa
     * @returns {Array} Histórico de mensagens
     */
    getConversation(conversationId) {
        if (!this.conversations.has(conversationId)) {
            throw new Error(`Conversa ${conversationId} não encontrada`);
        }

        return this.conversations.get(conversationId);
    }

    /**
     * Obtém contexto da conversa (últimas N mensagens)
     * @param {string} conversationId - ID da conversa
     * @param {number} limit - Quantidade de mensagens a retornar
     * @returns {Array} Últimas mensagens
     */
    getContext(conversationId, limit = 10) {
        const conversation = this.getConversation(conversationId);
        return conversation.slice(-limit);
    }

    /**
     * Deleta uma conversa
     * @param {string} conversationId - ID da conversa
     */
    deleteConversation(conversationId) {
        if (!this.conversations.has(conversationId)) {
            throw new Error(`Conversa ${conversationId} não encontrada`);
        }

        this.conversations.delete(conversationId);
        this.logger.debug(`🗑️ Conversa deletada: ${conversationId}`);
    }

    /**
     * Lista todas as conversas
     * @returns {Array} Array de conversas com informações resumidas
     */
    listConversations() {
        const conversations = [];
        
        this.conversations.forEach((messages, conversationId) => {
            conversations.push({
                id: conversationId,
                messageCount: messages.length,
                createdAt: messages.length > 0 ? messages[0].timestamp : null,
                lastMessageAt: messages.length > 0 ? messages[messages.length - 1].timestamp : null,
            });
        });

        return conversations;
    }

    /**
     * Limpa todas as conversas (cuidado!)
     */
    clearAll() {
        this.conversations.clear();
        this.logger.warn('⚠️ Todas as conversas foram deletadas');
    }

    /**
     * Gera um ID único para conversa
     * @private
     * @returns {string} ID gerado
     */
    _generateId() {
        return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
}
