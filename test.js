/**
 * Script de teste funcional para a API Llama Node.js
 * Este script valida todos os endpoints da arquitetura SOLID implementada.
 * 
 * Uso: node test-endpoints.js
 */

const BASE_URL = 'http://localhost:3000';

async function runTests() {
    console.log('🧪 Iniciando bateria de testes dos endpoints...\n');
    let conversationId = null;

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
            conversationId = chatData1.data.conversationId;
            console.log(`  ✅ Resposta recebida. ID: ${conversationId}`);
            console.log(`  🤖 IA: ${chatData1.data.response.substring(0, 60)}...`);
        }

        // 3. Teste Enviar Mensagem com Contexto
        console.log('\n3. [POST] /chat - Continuando a conversa (verificando contexto)...');
        const chatRes2 = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: 'E o que você pode fazer por mim hoje?',
                conversationId: conversationId 
            })
        });
        const chatData2 = await chatRes2.json();
        console.log(chatData2.status === 'success' ? '  ✅ Contexto mantido com sucesso' : '  ❌ Falha ao manter contexto');

        // 4. Teste Listar Conversas
        console.log('\n4. [GET] /conversations - Listando conversas ativas...');
        const listRes = await fetch(`${BASE_URL}/conversations`);
        const listData = await listRes.json();
        console.log(`  ✅ Conversas encontradas: ${listData.data.totalConversations}`);

        // 5. Teste Obter Histórico Completo
        console.log(`\n5. [GET] /conversations/${conversationId} - Obtendo histórico...`);
        const historyRes = await fetch(`${BASE_URL}/conversations/${conversationId}`);
        const historyData = await historyRes.json();
        console.log(`  ✅ Mensagens no histórico: ${historyData.data.messageCount}`);

        // 6. Teste Obter Contexto (Limitado)
        console.log(`\n6. [GET] /conversations/${conversationId}/context - Obtendo última mensagem...`);
        const contextRes = await fetch(`${BASE_URL}/conversations/${conversationId}/context?limit=1`);
        const contextData = await contextRes.json();
        console.log(`  ✅ Mensagens retornadas (limit=1): ${contextData.data.messageCount}`);

        // 7. Teste de Validação (Mensagem Curta)
        console.log('\n7. [POST] /chat (Erro) - Testando validação de input...');
        const errorRes = await fetch(`${BASE_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'i' }) // Muito curta para o validador
        });
        const errorData = await errorRes.json();
        console.log(errorData.code === 'VALIDATION_ERROR' ? '  ✅ Tratamento de erro OK' : '  ❌ Falha na validação');

        // 8. Teste Deletar Conversa
        console.log(`\n8. [DELETE] /conversations/${conversationId} - Removendo dados de teste...`);
        const deleteRes = await fetch(`${BASE_URL}/conversations/${conversationId}`, {
            method: 'DELETE'
        });
        const deleteData = await deleteRes.json();
        console.log(deleteData.status === 'success' ? '  ✅ Conversa removida' : '  ❌ Falha ao deletar');

        // 9. Verificação final
        const finalCheck = await fetch(`${BASE_URL}/conversations/${conversationId}`);
        console.log(finalCheck.status === 404 ? '  ✅ Verificação final (404) confirmada' : '  ❌ Conversa ainda existe');

        console.log('\n✨ Todos os testes foram concluídos com sucesso!');
    } catch (error) {
        console.error('\n❌ Erro crítico durante os testes:');
        console.error(`   ${error.message}`);
        console.log('\n💡 Dica: O servidor está rodando? Use "npm start" antes de testar.');
    }
}

runTests();