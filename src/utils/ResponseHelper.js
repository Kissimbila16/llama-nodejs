/**
 * ResponseHelper - Utility para criar respostas padronizadas
 * Garante consistência em todas as respostas da API
 */
export class ResponseHelper {
    /**
     * Resposta de sucesso
     * @param {Object} data - Dados da resposta
     * @param {string} message - Mensagem opcional
     * @returns {Object} Resposta formatada
     */
    static success(data, message = 'Sucesso') {
        return {
            status: 'success',
            message,
            data,
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Resposta de erro
     * @param {string} message - Mensagem de erro
     * @param {number} code - Código de erro
     * @param {Object} details - Detalhes adicionais
     * @returns {Object} Resposta formatada
     */
    static error(message, code = 'INTERNAL_ERROR', details = null) {
        return {
            status: 'error',
            message,
            code,
            ...(details && { details }),
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Resposta de validação
     * @param {Array} errors - Array de erros de validação
     * @returns {Object} Resposta formatada
     */
    static validationError(errors) {
        return {
            status: 'error',
            message: 'Erro de validação',
            code: 'VALIDATION_ERROR',
            errors: Array.isArray(errors) ? errors : [errors],
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Resposta de não encontrado
     * @param {string} resource - Recurso não encontrado
     * @returns {Object} Resposta formatada
     */
    static notFound(resource) {
        return {
            status: 'error',
            message: `${resource} não encontrado`,
            code: 'NOT_FOUND',
            timestamp: new Date().toISOString(),
        };
    }

    /**
     * Resposta de servidor indisponível
     * @returns {Object} Resposta formatada
     */
    static serverUnavailable() {
        return {
            status: 'error',
            message: 'Servidor temporariamente indisponível',
            code: 'SERVER_UNAVAILABLE',
            timestamp: new Date().toISOString(),
        };
    }
}
