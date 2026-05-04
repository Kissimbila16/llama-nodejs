import winston from 'winston';
import { ILogger } from '../interfaces/ILogger.js';

/**
 * LoggerService - Implementação do serviço de logging com Winston
 * Responsabilidade única: Gerenciar todos os logs da aplicação
 */
export class LoggerService extends ILogger {
    constructor(logLevel = 'debug') {
        super();
        this.logger = this._createLogger(logLevel);
    }

    _createLogger(logLevel) {
        const levels = {
            error: 0,
            warn: 1,
            info: 2,
            http: 3,
            debug: 4,
        };

        const colors = {
            error: 'red',
            warn: 'yellow',
            info: 'green',
            http: 'magenta',
            debug: 'white',
        };

        winston.addColors(colors);

        const format = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            winston.format.colorize({ all: true }),
            winston.format.printf(
                (info) => `${info.timestamp} ${info.level}: ${info.message}`,
            ),
        );

        const transports = [
            new winston.transports.Console(),
            new winston.transports.File({
                filename: 'logs/error.log',
                level: 'error',
            }),
            new winston.transports.File({
                filename: 'logs/all.log',
            }),
        ];

        return winston.createLogger({
            level: logLevel,
            levels,
            format,
            transports,
        });
    }

    info(message) {
        this.logger.info(message);
    }

    error(message) {
        this.logger.error(message);
    }

    warn(message) {
        this.logger.warn(message);
    }

    debug(message) {
        this.logger.debug(message);
    }

    http(message) {
        this.logger.http(message);
    }
}
