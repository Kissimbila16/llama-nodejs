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
        this.session = null;
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

            this.logger.info('✅ Modelo Llama carregado com sucesso!');

            // Criar sessão de chat
            const context = await this.model.createContext({
                threads: this.config.getThreads()
            });
            this.session = new LlamaChatSession({
                contextSequence: context.getSequence(),
            });

            this.logger.info('💬 Sessão de chat criada com sucesso!');
        } catch (error) {
            this.logger.error(`❌ Erro ao inicializar modelo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Envia mensagem para o modelo Llama
     * @param {string} message - Mensagem do usuário
     * @returns {Promise<string>} Resposta da IA
     */
    async sendMessage(message) {
        if (!this.session) {
            this.logger.error('⚠️ Sessão de chat não inicializada');
            throw new Error("Sessão de chat não inicializada");
        }

        try {
            this.logger.info(`👤 Mensagem do usuário: ${message}`);
            const startTime = performance.now();
            const aiResponse = await this.session.prompt(message);
            const endTime = performance.now();
            const duration = (endTime - startTime).toFixed(2); // Tempo em milissegundos
            this.logger.info(`🤖 Resposta da IA: ${aiResponse}`);
            this.logger.info(`⏱️ Tempo de inferência: ${duration} ms`);
            return aiResponse;
        } catch (error) {
            this.logger.error(`❌ Erro ao processar mensagem: ${error.message}`);
            throw error;
        }
    }
}
