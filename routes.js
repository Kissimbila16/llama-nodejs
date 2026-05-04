import express from 'express';
import logger from './logger.js';
import { chat } from './model.js';

const router = express.Router();

// ============ HEALTH CHECK ============
router.get("/health", (req, res) => {
    logger.http('✅ Requisição de health check');
    res.json({ 
        status: "OK",
        timestamp: new Date().toISOString(),
    });
});

// ============ CHAT ENDPOINT ============
router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;
        logger.http(`📨 Requisição recebida: ${message ? message.substring(0, 50) : 'vazia'}`);

        if (!message || message.trim() === "") {
            logger.warn('⚠️ Mensagem vazia recebida');
            return res.status(400).json({ error: "Mensagem não pode estar vazia" });
        }

        const aiResponse = await chat(message);
        logger.http('📤 Resposta enviada ao cliente');
        res.json({ response: aiResponse });
    } catch (error) {
        logger.error(`❌ Erro no endpoint /chat: ${error.message}`);
        res.status(500).json({ error: error.message });
    }
});

export default router;
