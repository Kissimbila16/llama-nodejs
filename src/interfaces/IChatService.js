/**
 * IChatService - Interface para o serviço de chat
 * Garante que qualquer implementação tenha os métodos necessários
 */
export class IChatService {
    async initialize() {
        throw new Error("initialize() deve ser implementado");
    }

    async sendMessage(message) {
        throw new Error("sendMessage() deve ser implementado");
    }
}
