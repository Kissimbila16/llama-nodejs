/**
 * ILogger - Interface para o serviço de logging
 * Garante que qualquer implementação de logger tenha os métodos necessários
 */
export class ILogger {
    info(message) {
        throw new Error("info() deve ser implementado");
    }

    error(message) {
        throw new Error("error() deve ser implementado");
    }

    warn(message) {
        throw new Error("warn() deve ser implementado");
    }

    debug(message) {
        throw new Error("debug() deve ser implementado");
    }

    http(message) {
        throw new Error("http() deve ser implementado");
    }
}
