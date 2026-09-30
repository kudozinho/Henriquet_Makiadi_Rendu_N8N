---
name: doubt-driven-dev
description: Développement piloté par le doute. Avant et pendant chaque étape d'une tâche technique, l'IA liste explicitement ce dont elle n'est pas sûre, classe ces doutes par risque, et vérifie les plus risqués (lecture de doc, test, exécution, question à l'utilisateur) avant de construire dessus. À utiliser pour tout développement, intégration d'API, workflow d'automatisation ou débogage, et quand l'utilisateur dit « doubt-driven », « vérifie avant de coder », « ne suppose rien ».
---

# Doubt-driven dev : ne jamais construire sur une supposition

La plupart des bugs viennent d'une supposition jamais vérifiée : « la colonne s'appelle Date », « l'API renvoie une liste », « le push a marché ». Cette méthode rend ces suppositions **visibles** et les **vérifie** avant qu'elles ne coûtent cher.

## La boucle

Pour chaque étape du travail, répète :

```
1. DOUTER    → lister ce que je suppose sans l'avoir vérifié
2. CLASSER   → probabilité d'erreur × coût si c'est faux
3. VÉRIFIER  → lever les doutes risqués avec la méthode la moins chère
4. CONSTRUIRE → uniquement sur ce qui est vérifié
5. CONFIRMER → prouver que l'étape marche avant de passer à la suivante
```

## 1. Douter : le registre des doutes

Avant de coder, écris le registre. Sources typiques de doute :

- **Format des données** : noms de colonnes, types (texte ou nombre ?), format des dates, valeurs vides.
- **Comportement d'un outil** : ce que renvoie une API, une commande, un nœud ; paramètres exacts ; version.
- **Environnement** : droits d'accès, clés configurées, fuseau horaire, version installée.
- **Compréhension de la demande** : ce que l'utilisateur veut vraiment dans un cas ambigu.
- **Effets de mes actions** : est-ce que la commande a vraiment modifié ce que je crois ?

```markdown
| # | Je suppose que... | Probabilité d'erreur | Coût si faux | Action |
|---|---|---|---|---|
| D1 | la colonne des dates s'appelle "Date" | moyenne | élevé (aucun match trouvé) | lire un échantillon réel |
| D2 | les dates arrivent au format ISO | élevée | élevé | tester sur une vraie ligne |
| D3 | l'utilisateur veut un envoi auto | faible | élevé (mail envoyé à tort) | demander |
```

## 2. Classer

- **Probabilité élevée ou coût élevé → à vérifier avant de continuer.**
- Probabilité faible **et** coût faible → noter, avancer, mais rendre l'échec visible (message d'erreur clair, log de diagnostic).
- Un doute sur une action **irréversible** (envoyer, supprimer, publier, payer) est toujours à lever avant d'agir.

## 3. Vérifier, du moins cher au plus cher

1. **Lire** : le code existant, un fichier, la doc officielle, l'aide de la commande (`--help`).
2. **Observer** : afficher un échantillon réel des données, exécuter en mode simulation (`--dry-run`).
3. **Tester** : un petit test isolé avec des données représentatives, y compris les cas limites.
4. **Demander** à l'utilisateur, seulement pour ce qu'il est le seul à savoir (intentions, préférences, accès).

Note le résultat dans le registre : **confirmé**, **infirmé** (et ce qui est vrai à la place) ou **impossible à vérifier** (et pourquoi).

## 4. Construire

- Ne construis que sur des doutes **confirmés**.
- Pour ce qui reste incertain, code de façon **défensive** : accepter plusieurs formats, valider les entrées, échouer bruyamment avec un message qui dit ce qui a été reçu.

## 5. Confirmer

Chaque étape se termine par une **preuve**, pas une impression :
- une commande relancée qui montre le nouvel état,
- un test qui passe,
- une relecture du résultat réel (le fichier écrit, le workflow tel qu'il est sur le serveur).

⚠️ Un outil qui affiche « succès » n'est pas une preuve : vérifie l'état final.

## Règles de communication

- Distingue toujours dans tes messages : **vérifié**, **supposé**, **non vérifié**.
- Ne dis « ça marche » que si tu l'as constaté. Sinon : « Ça devrait marcher, mais je n'ai pas pu le tester parce que... ».
- Quand un doute se révèle faux, dis-le simplement et corrige : c'est le système qui fonctionne.

## Livrable de fin

```markdown
## Registre des doutes

| # | Supposition | Statut | Comment |
|---|---|---|---|
| D1 | ... | ✅ confirmé | lu dans ... |
| D2 | ... | ❌ infirmé → en réalité ... | test sur ... |
| D3 | ... | ⚠️ non vérifié | raison ; risque restant |
```
