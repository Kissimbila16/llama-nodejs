/**
 * InputValidator - Validação de dados de entrada
 * Garante que os dados recebidos estejam no formato correto
 */
export class InputValidator {
    /**
     * Valida mensagem de chat
     * @param {string} message - Mensagem a validar
     * @returns {Object} { isValid: boolean, error?: string }
     */
    static validateChatMessage(message) {
        if (!message) {
            return { 
                isValid: false, 
                error: 'Mensagem é obrigatória' 
            };
        }

        if (typeof message !== 'string') {
            return { 
                isValid: false, 
                error: 'Mensagem deve ser um texto' 
            };
        }

        const trimmed = message.trim();
        
        if (trimmed.length === 0) {
            return { 
                isValid: false, 
                error: 'Mensagem não pode estar vazia' 
            };
        }

        if (trimmed.length > 5000) {
            return { 
                isValid: false, 
                error: 'Mensagem não pode ter mais de 5000 caracteres' 
            };
        }

        if (trimmed.length < 2) {
            return { 
                isValid: false, 
                error: 'Mensagem deve ter no mínimo 2 caracteres' 
            };
        }

        return { 
            isValid: true, 
            data: trimmed 
        };
    }

    /**
     * Valida ID de conversa
     * @param {string} conversationId - ID a validar
     * @returns {Object} { isValid: boolean, error?: string }
     */
    static validateConversationId(conversationId) {
        if (!conversationId) {
            return { 
                isValid: false, 
                error: 'ID da conversa é obrigatório' 
            };
        }

        if (typeof conversationId !== 'string') {
            return { 
                isValid: false, 
                error: 'ID da conversa deve ser um texto' 
            };
        }

        if (!/^[a-zA-Z0-9_-]{8,}$/.test(conversationId)) {
            return { 
                isValid: false, 
                error: 'ID da conversa inválido' 
            };
        }

        return { isValid: true };
    }

    /**
     * Valida o histórico de chat vindo do frontend
     * @param {Array} history - Array de mensagens [{role, content}]
     * @returns {Object} { isValid: boolean, data: Array, error?: string }
     */
    static validateChatHistory(history) {
        if (history === undefined || history === null) {
            return { isValid: true, data: [] };
        }

        if (!Array.isArray(history)) {
            return { isValid: false, error: 'O histórico deve ser uma lista de mensagens' };
        }

        // Verifica se cada item tem o formato básico exigido pelo node-llama-cpp
        const isValidFormat = history.every(item => 
            item && typeof item === 'object' && item.role && item.content
        );

        return isValidFormat 
            ? { isValid: true, data: history }
            : { isValid: false, error: 'Cada item do histórico deve conter "role" e "content"' };
    }
}
