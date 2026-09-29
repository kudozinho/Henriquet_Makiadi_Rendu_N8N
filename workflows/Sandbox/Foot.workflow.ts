const when_clicking_Execute_workflow = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'When clicking \u2018Execute workflow\u2019' }
});

const hTTP_Request = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: { name: 'HTTP Request', parameters: { url: 'https://api.football-data.org/v4/competitions/FL1/matches', sendHeaders: true, headerParameters: { parameters: [{ name: 'X-Auth-Token', value: '<FOOTBALL_DATA_API_KEY>' }] }, options: {} }, position: [224, 0] }
});

const split_Out = node({
  type: 'n8n-nodes-base.splitOut',
  version: 1,
  config: { name: 'Split Out', parameters: { fieldToSplitOut: 'matches', options: {} }, position: [448, 0] }
});

const filter = node({
  type: 'n8n-nodes-base.filter',
  version: 2.3,
  config: { name: 'Filter', parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 3 }, conditions: [{ id: '4599a56d-df9c-49d6-bf24-ac67dda1456f', leftValue: expr('{{ $json.status }}'), rightValue: 'SCHEDULED', operator: { type: 'string', operation: 'equals', name: 'filter.operator.equals' } }], combinator: 'and' }, options: {} }, position: [672, 0] }
});

const hTTP_Request1 = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: { name: 'HTTP Request1', parameters: { url: 'https://api.football-data.org/v4/competitions/FL1/standings', sendHeaders: true, headerParameters: { parameters: [{ name: 'X-Auth-Token', value: '<FOOTBALL_DATA_API_KEY>' }] }, options: {} }, position: [896, 0] }
});

const wf = workflow('DAtA8OdkzPfNwgMI', 'Foot', { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true });

export default wf
  .add(when_clicking_Execute_workflow)
  .to(hTTP_Request)
  .to(split_Out)
  .to(filter)
  .to(hTTP_Request1)