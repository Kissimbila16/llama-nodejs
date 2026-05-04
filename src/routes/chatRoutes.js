import express from 'express';

/**
 * Chat Routes
 * Responsabilidade única: Definir rotas de chat
 */
export function createChatRoutes(chatController) {
    const router = express.Router();

    // Health check
    router.get("/health", (req, res) => chatController.health(req, res));

    // Metrics endpoint
    router.get("/metrics", (req, res) => chatController.getMetrics(req, res));

    // Chat endpoints
    router.post("/chat", (req, res) => chatController.sendMessage(req, res));
    
    // Conversation endpoints
    router.get("/conversations", (req, res) => chatController.listConversations(req, res));
    router.get("/conversations/:conversationId", (req, res) => chatController.getConversation(req, res));
    router.get("/conversations/:conversationId/context", (req, res) => chatController.getConversationContext(req, res));
    router.delete("/conversations/:conversationId", (req, res) => chatController.deleteConversation(req, res));

    return router;
}
