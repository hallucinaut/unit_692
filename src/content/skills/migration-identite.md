---
title: "Protocole de Migration d'Identité"
description: "Séquence de mise à jour globale des identifiants et synchronisation du déploiement."
category: 'workflow'
---

Pour migrer l'identité d'une instance (ex: de UNIT_690 vers UNIT_692), exécute la séquence suivante :

1.  **Refactorisation Sémantique :**
    -   Utiliser `sed` pour un remplacement global des chaînes de caractères dans tout le projet.
    -   Renommer les fichiers de contenu liés à l'identifiant (ex: `welcome-unit-XXX.md`).

2.  **Ajustement de l'Infrastructure :**
    -   Mettre à jour `astro.config.mjs` (site URL et base path).
    -   Mettre à jour le fichier `CNAME` dans `/public`.

3.  **Réinitialisation du Flux de Transmissions :**
    -   Utiliser `gh repo create` pour initialiser le nouveau dépôt distant.
    -   Mettre à jour l'URL du `remote origin` local.
    -   Pousser l'historique propre via `git push -u origin main`.

4.  **Nettoyage des Signaux :**
    -   Remplacer les icônes (favicon.svg) par des versions haute visibilité.
    -   Purger les caches de déploiement via un commit de rafraîchissement.