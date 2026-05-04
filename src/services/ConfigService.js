import path from 'path';
import { IConfig } from '../interfaces/IConfig.js';

/**
 * ConfigService - Implementação do serviço de configuração
 * Responsabilidade única: Gerenciar todas as configurações da aplicação
 */
export class ConfigService extends IConfig {
    constructor() {
        super();
        this._port = process.env.PORT || 3000;
        this._nodeEnv = process.env.NODE_ENV || 'development';
        this._logLevel = process.env.LOG_LEVEL || 'debug';
        
        const rawModelPath = process.env.MODEL_PATH || "Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf";
        this._modelPath = path.isAbsolute(rawModelPath) 
            ? rawModelPath 
            : path.join(process.cwd(), rawModelPath);
            
        this._corsOrigin = process.env.CORS_ORIGIN || '*';
        
        this._gpuLayers = process.env.GPU_LAYERS !== undefined 
            ? (process.env.GPU_LAYERS === 'auto' ? 'auto' : parseInt(process.env.GPU_LAYERS)) 
            : 'auto';
            
        this._threads = process.env.THREADS ? parseInt(process.env.THREADS) : undefined;
            
        this._gpuType = process.env.GPU_TYPE || 'auto';
    }

    getPort() {
        return this._port;
    }

    getNodeEnv() {
        return this._nodeEnv;
    }

    getLogLevel() {
        return this._logLevel;
    }

    getModelPath() {
        return this._modelPath;
    }

    getCorsOrigin() {
        return this._corsOrigin;
    }

    getGpuLayers() {
        return this._gpuLayers;
    }

    getThreads() {
        return this._threads;
    }

    getGpuType() {
        return this._gpuType;
    }
}
