---
name: interview
description: Interroge l'utilisateur avant de commencer une tâche pour transformer une demande floue en objectifs clairs et en affirmations vérifiables (critères d'acceptation). À utiliser au début d'un projet, d'une fonctionnalité ou d'un workflow, quand la demande est vague, quand l'utilisateur dit « interview-moi », « aide-moi à cadrer », « définis les objectifs », ou avant tout travail qui prendra plus de quelques minutes.
---

# Interview : cadrer une demande en objectifs et affirmations vérifiables

Ton rôle : ne rien construire tant que tu ne sais pas **ce que « réussi » veut dire**. Tu mènes un entretien court et structuré, puis tu produis une fiche de cadrage que l'utilisateur valide.

## Règles de l'entretien

1. **Une question à la fois**, ou un petit groupe de 2 à 3 questions liées. Jamais un questionnaire de 15 questions d'un coup.
2. **Propose des réponses par défaut.** Chaque question vient avec ta recommandation : « Je propose X, parce que Y. Ça te va ? ». L'utilisateur doit pouvoir répondre « oui » pour avancer vite.
3. **Ne demande pas ce que tu peux découvrir seul** (lire le code, un fichier, une doc). Vérifie d'abord, demande ensuite.
4. **Arrête-toi dès que tu en sais assez.** Un entretien fait en général 3 à 6 échanges. Si une question ne changerait rien à ce que tu vas faire, ne la pose pas.
5. **Reformule** ce que tu as compris avant de conclure.

## Ce que tu dois obtenir

Couvre ces 6 points, dans cet ordre, en sautant ceux qui sont déjà clairs :

| Point | Question type |
|---|---|
| **Le but** | Quel problème ça résout ? Pour qui ? Que se passe-t-il aujourd'hui sans ça ? |
| **Le livrable** | Qu'est-ce qui existe à la fin, concrètement (un fichier, un mail, un workflow, une page) ? |
| **Le déclencheur et le contexte** | Quand et comment c'est utilisé ? Avec quelles données, quels outils ? |
| **Les contraintes** | Budget, délais, outils imposés, confidentialité, ce qui est interdit. |
| **Les cas d'erreur** | Que doit-il se passer si une source manque, si les données sont fausses, si ça plante ? |
| **Hors périmètre** | Qu'est-ce qu'on ne fait volontairement **pas** ? |

## Écrire de bons objectifs

Un bon objectif est **SMART** : spécifique, mesurable, atteignable, pertinent, borné dans le temps.

- ❌ « Automatiser le reporting. »
- ✅ « Chaque vendredi à 14h, envoyer automatiquement le rapport hebdo des coupes d'Europe aux 3 destinataires, sans intervention manuelle. »

## Écrire de bonnes affirmations (critères d'acceptation)

Une affirmation est une phrase **vraie ou fausse** qu'on peut **vérifier** sans interprétation. C'est ce qui servira à dire « c'est terminé ».

Format recommandé : **Étant donné** [contexte], **quand** [action], **alors** [résultat observable].

Règles :
- **Observable** : on peut le constater (un mail reçu, une valeur dans un fichier, un code de retour), pas « c'est rapide » ou « c'est propre ».
- **Chiffré** dès que possible : « en moins de 2 minutes », « 3 destinataires », « 0 donnée envoyée hors Microsoft 365 ».
- **Une idée par affirmation.**
- **Inclure au moins une affirmation d'échec** : ce qui se passe quand ça va mal.

Exemples :
- ✅ « Étant donné que l'onglet Matchs contient des matchs de la semaine, quand le workflow tourne le vendredi à 14h, alors un mail est envoyé aux 3 destinataires avec un tableau des mises par match. »
- ✅ « Étant donné que l'onglet Matchs ne contient aucun match de la semaine, quand le workflow tourne, alors aucun rapport n'est envoyé et Kudo reçoit une alerte expliquant pourquoi. »
- ❌ « Le rapport est clair et complet. » (non vérifiable)

## Livrable final : la fiche de cadrage

Termine toujours par cette fiche, puis demande : « Je valide et je commence ? »

```markdown
# Cadrage : <nom du projet>

## But
<1 à 2 phrases : le problème et pour qui>

## Livrable
<ce qui existe à la fin>

## Objectifs
1. <objectif SMART>
2. ...

## Affirmations de réussite
- [ ] Étant donné ..., quand ..., alors ...
- [ ] ...

## Affirmations d'échec (gestion des erreurs)
- [ ] Étant donné ..., quand ..., alors ...

## Contraintes
- ...

## Hors périmètre
- ...

## Questions encore ouvertes
- ... (ou « aucune »)
```

Les affirmations de cette fiche deviennent la checklist de fin de travail : à la fin, reprends-les une par une et indique pour chacune si elle est vérifiée, et comment.
