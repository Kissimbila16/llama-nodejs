import { getLlama, LlamaChatSession } from 'node-llama-cpp';
import logger from './logger.js';
import { config } from './config.js';

let model = null;
let session = null;

// ============ MODEL INITIALIZATION ============
export async function initializeModel() {
    try {
        logger.info('🤖 Inicializando modelo Llama...');

        const llama = await getLlama();

        logger.debug(`📂 Caminho do modelo: ${config.modelPath}`);

        model = await llama.loadModel({
            modelPath: config.modelPath,
            numThreads: config.modelThreads,
            contextSize: config.modelContextSize,
            gpuLayers: config.modelGpuLayers,
            gpuType: config.modelGpuType,
            seed: config.modelSeed,
            f16Kv: config.modelF16Kv,
            logitsAll: config.modelLogitsAll,
            vocabOnly: config.modelVocabOnly,
            useMlock: config.modelUseMlock,
            embedding: config.modelEmbedding,
            useMmap: config.modelUseMmap,
            lowVram: config.modelLowVram,
            mirostat: config.modelMirostat,
            mirostatTau: config.modelMirostatTau,
            mirostatTaum: config.modelMirostatTaum,
        });

        logger.info('✅ Modelo Llama carregado com sucesso!');

        return model;
    } catch (error) {
        logger.error(`❌ Erro ao inicializar modelo: ${error.message}`);
        throw error;
    }
}

// ============ CHAT SESSION ============
export async function createChatSession(modelInstance = model) {
    try {
        if (!modelInstance) {
            throw new Error('Modelo não inicializado');
        }

        logger.info('💬 Criando sessão de chat...');

        const context = await modelInstance.createContext({
            contextSize: 2048,
            threads: config.threads || 4,
            batchSize: 128,
        });

        const chatSession = new LlamaChatSession({
            contextSequence: context.getSequence(),

            systemPrompt: `
Você é um assistente especializado em:
- programação
- Node.js
- Angular
- APIs REST
- SQL
- revisão e retificação de textos

Responda sempre em português.
            `,
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
        logger.warn('⚠️ Sessão não encontrada. Criando nova sessão...');
        await createChatSession();
    }

    try {
        logger.info(`👤 Mensagem do usuário: ${userMessage}`);

        const aiResponse = await session.prompt(userMessage, {
            temperature: 0.7,
            topP: 0.9,
            maxTokens: 512,
        });

        logger.info('🤖 Resposta da IA gerada com sucesso!');

        return aiResponse;
    } catch (error) {
        logger.error(`❌ Erro ao processar mensagem: ${error.message}`);
        throw error;
    }
}
