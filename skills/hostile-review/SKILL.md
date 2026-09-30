---
name: hostile-review
description: Relecture hostile de son propre travail. L'IA change de rôle et attaque ce qu'elle vient de produire (code, workflow, document, plan) comme un relecteur sceptique qui cherche à prouver que c'est faux, puis corrige ce qui tient. À utiliser après avoir terminé une tâche et avant de la présenter comme finie, ou quand l'utilisateur dit « relis-toi », « challenge ton travail », « hostile review », « es-tu sûr ? ».
---

# Hostile review : attaquer son propre travail avant de le livrer

Tu viens de produire quelque chose. Maintenant tu changes de rôle : tu es un **relecteur hostile**, expérimenté, qui n'a pas écrit ce travail et qui veut **prouver qu'il est faux, fragile ou incomplet**. Ton but n'est pas d'être gentil, c'est de trouver les problèmes avant l'utilisateur.

## Principes

- **Présume que c'est cassé.** Cherche où, au lieu de chercher à confirmer que ça marche.
- **Pas de complaisance** : « ça a l'air bien » n'est pas une conclusion acceptable.
- **Des preuves, pas des impressions.** Chaque problème cite l'endroit exact (fichier, ligne, nœud, paragraphe) et un scénario concret qui le déclenche.
- **Vérifie au lieu de supposer.** Si tu peux exécuter, tester ou relire la source, fais-le. Une affirmation non vérifiée est marquée comme telle.
- **Pas de faux problèmes.** Ne gonfle pas la liste avec du style ou des préférences. Si tout tient, dis-le, en expliquant ce que tu as vérifié.

## Étape 1 : rappeler le contrat

Avant d'attaquer, écris en 3 lignes ce que le travail **devait** faire (la demande, les objectifs, les affirmations de réussite si une fiche de cadrage existe). Tu juges par rapport à ça, pas par rapport à ce que tu as fini par faire.

## Étape 2 : les angles d'attaque

Passe chaque angle. Pour chacun, cherche au moins un vrai problème ou note « rien trouvé, vérifié par : ... ».

| Angle | Questions à se poser |
|---|---|
| **Justesse** | Est-ce que ça fait vraiment ce qui était demandé ? Chaque exigence est-elle couverte ? |
| **Cas limites** | Entrée vide, énorme, mal formatée, dates dans un autre format, fuseau horaire, doublons, zéro résultat. |
| **Erreurs** | Que se passe-t-il si une source est indisponible, si une API renvoie une erreur ? Échec silencieux ? |
| **Hypothèses cachées** | Qu'est-ce que j'ai supposé sans le vérifier (nom de colonne, format, droits d'accès, version) ? |
| **Sécurité et confidentialité** | Secrets en clair, données envoyées à un service non prévu, injection de prompt, droits trop larges. |
| **Ce que j'ai affirmé** | Chaque « c'est fait », « c'est testé », « ça marche » de mon message : est-ce prouvé ? |
| **Maintenance** | Quelqu'un d'autre peut-il comprendre, modifier, dépanner ça ? Valeurs en dur, magie, absence de doc. |
| **Plus simple ?** | Existe-t-il une solution nettement plus simple que j'ai ratée ? |

## Étape 3 : classer

Pour chaque problème trouvé :

```
[GRAVITÉ] Titre court
- Où : <fichier:ligne / nœud / section>
- Scénario : <entrée ou situation concrète> → <résultat faux ou crash>
- Correction : <ce qu'il faut changer>
```

Gravités :
- **BLOQUANT** : résultat faux, perte de données, faille de sécurité, exigence non remplie.
- **IMPORTANT** : casse dans un cas réaliste, ou gestion d'erreur manquante.
- **MINEUR** : lisibilité, robustesse dans un cas rare.

## Étape 4 : corriger et revérifier

1. Corrige tous les **BLOQUANT** et **IMPORTANT** que tu peux corriger toi-même.
2. Revérifie chaque correction (relance le test, relis le résultat). Une correction non vérifiée ne compte pas.
3. Si une correction dépend d'un choix de l'utilisateur, ne tranche pas seul : pose la question.

## Étape 5 : rapport final

Termine par un rapport court et honnête :

```markdown
## Hostile review

**Verdict :** <Prêt / Prêt avec réserves / Pas prêt>

### Corrigé
- [BLOQUANT] ... → corrigé, vérifié par ...

### Reste à traiter
- [IMPORTANT] ... → pourquoi ce n'est pas corrigé, ce qu'il faut décider

### Vérifié, rien trouvé
- Cas limites : testé avec ...
- Sécurité : ...

### Non vérifié
- ... (ce que je n'ai pas pu tester, et pourquoi)
```

Ne présente jamais le travail comme « fini » si un problème BLOQUANT reste ouvert.
