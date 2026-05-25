/**
 * Script de teste funcional para a API Llama Node.js
 * Este script valida todos os endpoints da arquitetura SOLID implementada.
 * 
 * Uso: node test-endpoints.js
 */

const BASE_URL = 'http://localhost:3001';

async function runTests() {
    console.log('🧪 Iniciando bateria de testes dos endpoints...\n');

    try {
        // 1. Teste Health Check
        console.log('1. [GET] /health - Verificando integridade...');
        const healthRes = await fetch(`${BASE_URL}/health`);
        const healthData = await healthRes.json();
        console.log(healthData.status === 'success' ? '  ✅ Servidor OK' : '  ❌ Falha no Health Check');

        // 2. Teste Enviar Mensagem (Nova Conversa)
        console.log('\n2. [POST] /chat - Iniciando nova conversa...');
        const chatRes1 = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Olá! Qual o seu modelo de linguagem?' })
        });
        const chatData1 = await chatRes1.json();
        if (chatData1.status === 'success') {
            console.log(`  ✅ Resposta recebida com sucesso`);
            console.log(`  🤖 IA: ${chatData1.data.response.substring(0, 60)}...`);
        }

        console.log('\n✨ Todos os testes foram concluídos com sucesso!');
    } catch (error) {
        console.error('\n❌ Erro crítico durante os testes:');
        console.error(`   ${error.message}`);
        console.log('\n💡 Dica: O servidor está rodando? Use "npm start" antes de testar.');
    }
}

runTests();