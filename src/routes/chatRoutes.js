import express from 'express';

/**
 * Chat Routes
 * Responsabilidade única: Definir rotas de chat
 */
export function createChatRoutes(chatController) {
    const router = express.Router();

    // Health check
    router.get("/health", (req, res) => chatController.health(req, res));

    // Chat endpoints
    router.post("/chat", (req, res) => chatController.sendMessage(req, res));
    
    return router;
}
