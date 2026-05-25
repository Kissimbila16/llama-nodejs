import { performance } from 'perf_hooks';
import { getLlama, LlamaChatSession } from 'node-llama-cpp';
import PQueue from 'p-queue';

import { IChatService } from '../interfaces/IChatService.js';

/**
 * Prompt do sistema fixo
 * Evita recriação desnecessária em cada request
 */
const SYSTEM_PROMPT = `
Você é um assistente especializado em:
- programação
- revisão e retificação de textos

Responda sempre em português.
`;

/**
 * LlamaChatService
 * Serviço responsável pela comunicação com o modelo Llama
 */
export class LlamaChatService extends IChatService {
    constructor(config, logger) {
        super();

        this.config = config;
        this.logger = logger;

        this.context = null;
        this.model = null;
        this.llama = null;

        /**
         * Sua VPS NÃO suporta inferências paralelas pesadas.
         * Mantemos apenas 1 request simultâneo.
         */
        this.queue = new PQueue({
            concurrency: 1
        });
    }

    /**
     * Inicializa o modelo
     */
    async initialize() {
        try {
            this.logger.info('Inicializando modelo Llama...');

            this.llama = await getLlama({
                gpu: this.config.getGpuType()
            });

            this.logger.info(`Modelo: ${this.config.getModelPath()}`);

            this.model = await this.llama.loadModel({
                modelPath: this.config.getModelPath(),

                /**
                 * Sua VPS não possui GPU real
                 */
                gpuLayers: 0,

                /**
                 * Melhor estabilidade para VPS
                 */
                useMmap: true,
                useMlock: false
            });

            /**
             * Configuração otimizada para:
             * - CPU sem AVX2
             * - VPS virtualizada
             * - baixa concorrência
             */
            this.context = await this.model.createContext({
                threads: 4,
                contextSize: 2048,
                batchSize: 64,
                flashAttention: false,

                /**
                 * Apenas 1 sequência simultânea
                 */
                sequences: 1
            });

            this.logger.info(' Modelo carregado com sucesso!');

            /**
             * Warmup do modelo
             * Evita primeira resposta extremamente lenta
             */
            this.logger.info('🔥 Executando warmup...');

            const sequence = this.context.getSequence();

            if (sequence) {
                const warmupSession = new LlamaChatSession({
                    contextSequence: sequence,
                    systemPrompt: SYSTEM_PROMPT
                });

                await warmupSession.prompt('Olá', {
                    maxTokens: 10,
                    temperature: 0.1
                });

                await warmupSession.dispose();
                await sequence.dispose();
            }

            this.logger.info('✅ Warmup concluído');

        } catch (error) {
            this.logger.error(`❌ Erro ao inicializar modelo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Envia mensagem para o modelo
     * @param {string} message
     * @param {Array} history
     * @returns {Promise<string>}
     */
    async sendMessage(message, history = []) {
        return this.queue.add(async () => {
            return this.processMessage(message, history);
        });
    }

    /**
     * Processa a mensagem
     */
    async processMessage(message, history = []) {
        if (!this.context) {
            throw new Error('Modelo não inicializado');
        }

        let session = null;
        let sequence = null;

        const startTime = performance.now();
        const startMemory = process.memoryUsage().rss;

        try {
            /**
             * Evita logs gigantes e vazamento de dados
             */
            this.logger.info(
                `👤 Mensagem recebida (${message.length} caracteres)`
            );

            /**
             * Limita histórico
             * Sua VPS não suporta contextos enormes
             */
            const trimmedHistory = Array.isArray(history)
                ? history.slice(-4)
                : [];

            /**
             * Obtém sequência do pool
             */
            sequence = this.context.getSequence();

            if (!sequence) {
                throw new Error(
                    'Nenhuma sequência disponível no contexto'
                );
            }

            /**
             * Cria sessão
             */
            session = new LlamaChatSession({
                contextSequence: sequence,
                history: trimmedHistory,
                systemPrompt: SYSTEM_PROMPT
            });

            /**
             * Gera resposta
             */
            const response = await session.prompt(message, {
                maxTokens: 512,

                /**
                 * Temperatura menor = mais estabilidade
                 */
                temperature: 0.5
            });

            const endTime = performance.now();
            const endMemory = process.memoryUsage().rss;

            const duration = (
                endTime - startTime
            ).toFixed(2);

            const memoryDiff = (
                (endMemory - startMemory) / 1024 / 1024
            ).toFixed(2);

            this.logger.info(
                ` Resposta concluída | ⏱ ${duration} ms | 🧠 ΔRAM ${memoryDiff} MB`
            );

            return response;

        } catch (error) {
            this.logger.error(
                `❌ Erro ao processar mensagem: ${error.message}`
            );

            throw error;

        } finally {
            /**
             * MUITO IMPORTANTE:
             * libera sessão e sequência
             * evita memory leak e "No sequences left"
             */

            try {
                await session?.dispose?.();
            } catch (err) {
                this.logger.warn(
                    `⚠️ Erro ao liberar sessão: ${err.message}`
                );
            }

            try {
                await sequence?.dispose?.();
            } catch (err) {
                this.logger.warn(
                    `⚠️ Erro ao liberar sequência: ${err.message}`
                );
            }
        }
    }

    /**
     * Finaliza o serviço
     */
    async dispose() {
        try {
            this.logger.info('Finalizando modelo...');

            await this.context?.dispose?.();
            await this.model?.dispose?.();

            this.context = null;
            this.model = null;

            this.logger.info('✅ Modelo finalizado');

        } catch (error) {
            this.logger.error(
                `❌ Erro ao finalizar modelo: ${error.message}`
            );
        }
    }
}