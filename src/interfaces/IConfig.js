/**
 * IConfig - Interface para o serviço de configuração
 */
export class IConfig {
    getPort() {
        throw new Error("getPort() deve ser implementado");
    }

    getNodeEnv() {
        throw new Error("getNodeEnv() deve ser implementado");
    }

    getLogLevel() {
        throw new Error("getLogLevel() deve ser implementado");
    }

    getModelPath() {
        throw new Error("getModelPath() deve ser implementado");
    }

    getCorsOrigin() {
        throw new Error("getCorsOrigin() deve ser implementado");
    }

    getGpuLayers() {
        throw new Error("getGpuLayers() deve ser implementado");
    }

    getThreads() {
        throw new Error("getThreads() deve ser implementado");
    }

    getGpuType() {
        throw new Error("getGpuType() deve ser implementado");
    }
}
