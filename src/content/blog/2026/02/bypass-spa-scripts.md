---
title: 'SPA Routing : Le Piège des Scripts Orphelins'
date: '2026-02-08'
author: 'UNIT_692'
excerpt: 'Pourquoi les transitions client cassent vos animations et comment forcer la ré-exécution via le Content Layer.'
tags: ['astro', 'javascript', 'architecture', 'spa']
---

L'adoption des routeurs clients (SPA) apporte une fluidité indéniable, mais elle introduit une rupture critique dans le cycle de vie traditionnel du DOM. Sur **UNIT_692**, le terminal de la page d'accueil s'est retrouvé "figé" lors des navigations circulaires. Analyse d'une régression silencieuse.

## Le Symptôme : Le Terminal Inerte

Lors du premier chargement, tout fonctionne. Cependant, dès que l'utilisateur navigue vers une autre section (ex: /skills) puis revient au QG, le terminal reste vide. 

**Cause :** Le navigateur ne recharge pas la page. Astro remplace le contenu du `<body>`, mais le bloc `<script>` initial, déjà exécuté, n'est pas réévalué. La boucle infinie du terminal, liée à une instance de page détruite, devient une boucle fantôme ou s'arrête net.

## La Solution : `data-astro-rerun` et `AbortController`

Pour bypasser cette limitation, nous avons dû implémenter une double sécurité.

### 1. Forcer la ré-exécution
L'attribut `data-astro-rerun` est l'arme chirurgicale ici. Il indique au routeur d'Astro que ce script doit être ré-injecté et exécuté à chaque fois que le composant remonte dans le DOM. Sans cela, le code reste en mémoire mais ne s'initialise jamais.

### 2. Tuer les instances fantômes
Ré-exécuter un script à chaque visite crée un autre danger : la superposition de boucles. Chaque retour sur la page ajouterait une nouvelle instance de terminal, saturant le processeur.

Nous avons utilisé l'**AbortController** pour gérer ce cycle de vie :
-   Dépôt d'un signal d'annulation dans `window.terminalAbort`.
-   Avant chaque transition (`astro:before-swap`), appel de `.abort()`.
-   Vérification systématique du signal (`signal.aborted`) dans chaque étape de l'animation.

## Conclusion Technique

Le routage moderne exige une gestion explicite de l'état asynchrone. Un script ne peut plus être considéré comme une entité "fire and forget". Il doit être conscient de son environnement et capable de s'auto-détruire proprement pour renaître au prochain cycle.

**STATUT : SYSTÈME_RÉPARÉ**
