/**
 * Request Logger Middleware
 * Responsabilidade única: Log de requisições HTTP
 */
export function createRequestLoggerMiddleware(logger) {
    return (req, res, next) => {
        const start = Date.now();
        
        res.on('finish', () => {
            const duration = Date.now() - start;
            const status = res.statusCode;
            const statusColor = status >= 400 ? '❌' : '✅';
            
            logger.http(`${statusColor} ${req.method} ${req.path} - ${status} (${duration}ms)`);
        });
        
        next();
    };
}
