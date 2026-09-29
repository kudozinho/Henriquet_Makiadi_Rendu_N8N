const schedule_Trigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: { name: 'Schedule Trigger', parameters: { rule: { interval: [{ triggerAtHour: 7, triggerAtMinute: 20 }] } } }
});

const hTTP_Request = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: { name: 'HTTP Request', parameters: { url: 'https://api.open-meteo.com/v1/forecast', sendQuery: true, queryParameters: { parameters: [{ name: 'latitude', value: '48.8566' }, { name: 'longitude', value: '2.3522' }, { name: 'current_weather', value: 'true' }] }, options: {} }, position: [176, 48] }
});

const edit_Fields = node({
  type: 'n8n-nodes-base.set',
  version: 3.5,
  config: { name: 'Edit Fields', parameters: { assignments: { assignments: [{ id: 'f22f9886-2696-47db-b0e2-006ace046ce3', name: 'message', value: expr('Météo à Paris : {{ $json.current_weather.temperature }}°C, vent {{ $json.current_weather.windspeed }} km/h'), type: 'string' }] }, options: {} }, position: [448, 0] }
});

const send_a_message = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Send a message', parameters: { sendTo: 'mkdhenrique@gmail.com', subject: 'La météo du Jour', message: expr('{{ $json.message }}'), options: {} }, credentials: { gmailOAuth2: newCredential('Gmail account', 'uhQ5P3faIyW9eAfZ') }, position: [672, 0], webhookId: 'cc0d1412-d1c1-4936-bfe7-962a77ba8501' }
});

const wf = workflow('LLQFvWUpr5vL3Sne', 'Demo ES', { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true });

export default wf
  .add(schedule_Trigger)
  .to(hTTP_Request)
  .to(edit_Fields)
  .to(send_a_message)