const run_Setup = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Run Setup', position: [100, 300] }
});

const create_Answering_Tables = node({
  type: 'n8n-nodes-base.postgres',
  version: 2.7,
  config: { name: 'Create Answering Tables', parameters: { operation: 'executeQuery', query: 'create extension if not exists vector;\n\n-- Conversation memory\ncreate table if not exists chat_messages (\n  id bigserial primary key,\n  session_id text not null,\n  role text not null check (role in (\'user\', \'assistant\')),\n  content text not null,\n  created_at timestamptz default now()\n);\ncreate index if not exists chat_messages_session_idx on chat_messages (session_id, created_at);\n\n-- Search queries and their vectors\ncreate table if not exists nutrition_queries (\n  id bigserial primary key,\n  session_id text,\n  query text not null,\n  embedding vector not null,\n  created_at timestamptz default now()\n);\n\nnotify pgrst, \'reload schema\';\n\nselect \'ok\' as status;', options: {} }, credentials: { postgres: newCredential('Postgres account', 'JiOdBvO93jRpGesK') }, position: [220, 0], notes: 'Creates the answering tables if needed. Deletes nothing.', notesInFlow: true }
});

const wf = workflow('0RRdt0ucqkHlfynl', 'Setup Answering Tables', { description: 'Creates the chat_messages and nutrition_queries tables in Supabase for the answering part. Deletes nothing.', executionOrder: 'v1', availableInMCP: true });

export default wf
  .add(run_Setup)
  .to(create_Answering_Tables)