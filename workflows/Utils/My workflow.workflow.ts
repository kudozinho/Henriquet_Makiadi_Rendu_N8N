const anthropic_Chat_Model = languageModel({ type: '@n8n/n8n-nodes-langchain.lmChatAnthropic', version: 1.6, config: { name: 'Anthropic Chat Model', parameters: { model: { __rl: true, value: 'claude-fable-5-1', mode: 'list', cachedResultName: 'Claude Fable 5.1' }, options: {} }, position: [96, 208] } });
const postgres_Chat_Memory = memory({ type: '@n8n/n8n-nodes-langchain.memoryPostgresChat', version: 1.4, config: { name: 'Postgres Chat Memory', position: [240, 208] } });

const when_chat_message_received = trigger({
  type: '@n8n/n8n-nodes-langchain.chatTrigger',
  version: 1.5,
  config: { name: 'When chat message received', parameters: { options: {} }, webhookId: '20eb932f-8c6e-4056-95ae-f0b2c96d13f3' }
});

const aI_Agent = node({
  type: '@n8n/n8n-nodes-langchain.agent',
  version: 3.1,
  config: { name: 'AI Agent', parameters: { options: {} }, position: [224, 0], subnodes: { model: anthropic_Chat_Model, memory: postgres_Chat_Memory } }
});

const wf = workflow('xttK2ypjhtimm4mI', 'My workflow', { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true });

export default wf
  .add(when_chat_message_received)
  .to(aI_Agent)