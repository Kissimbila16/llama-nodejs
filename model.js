import { getLlama, LlamaChatSession } from 'node-llama-cpp';
import logger from './logger.js';
import { config } from './config.js';

let session = null;

// ============ MODEL INITIALIZATION ============
export async function initializeModel() {
    try {
        logger.info('🤖 Inicializando modelo Llama...');
        const llama = await getLlama();
        
        logger.debug(`📂 Caminho do modelo: ${config.modelPath}`);
        const model = await llama.loadModel({
            modelPath: config.modelPath,
        });
        
        logger.info('✅ Modelo Llama carregado com sucesso!');
        return model;
    } catch (error) {
        logger.error(`❌ Erro ao inicializar modelo: ${error.message}`);
        throw error;
    }
}

// ============ CHAT SESSION ============
export async function createChatSession(model) {
    try {
        logger.info('💬 Criando sessão de chat...');
        const context = await model.createContext();
        const chatSession = new LlamaChatSession({
            contextSequence: context.getSequence(),
        });
        session = chatSession;
        logger.info('✅ Sessão de chat criada com sucesso!');
        return chatSession;
    } catch (error) {
        logger.error(`❌ Erro ao criar sessão de chat: ${error.message}`);
        throw error;
    }
}

// ============ CHAT LOGIC ============
export async function chat(userMessage) {
    if (!session) {
        logger.error('⚠️ Sessão de chat não inicializada');
        throw new Error("Sessão de chat não inicializada");
    }

    try {
        logger.info(`👤 Mensagem do usuário: ${userMessage}`);
        const aiResponse = await session.prompt(userMessage);
        logger.info(`🤖 Resposta da IA: ${aiResponse}`);
        return aiResponse;
    } catch (error) {
        logger.error(`❌ Erro ao processar mensagem: ${error.message}`);
        throw error;
    }
}
