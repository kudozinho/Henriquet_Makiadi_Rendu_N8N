# Henriquet Makiadi — Rendu n8n

Export des workflows n8n de Henriquet Makiadi, organisés comme dans l'instance n8n (dossiers Projects, Sandbox, Utils).

Les workflows sont au format TypeScript du SDK n8n (`@n8n/workflow-sdk`), exportés avec [`n8ncli`](https://www.npmjs.com/package/@workflows-accelerator/n8n-cli).

## Projet principal : RAG Multi-Livres

Chatbot RAG (n8n + Supabase/pgvector + Google Gemini) qui répond à partir de n'importe quel livre ajouté à sa base, en citant ses sources. Testé avec deux documents sur des sujets différents :

- *Interpreting Canada's 2019 Food Guide and Food Labelling for Health Professionals* (Lapum et al., eCampusOntario, CC BY-NC-SA 4.0)
- *La blessure dans le sport de haut niveau : des conditions de survenue au dispositif de prise en charge* (Burlot, Dalgalarrondo, Joncheray, Couckuyt, Chavignier-Réla, INSEP, CC BY 4.0)

**Ingestion** : PDF Form → Extract → Cleaning → Chunking (≈1200 caractères, 200 de chevauchement) → Limit → Augmentation Gemini (contexte, thème, mots-clés, par paquets de 25) → sous-workflow : Embedding Gemini (`gemini-embedding-001`) → Save Chunk Embedding (Supabase, table `nutrition_chunks`).

**Answering** :

| Étape | Rôle |
|---|---|
| Context | message, configuration et historique de conversation (table `chat_messages`) |
| Routing | Gemini décide s'il faut chercher et génère 2–3 requêtes (FR/EN, dont une HyDE) + mots-clés |
| Search | embeddings des requêtes (table `nutrition_queries`), recherche SQL hybride (80 % vecteur + 20 % mots-clés), filtre par score |
| Reranking | Gemini ne garde que les extraits réellement utiles |
| Generation | Gemini rédige la réponse en citant les livres, puis la conversation est sauvegardée |

`Setup Answering Tables` (Utils) crée une fois les tables `chat_messages` et `nutrition_queries`.

## Contenu

| Dossier | Workflow | Description |
|---|---|---|
| Projects | RAG Multi-Livres | Chatbot RAG multi-livres décrit ci-dessus. |
| Utils | Setup Answering Tables | Création des tables Supabase de l'answering (à lancer une fois). |
| Projects | UEFA Weekly Report Google | Rapport hebdomadaire Ligue des Champions / Europa League / Conférence League : chaque vendredi 14h, lecture des données dans Google Sheets, contrôle de fraîcheur, envoi du rapport par Gmail, alerte en cas de source indisponible. |
| Sandbox | AI Email Reply Agent | Agent IA (Google Gemini) qui répond automatiquement aux nouveaux emails Gmail. |
| Sandbox | Try_Auto_Mail_LDC_Unibet | Premier essai du mail automatique LDC (OneDrive / Excel → Gmail). |
| Sandbox | Foot | Récupération des matchs et du classement de Ligue 1 (API football-data.org). |
| Sandbox | Pokemon | Récupération et tri de Pokémon (PokéAPI). |
| Sandbox | Demo ES | Démo : appel HTTP planifié et envoi par Gmail. |
| Utils | My workflow | Agent de chat IA (Anthropic) avec mémoire Postgres. |
| Templates | — | Non versionné : le seul template présent est un workflow tiers (© Lucas Peyrin). |

## Skills (prompts pré-faits)

Le dossier `skills/` contient 3 skills au format [skills.sh](https://skills.sh) (`SKILL.md`), utilisables avec Claude Code, Cursor, Codex, etc.

| Skill | Rôle |
|---|---|
| [`interview`](skills/interview/SKILL.md) | Interroge l'utilisateur pour transformer une demande floue en objectifs SMART et en affirmations vérifiables (« Étant donné… quand… alors… »). |
| [`hostile-review`](skills/hostile-review/SKILL.md) | L'IA attaque son propre travail comme un relecteur sceptique, classe les problèmes (bloquant / important / mineur), corrige et revérifie. |
| [`doubt-driven-dev`](skills/doubt-driven-dev/SKILL.md) | À chaque étape, l'IA liste ses suppositions, les classe par risque et vérifie les plus risquées avant de construire dessus. |

Enchaînement conseillé : `interview` (cadrer) → `doubt-driven-dev` (construire) → `hostile-review` (vérifier avant de livrer).

Installation (dépôt privé : il faut être connecté à GitHub avec un compte qui y a accès) :

```bash
npx skills add kudozinho/Henriquet_Makiadi_Rendu_N8N
```

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
