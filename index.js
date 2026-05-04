import { getLlama, LlamaChatSession } from 'node-llama-cpp';
import path from 'path';

// ============ CONFIGURATION ============
const CONFIG = {
    MODEL_PATH: path.join(process.cwd(), "Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf"),
    USER_MESSAGE: "como usar count no adonisjs",
};

// ============ MODEL INITIALIZATION ============
async function initializeModel() {
    const llama = await getLlama();
    const model = await llama.loadModel({
        modelPath: CONFIG.MODEL_PATH,
    });
    return model;
}

// ============ CHAT SESSION ============
async function createChatSession(model) {
    const context = await model.createContext();
    const session = new LlamaChatSession({
        contextSequence: context.getSequence(),
    });
    return session;
}

// ============ CHAT LOGIC ============
async function chat(session, userMessage) {
    console.log(`Usuário: ${userMessage}`);
    const aiResponse = await session.prompt(userMessage);
    console.log(`AI: ${aiResponse}`);
}

// ============ MAIN EXECUTION ============
async function main() {
    try {
        const model = await initializeModel();
        const session = await createChatSession(model);
        await chat(session, CONFIG.USER_MESSAGE);
    } catch (error) {
        console.error("Erro:", error.message);
        process.exit(1);
    }
}

main();
