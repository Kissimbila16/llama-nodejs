/**
 * CORS Middleware
 * Responsabilidade única: Gerenciar CORS
 */
export function createCorsMiddleware(corsOrigin) {
    return (req, res, next) => {
        res.header("Access-Control-Allow-Origin", corsOrigin);
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        
        if (req.method === "OPTIONS") {
            return res.sendStatus(200);
        }
        
        next();
    };
}
