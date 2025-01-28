import { getLlama, LlamaChatSession } from 'node-llama-cpp';
import path from 'path';

async function runLocalLlama() {
    const llama = await getLlama();
    const model = await llama.loadModel({
        modelPath: path.join(__dirname, "./", "Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf"),
    });

    const context = await model.createContext();
    const session = new LlamaChatSession({
        contextSequence: context.getSequence(),
    });

    const userMessage = "como usar count no adonisjs";
    console.log("Usuário: " + userMessage);
    const aiResponse = await session.prompt(userMessage);
    console.log("AI: " + aiResponse);
}

runLocalLlama();
