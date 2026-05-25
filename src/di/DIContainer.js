import { ConfigService } from '../services/ConfigService.js';
import { LoggerService } from '../services/LoggerService.js';
import { LlamaChatService } from '../services/LlamaChatService.js';

/**
 * DIContainer - Container de Injeção de Dependência
 * Responsabilidade única: Gerenciar a criação e resolução de dependências
 * Princípio DIP (Dependency Inversion): Classes recebem dependências ao invés de criá-las
 */
export class DIContainer {
    constructor() {
        this.services = new Map();
        this._registerCoreServices();
    }

    /**
     * Registra os serviços principais da aplicação
     */
    _registerCoreServices() {
        // Registra ConfigService como singleton
        const config = new ConfigService();
        this.register('config', () => config);

        // Registra LoggerService como singleton
        const logger = new LoggerService(config.getLogLevel());
        this.register('logger', () => logger);

        // Registra LlamaChatService como singleton
        const chatService = new LlamaChatService(config, logger);
        this.register('chatService', () => chatService);
    }

    /**
     * Registra um serviço no container
     * @param {string} name - Nome do serviço
     * @param {Function} factory - Função que cria a instância do serviço
     */
    register(name, factory) {
        this.services.set(name, { factory, instance: null, isSingleton: true });
    }

    /**
     * Resolve um serviço registrado
     * @param {string} name - Nome do serviço
     * @returns {*} Instância do serviço
     */
    resolve(name) {
        if (!this.services.has(name)) {
            throw new Error(`Serviço '${name}' não registrado no container`);
        }

        const service = this.services.get(name);

        // Se é singleton e já foi criado, retorna a instância
        if (service.isSingleton && service.instance) {
            return service.instance;
        }

        // Cria a instância
        const instance = service.factory();

        // Se é singleton, guarda a instância
        if (service.isSingleton) {
            service.instance = instance;
        }

        return instance;
    }

    /**
     * Verifica se um serviço está registrado
     * @param {string} name - Nome do serviço
     * @returns {boolean}
     */
    has(name) {
        return this.services.has(name);
    }
}

// Exporta uma instância singleton do container
export const container = new DIContainer();
