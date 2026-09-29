const schedule_Trigger = trigger({
  type: 'n8n-nodes-base.scheduleTrigger',
  version: 1.4,
  config: { name: 'Schedule Trigger', parameters: { rule: { interval: [{ field: 'weeks', triggerAtDay: [5], triggerAtHour: 14, triggerAtMinute: 30 }] } } }
});

const excel_R_cup_rer_donn_es_TCD_LDC = node({
  type: 'n8n-nodes-base.microsoftExcel',
  version: 2.2,
  config: { name: 'Excel - Récupérer données TCD LDC', parameters: { resource: 'table', operation: 'getRows', workbook: { __rl: true, mode: 'list', value: '' }, worksheet: { __rl: true, mode: 'list', value: '' }, table: { __rl: true, mode: 'list', value: '' }, filters: {} }, credentials: { microsoftExcelOAuth2Api: newCredential('Microsoft Excel account', 'vuzM7Wo0l1Kzp32H') }, position: [224, 0] }
});

const merge_Combiner_macro_focus_France = merge({
  version: 3.2,
  config: { name: 'Merge - Combiner macro + focus France', position: [624, -144] }
});

const filtrer_Matchs_quipes_fran_aises = node({
  type: 'n8n-nodes-base.filter',
  version: 2.3,
  config: { name: 'Filtrer - Matchs équipes françaises', parameters: { conditions: { options: { caseSensitive: true, leftValue: '', typeValidation: 'strict', version: 3 }, conditions: [{ id: '75520b19-0b08-4fa4-a140-3aa9e356930e', leftValue: '', rightValue: '', operator: { type: 'string', operation: 'equals', name: 'filter.operator.equals' } }], combinator: 'and' }, options: {} }, position: [448, 0] }
});

const oneDrive_T_l_charger_capture_mises_par_match = node({
  type: 'n8n-nodes-base.microsoftOneDrive',
  version: 1.1,
  config: { name: 'OneDrive - Télécharger capture mises par match', parameters: { operation: 'download' }, credentials: { microsoftOneDriveOAuth2Api: newCredential('Microsoft Drive account', 'flZME3xW8wZ3ivIS') }, position: [848, -144] }
});

const set_Construire_corps_du_mail = node({
  type: 'n8n-nodes-base.set',
  version: 3.5,
  config: { name: 'Set - Construire corps du mail', parameters: { options: {} }, position: [1072, -144] }
});

const send_a_message = node({
  type: 'n8n-nodes-base.gmail',
  version: 2.2,
  config: { name: 'Send a message', parameters: { options: {} }, credentials: { gmailOAuth2: newCredential('Gmail account 2', 'YjfuOXLmRjIs2ESU') }, position: [1296, -144], webhookId: 'dfc04d7a-585a-4d0b-8b0f-5ad4d824e47b' }
});

const wf = workflow('WDtvnPS8qsIPGgZW', 'Try_Auto_Mail_LDC_Unibet', { executionOrder: 'v1', binaryMode: 'separate', availableInMCP: true });

export default wf
  .add(schedule_Trigger)
  .to(excel_R_cup_rer_donn_es_TCD_LDC)
  .to(filtrer_Matchs_quipes_fran_aises)
  .add(sticky('Specs | Rapport hebdomadaire Ligue des Champions/Europa/Conférence League\nPhase 1 : Déclencheur & Livrable\nDéclencheur : chaque vendredi vers 14h, une fois que les rapports Power BI sont mis à jour (les matchs de LDC, Europa League et Conférence League se déroulent le mardi, mercredi et jeudi).\nFréquence : une fois par semaine, à chaque semaine où des matchs européens ont lieu, quelle que soit la phase de la compétition (actuellement phase de poules).\nLivrable final : un mail envoyé via Outlook à 3 destinataires (2 personnes de l\'équipe de Kudo + 1 responsable d\'une autre équipe), contenant :\n•	Une partie macro : mises et TRJ comparés à l\'année dernière, plus les chiffres cumulés\n•	Une capture d\'écran des mises par match\n•	Un focus sur les matchs impliquant des équipes françaises\n•	Un message sur l\'acquisition : les nouveaux clients inscrits pendant la période\n•	Un tableau comparatif de toutes les phases de la compétition (actuellement comparaison J1 vs J8 de la phase de poules)\n•	Une formule de remerciement et une ouverture aux questions en fin de mail\nPhase 2 : Écosystème Technique\nSource de données : Power BI, source unique.\nFlux actuel : Power BI vers Excel (via export ou connexion), puis tableaux croisés dynamiques (TCD) qui génèrent des dashboards automatisés dans Excel.\nAccès technique : aucun accès API Power BI disponible actuellement, uniquement l\'interface visuelle.\nStockage : le fichier Excel est stocké sur SharePoint/OneDrive d\'entreprise.\nOutil d\'envoi : Outlook.\nLimites connues : aucune limitation technique identifiée à ce jour sur Power BI, Excel ou SharePoint.\nPhase 3 : Contraintes opérationnelles et gestion des erreurs\nVolume : une exécution par semaine, uniquement les semaines avec matchs européens.\nBudget IA : pas de contrainte connue à ce stade, à vérifier en interne si une brique IA est utilisée dans la solution finale.\nGestion des erreurs : si une des sources (Power BI, SharePoint, Excel) est indisponible au moment de l\'exécution, le workflow doit envoyer une alerte à Kudo pour qu\'il reprenne la main manuellement, plutôt que d\'échouer silencieusement.\nConfidentialité : contrainte forte, toutes les données manipulées sont internes et sensibles. Tout doit rester strictement dans l\'écosystème Microsoft 365 ou des outils validés par l\'IT de l\'entreprise, aucune sortie vers un outil ou service externe non validé.\n\n', [], { name: 'Sticky Note', width: 912, height: 704, position: [720, 112] }))
  .add(sticky('n8ncli envs edit prod \\\n  --url "https://henriquetm.app.n8n.cloud/workflow/WDtvnPS8qsIPGgZW?projectId=tjFqwPR8yEKmBRhM" \\\n  --access-token "<N8N_MCP_ACCESS_TOKEN>"', [], { name: 'Sticky Note2', width: 448, height: 208, position: [272, 192] }))
  .add(excel_R_cup_rer_donn_es_TCD_LDC.to(merge_Combiner_macro_focus_France.input(1)))
  .add(filtrer_Matchs_quipes_fran_aises.to(merge_Combiner_macro_focus_France.input(0)))
  .add(merge_Combiner_macro_focus_France)
  .to(oneDrive_T_l_charger_capture_mises_par_match
  .to(set_Construire_corps_du_mail)
  .to(send_a_message))