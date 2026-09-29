const when_clicking_Execute_workflow = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'When clicking \u2018Execute workflow\u2019' }
});

const hTTP_Request = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: { name: 'HTTP Request', parameters: { url: 'https://pokeapi.co/api/v2/pokemon?limit=50', options: {} }, position: [224, 0] }
});

const split_Out = node({
  type: 'n8n-nodes-base.splitOut',
  version: 1,
  config: { name: 'Split Out', parameters: { fieldToSplitOut: 'results', options: {} }, position: [448, 0] }
});

const hTTP_Request1 = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: { name: 'HTTP Request1', parameters: { url: expr('{{ $json.url }}'), options: {} }, position: [672, 0] }
});

const filter = node({
  type: 'n8n-nodes-base.filter',
  version: 2.3,
  config: { name: 'Filter', parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'loose', version: 3 }, conditions: [{ id: '4b3ee6fb-f21c-4ec0-9022-35b584fdd60b', leftValue: expr('{{ $json.types.some(t => t.type.name === \'fire\') }}'), rightValue: 'true', operator: { type: 'boolean', operation: 'exists', singleValue: true } }], combinator: 'and' }, looseTypeValidation: true, options: {} }, position: [896, 0] }
});

const merge_node = merge({
  version: 3.2,
  config: { name: 'Merge', parameters: { mode: 'combine', combineBy: 'combineByPosition', options: {} }, position: [1264, 160] }
});

const hTTP_Request2 = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.5,
  config: { name: 'HTTP Request2', parameters: { url: expr('{{ $json.species.url }}'), options: {} }, position: [1120, 0] }
});

const code_in_JavaScript = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: { name: 'Code in JavaScript', parameters: { mode: 'runOnceForEachItem', jsCode: 'const stats = $input.item.json.stats;\n\n// On récupère chaque stat par son nom\nconst getStat = (name) => {\n  const stat = stats.find(s => s.stat.name === name);\n  return stat ? stat.base_stat : 0;\n};\n\nconst attack = getStat(\'attack\');\nconst defense = getStat(\'defense\');\nconst speed = getStat(\'speed\');\nconst hp = getStat(\'hp\');\n\n// Score de puissance perso : pondération simple\nconst powerScore = (attack * 1.5) + (defense * 1.2) + (speed * 1.3) + hp;\n\nreturn {\n  ...$input.item.json,\n  power_score: Math.round(powerScore)\n};' }, position: [1488, 160] }
});

const sort = node({
  type: 'n8n-nodes-base.sort',
  version: 1,
  config: { name: 'Sort', parameters: { sortFieldsUi: { sortField: [{ fieldName: 'power_score', order: 'descending' }] }, options: {} }, position: [1616, -64] }
});

const limit = node({
  type: 'n8n-nodes-base.limit',
  version: 1,
  config: { name: 'Limit', parameters: { maxItems: 5 }, position: [1712, 160] }
});

const edit_Fields = node({
  type: 'n8n-nodes-base.set',
  version: 3.5,
  config: { name: 'Edit Fields', parameters: { assignments: { assignments: [{ id: '842c0ceb-a711-4caf-b39a-603a7cc3bfaa', name: 'message', value: expr('{{ $json.name }} - Score de puissance : {{ $json.power_score }} (Attaque: {{ $json.stats.find(s => s.stat.name === \'attack\').base_stat }}, Défense: {{ $json.stats.find(s => s.stat.name === \'defense\').base_stat }})'), type: 'string' }] }, options: {} }, position: [1936, 160] }
});

const wf = workflow('ksUO8qo17aFWwuGX', 'Pokemon', { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true });

export default wf
  .add(when_clicking_Execute_workflow)
  .to(hTTP_Request)
  .to(split_Out)
  .to(hTTP_Request1)
  .to(filter)
  .to(hTTP_Request2)
  .add(filter.to(merge_node.input(1)))
  .add(hTTP_Request2.to(merge_node.input(0)))
  .add(merge_node)
  .to(code_in_JavaScript
  .to(sort)
  .to(limit)
  .to(edit_Fields))