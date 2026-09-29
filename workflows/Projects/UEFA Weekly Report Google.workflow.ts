const every_Friday_2pm = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: { name: 'Every Friday 2pm', parameters: { rule: { interval: [{ field: 'cronExpression', expression: '0 14 * * 5' }] } }, position: [0, 208], notes: 'Every Friday at 14:00 (Europe/Paris), after the Power BI refresh.', notesInFlow: true }
});

const check_Match_Week = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: { name: 'Check Match Week', parameters: { jsCode: '// Tuesdays of European match weeks (YYYY-MM-DD). Update at each new season / phase.\n// Leave empty to run every Friday (the freshness check still applies).\nconst MATCH_WEEK_TUESDAYS = [\n  // \'2026-09-15\', \'2026-09-29\',\n];\n\nconst now = new Date();\nconst tuesday = new Date(now);\ntuesday.setDate(now.getDate() - ((now.getDay() + 5) % 7)); // Tuesday of the current week\ntuesday.setHours(0, 0, 0, 0);\nconst thursday = new Date(tuesday);\nthursday.setDate(tuesday.getDate() + 2);\nconst iso = d => d.toISOString().slice(0, 10);\n\nconst isMatchWeek = MATCH_WEEK_TUESDAYS.length === 0 || MATCH_WEEK_TUESDAYS.includes(iso(tuesday));\nreturn [{ json: { isMatchWeek, periodStart: iso(tuesday), periodEnd: iso(thursday) } }];' }, position: [224, 208], notes: 'Computes the Tuesday to Thursday period of the current week and checks it against the European match calendar.', notesInFlow: true }
});

const is_Match_Week = node({
  type: 'n8n-nodes-base.if',
  version: 2.3,
  config: { name: 'Is Match Week', parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 }, conditions: [{ id: 'is-match-week', leftValue: expr('{{ $json.isMatchWeek }}'), rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }], combinator: 'and' }, options: {} }, position: [448, 208] }
});

const read_Macro_Sheet = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: { name: 'Read Macro Sheet', parameters: { documentId: { __rl: true, value: '1JpyixrNrIMiIpJBv-_Cl01tu9_XA21QcbGfzj3TURNM', mode: 'list', cachedResultName: 'LDC fictif', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1JpyixrNrIMiIpJBv-_Cl01tu9_XA21QcbGfzj3TURNM/edit?usp=drivesdk' }, sheetName: { __rl: true, value: 'gid=0', mode: 'list', cachedResultName: 'Feuille 1', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1JpyixrNrIMiIpJBv-_Cl01tu9_XA21QcbGfzj3TURNM/edit#gid=0' }, options: {} }, credentials: { googleSheetsOAuth2Api: newCredential('Henriquet_M', '2JMWwGIgUbL2HY76') }, position: [672, 112], notes: 'Reads the "Macro" tab of the reporting Google Sheet.', notesInFlow: true, executeOnce: true, retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, alwaysOutputData: true, onError: 'continueRegularOutput' }
});

const read_Matches_Sheet = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: { name: 'Read Matches Sheet', parameters: { documentId: { __rl: true, value: '1JpyixrNrIMiIpJBv-_Cl01tu9_XA21QcbGfzj3TURNM', mode: 'list', cachedResultName: 'LDC fictif', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1JpyixrNrIMiIpJBv-_Cl01tu9_XA21QcbGfzj3TURNM/edit?usp=drivesdk' }, sheetName: { __rl: true, value: 494954593, mode: 'list', cachedResultName: 'Matchs', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1JpyixrNrIMiIpJBv-_Cl01tu9_XA21QcbGfzj3TURNM/edit#gid=494954593' }, options: {} }, credentials: { googleSheetsOAuth2Api: newCredential('Henriquet_M', '2JMWwGIgUbL2HY76') }, position: [960, 112], notes: 'Reads the "Matchs" tab of the reporting Google Sheet.', notesInFlow: true, executeOnce: true, retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, alwaysOutputData: true, onError: 'continueRegularOutput' }
});

const read_Acquisition_Sheet = node({
  type: 'n8n-nodes-base.googleSheets',
  version: 4.7,
  config: { name: 'Read Acquisition Sheet', parameters: { documentId: { __rl: true, value: '1JpyixrNrIMiIpJBv-_Cl01tu9_XA21QcbGfzj3TURNM', mode: 'list', cachedResultName: 'LDC fictif', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1JpyixrNrIMiIpJBv-_Cl01tu9_XA21QcbGfzj3TURNM/edit?usp=drivesdk' }, sheetName: { __rl: true, value: 1440279191, mode: 'list', cachedResultName: 'Acquisition', cachedResultUrl: 'https://docs.google.com/spreadsheets/d/1JpyixrNrIMiIpJBv-_Cl01tu9_XA21QcbGfzj3TURNM/edit#gid=1440279191' }, options: {} }, credentials: { googleSheetsOAuth2Api: newCredential('Henriquet_M', '2JMWwGIgUbL2HY76') }, position: [1248, 112], notes: 'Reads the "Matchs" tab of the reporting Google Sheet.', notesInFlow: true, executeOnce: true, retryOnFail: true, maxTries: 3, waitBetweenTries: 5000, alwaysOutputData: true, onError: 'continueRegularOutput' }
});

const validate_and_Build_Report = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: { name: 'Validate and Build Report', parameters: { jsCode: 'const period = $(\'Check Match Week\').first().json;\nconst sources = {\n  Macro: $(\'Read Macro Sheet\').all(),\n  Matchs: $(\'Read Matches Sheet\').all(),\n  Acquisition: $(\'Read Acquisition Sheet\').all(),\n};\n\n// Optional: phases comparison (only if a "Read Phases Sheet" node exists)\nlet phases = [];\ntry { phases = $(\'Read Phases Sheet\').all().map(i => i.json).filter(r => !r.error && Object.keys(r).length > 0); } catch (e) {}\n\n// If the table does not start on row 1, the real header row may come through as data:\n// find the row containing "Date" (or "Match") and use it as the header.\nconst fixHeaders = rows => {\n  if (rows.some(r => Object.keys(r).some(k => /date|match/i.test(k)))) return rows;\n  const idx = rows.findIndex(r => Object.values(r).some(v => /^(date|match)$/i.test(String(v).trim())));\n  if (idx === -1) return rows;\n  const keys = Object.keys(rows[idx]);\n  const headers = keys.map(k => String(rows[idx][k] ?? \'\').trim());\n  return rows.slice(idx + 1).map(r => Object.fromEntries(keys.map((k, i) => [headers[i], r[k]]).filter(([h]) => h)));\n};\nconst isEmptyRow = r => Object.entries(r).every(([k, v]) => k === \'row_number\' || v === \'\' || v === null || v === undefined);\n\n// 1. Detect unavailable or empty sources\nconst errors = [];\nconst data = {};\nfor (const [sheet, items] of Object.entries(sources)) {\n  const failed = items.find(i => i.json.error);\n  const rows = fixHeaders(items.map(i => i.json).filter(r => !r.error && Object.keys(r).length > 0)).filter(r => !isEmptyRow(r));\n  if (failed) errors.push(`Onglet "${sheet}" illisible : ${failed.json.error.message || JSON.stringify(failed.json.error)}`);\n  else if (rows.length === 0) errors.push(`Onglet "${sheet}" vide.`);\n  data[sheet] = rows;\n}\n\n// 2. Freshness check: the Matchs sheet must contain this week\'s matches\n// Accepts Sheets serial numbers, "29/09/2026" (French format) and ISO dates.\nconst toDate = v => {\n  if (typeof v === \'number\') return new Date(Math.round((v - 25569) * 86400000));\n  const m = String(v ?? \'\').trim().match(/^(\\d{1,2})[\\/.-](\\d{1,2})[\\/.-](\\d{4})/);\n  if (m) return new Date(Date.UTC(+m[3], +m[2] - 1, +m[1]));\n  return new Date(v);\n};\nconst matchRows = data.Matchs || [];\nconst dateKey = Object.keys(matchRows[0] || {}).find(k => /date/i.test(k));\nconst frKey = Object.keys(matchRows[0] || {}).find(k => /equipe|fr/i.test(k) && !/date/i.test(k));\nconst start = new Date(period.periodStart + \'T00:00:00Z\');\nconst end = new Date(period.periodEnd + \'T23:59:59Z\');\nconst weekMatches = dateKey ? matchRows.filter(r => { const d = toDate(r[dateKey]); return d >= start && d <= end; }) : [];\nif (!errors.length && weekMatches.length === 0) {\n  const cols = Object.keys(matchRows[0] || {}).filter(k => k !== \'row_number\');\n  const sample = matchRows.slice(0, 3).map(r => JSON.stringify(dateKey ? r[dateKey] : r)).join(\', \');\n  errors.push(`Aucun match du ${period.periodStart} au ${period.periodEnd} dans l\'onglet "Matchs" : les données Power BI / Google Sheets n\'ont probablement pas été actualisées. (Diagnostic : ${matchRows.length} lignes lues, colonnes = [${cols.join(\', \')}], colonne date = ${dateKey || \'introuvable\'}, exemples = ${sample})`);\n}\nif (errors.length) return [{ json: { ok: false, period, errors } }];\n\n// 3. Build the HTML email\nconst fmtCell = (col, v) => {\n  if (/date/i.test(col) && v !== \'\' && v !== undefined) { const dt = toDate(v); return isNaN(dt) ? v : dt.toLocaleDateString(\'fr-FR\', { timeZone: \'UTC\' }); }\n  if (typeof v !== \'number\') return v ?? \'\';\n  if (/trj|taux|%/i.test(col) && Math.abs(v) <= 5) return (v * 100).toLocaleString(\'fr-FR\', { maximumFractionDigits: 1 }) + \' %\';\n  if (/mise|montant|ca|ggr|€/i.test(col)) return v.toLocaleString(\'fr-FR\', { maximumFractionDigits: 0 }) + \' €\';\n  return v.toLocaleString(\'fr-FR\', { maximumFractionDigits: 2 });\n};\nconst cell = \'border:1px solid #ccc;padding:4px 8px\';\nconst table = rows => {\n  if (!rows.length) return \'<p><i>Aucune donnée.</i></p>\';\n  const cols = Object.keys(rows[0]).filter(c => c !== \'row_number\');\n  const th = cols.map(c => `<th style="${cell};background:#f2f2f2;text-align:left">${c}</th>`).join(\'\');\n  const tr = rows.map(r => \'<tr>\' + cols.map(c => `<td style="${cell}">${fmtCell(c, r[c])}</td>`).join(\'\') + \'</tr>\').join(\'\');\n  return `<table style="border-collapse:collapse;font-size:13px"><tr>${th}</tr>${tr}</table>`;\n};\nconst frenchMatches = frKey ? weekMatches.filter(r => String(r[frKey] ?? \'\').trim().toLowerCase().startsWith(\'o\')) : [];\nconst d = s => new Date(s + \'T12:00:00\').toLocaleDateString(\'fr-FR\');\n\nconst html = `<div style="font-family:Calibri,Arial;font-size:14px">\n<p>Bonjour à tous,</p>\n<p>Voici le rapport hebdomadaire des coupes d\'Europe (Ligue des Champions, Europa League, Conférence League) pour la période du ${d(period.periodStart)} au ${d(period.periodEnd)}.</p>\n<h3>1. Vue macro : mises et TRJ vs N-1, et cumuls</h3>${table(data.Macro)}\n<h3>2. Mises par match</h3>${table(weekMatches)}\n<h3>3. Focus équipes françaises</h3>${frenchMatches.length ? table(frenchMatches) : \'<p>Aucun match impliquant une équipe française cette semaine.</p>\'}\n<h3>4. Acquisition : nouveaux clients sur la période</h3>${table(data.Acquisition)}\n<h3>5. Comparatif des phases de la compétition</h3>${phases.length ? table(phases) : \'<p><i>Données des phases non disponibles.</i></p>\'}\n<p>Merci à tous, et n\'hésitez pas à revenir vers moi pour toute question.</p>\n<p>Bonne fin de semaine,<br>Kudo</p>\n</div>`;\n\nreturn [{ json: { ok: true, period, subject: `Rapport hebdo Coupes d\'Europe - semaine du ${d(period.periodStart)}`, html } }];\n' }, position: [1520, 16], notes: 'Checks that every sheet was read and that this week matches are present, then builds the HTML email.', notesInFlow: true }
});

const is_Data_Valid = node({
  type: 'n8n-nodes-base.if',
  version: 2.3,
  config: { name: 'Is Data Valid', parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 2 }, conditions: [{ id: 'is-data-valid', leftValue: expr('{{ $json.ok }}'), rightValue: '', operator: { type: 'boolean', operation: 'true', singleValue: true } }], combinator: 'and' }, options: {} }, position: [1760, 112] }
});

const send_Weekly_Report = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Send Weekly Report', parameters: { sendTo: 'mkdhenrique@gmail.com, nmedrano@eugeniaschool.com', subject: expr('{{ $json.subject }}'), message: expr('{{ $json.html }}'), options: { appendAttribution: false } }, credentials: { gmailOAuth2: newCredential('Gmail account', 'uhQ5P3faIyW9eAfZ') }, position: [1984, 0], webhookId: 'd005737d-639b-4a77-bea2-0ecb5b1b027b', onError: 'continueErrorOutput' }
});

const alert_Kudo = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Alert Kudo', parameters: { sendTo: 'mkdhenrique@gmail.com', subject: '[URGENT] Rapport hebdo Coupes d\'Europe NON envoyé - reprise manuelle nécessaire', message: expr('<p>Le rapport automatique n\'a pas pu être généré ou envoyé.</p><p><b>Détail :</b></p><ul>{{ ($json.errors || [$json.error ? ($json.error.message || JSON.stringify($json.error)) : \'Erreur inconnue\']).map(e => \'<li>\' + e + \'</li>\').join(\'\') }}</ul><p>Merci de reprendre la main manuellement.</p>'), options: { appendAttribution: false } }, credentials: { gmailOAuth2: newCredential('Gmail account', 'uhQ5P3faIyW9eAfZ') }, position: [1984, 272], webhookId: '1f7ba06f-f379-4b72-a9d6-d615ff64b82e' }
});

const no_Match_This_Week = node({
  type: 'n8n-nodes-base.noOp',
  version: 1,
  config: { name: 'No Match This Week', position: [672, 400] }
});

const wf = workflow('1LEWl5gKO67A38wx', 'UEFA Weekly Report Google', { description: 'Every Friday of a European match week, reads the reporting Google Sheet fed by Power BI, builds the Champions League, Europa League and Conference League report and sends it with Gmail. Alerts Kudo if a source is unavailable.', executionOrder: 'v1', timezone: 'Europe/Paris', availableInMCP: true, binaryMode: 'separate' });

export default wf
  .add(every_Friday_2pm)
  .to(check_Match_Week)
  .to(is_Match_Week.onTrue(read_Macro_Sheet
    .to(read_Matches_Sheet)
    .to(read_Acquisition_Sheet)
    .to(validate_and_Build_Report)
    .to(is_Data_Valid.onTrue(send_Weekly_Report
      .onError(alert_Kudo)).onFalse(alert_Kudo))).onFalse(no_Match_This_Week))
  .add(sticky('## Setup\n1. Pick the Google Sheet (From list) in the 4 **Read ... Sheet** nodes.\n2. Expected tabs: **Macro**, **Matchs** (must have a `Date` column and an `Equipe Francaise` column with Oui/Non), **Acquisition**, **Phases**. Any other columns are rendered as-is.\n3. Set the 3 recipients in **Send Weekly Report** and Kudo\'s address in **Alert Kudo**.\n4. Optional: fill the match calendar in **Check Match Week**.\n5. Connect the Google Sheets and Gmail credentials.', [validate_and_Build_Report], { name: 'Sticky Note', color: 2, width: 900, height: 300, position: [624, -256] }))