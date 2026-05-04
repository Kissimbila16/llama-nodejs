import { ResponseHelper } from '../utils/ResponseHelper.js';

/**
 * Error Handler Middleware
 * Responsabilidade única: Tratamento centralizado de erros
 */
export function createErrorHandlerMiddleware(logger) {
    return (err, req, res, next) => {
        logger.error(`Erro não tratado: ${err.message}`);
        
        const status = err.status || 500;
        const message = err.message || 'Erro interno do servidor';
        
        res.status(status).json(ResponseHelper.error(message, 'INTERNAL_ERROR'));
    };
}
