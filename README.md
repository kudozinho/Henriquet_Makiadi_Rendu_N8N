# Henriquet Makiadi — Rendu n8n

Export des workflows n8n de Henriquet Makiadi, organisés comme dans l'instance n8n (dossiers Templates, Utils, Sandbox, Projects).

Les workflows sont au format TypeScript du SDK n8n (`@n8n/workflow-sdk`), exportés avec [`n8ncli`](https://www.npmjs.com/package/@workflows-accelerator/n8n-cli).

## Contenu

| Dossier | Workflow | Description |
|---|---|---|
| Projects | UEFA Weekly Report Google | Rapport hebdomadaire Ligue des Champions / Europa League / Conférence League : chaque vendredi 14h, lecture des données dans Google Sheets, contrôle de fraîcheur, envoi du rapport par Gmail, alerte en cas de source indisponible. |
| Sandbox | AI Email Reply Agent | Agent IA (Google Gemini) qui répond automatiquement aux nouveaux emails Gmail. |
| Sandbox | Try_Auto_Mail_LDC_Unibet | Premier essai du mail automatique LDC (OneDrive / Excel → Gmail). |
| Sandbox | Foot | Récupération des matchs et du classement de Ligue 1 (API football-data.org). |
| Sandbox | Pokemon | Récupération et tri de Pokémon (PokéAPI). |
| Sandbox | Demo ES | Démo : appel HTTP planifié et envoi par Gmail. |
| Utils | My workflow | Agent de chat IA (Anthropic) avec mémoire Postgres. |
| Templates | — | (vide) |

## Secrets

Aucun secret n'est versionné. Les identifiants (Gmail, Google Sheets, Gemini, etc.) sont des credentials n8n référencés par leur ID, jamais exportés.
Les valeurs sensibles présentes en dur dans certains workflows ont été remplacées par des marqueurs :

- `<FOOTBALL_DATA_API_KEY>` : clé API football-data.org (workflow Foot)
- `<N8N_MCP_ACCESS_TOKEN>` : token MCP n8n (note du workflow Try_Auto_Mail_LDC_Unibet)

## Réimporter dans n8n

```bash
npm install -g @workflows-accelerator/n8n-cli
n8ncli init --env <nom> --project-id <id-projet>
# copier le dossier workflows/ dans n8n/workflows/, puis :
n8ncli push --all
```
