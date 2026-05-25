import { getLlama, LlamaChatSession } from 'node-llama-cpp';
import { IChatService } from '../interfaces/IChatService.js';

/**
 * LlamaChatService - Implementação do serviço de chat com Llama
 * Responsabilidade única: Gerenciar a comunicação com o modelo Llama
 */
export class LlamaChatService extends IChatService {
    constructor(config, logger) {
        super();
        this.config = config;
        this.logger = logger;
        this.context = null;
        this.model = null;
    }

    /**
     * Inicializa o modelo Llama e a sessão de chat
     */
    async initialize() {
        try {
            this.logger.info('🤖 Inicializando modelo Llama...');
            const llama = await getLlama({
                gpu: this.config.getGpuType()
            });

            this.logger.debug(`📂 Caminho do modelo: ${this.config.getModelPath()}`);
            this.model = await llama.loadModel({
                modelPath: this.config.getModelPath(),
                gpuLayers: this.config.getGpuLayers(),
            });
            
            this.context = await this.model.createContext({
                threads: this.config.getThreads(),
                contextSize: this.config.getContextSize(),
                batchSize: this.config.getBatchSize(),
                flashAttention: this.config.getFlashAttention(),
                sequences: 4 // Define um pool de sequências para evitar o erro "No sequences"
            });

            this.logger.info('✅ Modelo e Contexto carregados com sucesso!');
        } catch (error) {
            this.logger.error(`❌ Erro ao inicializar modelo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Envia mensagem para o modelo Llama
     * @param {string} message - Mensagem do usuário
     * @param {Array} history - Histórico de mensagens (opcional)
     * @returns {Promise<string>} Resposta da IA
     */
    async sendMessage(message, history = []) {
        try {
            this.logger.info(`👤 Mensagem do usuário: ${message}`);
            const startTime = performance.now();
            const startMemory = process.memoryUsage().rss;

            const sequence = this.context.getSequence();
            if (!sequence) {
                throw new Error("Não foi possível obter uma sequência livre do contexto");
            }

            // Cria uma nova sessão injetando o histórico recebido
            const session = new LlamaChatSession({
                contextSequence: sequence,
                history: history,
                systemPrompt: `
                    Você é um assistente especializado em:
                    - programação
                    - revisão e retificação de textos
                    Responda sempre em português.`
            });

            const aiResponse = await session.prompt(message, {
                maxTokens: this.config.getMaxTokens(),
                temperature: 0.7
            });

            // Libera os recursos da sessão após o uso
            session.dispose();

            const endTime = performance.now();
            const endMemory = process.memoryUsage().rss;
            
            const duration = (endTime - startTime).toFixed(2); // Tempo em milissegundos
            const memoryDiff = ((endMemory - startMemory) / 1024 / 1024).toFixed(2);

            this.logger.info(`🤖 Resposta da IA concluída`);
            this.logger.info(`⏱️ Tempo: ${duration} ms | 🧠 Memória Delta: ${memoryDiff} MB`);
            return aiResponse;
        } catch (error) {
            this.logger.error(`❌ Erro ao processar mensagem: ${error.message}`);
            throw error;
        }
    }
}
