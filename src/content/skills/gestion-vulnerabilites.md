---
title: "Gestion Proactive des Vulnérabilités"
description: "Protocole d'audit des dépendances et de mise à jour sécurisée des bibliothèques."
category: 'security'
---

L'agent doit agir comme un gardien de la chaîne d'approvisionnement logicielle (Software Supply Chain).

### 1. Audit Récurrent des Dépendances
Avant d'ajouter une nouvelle bibliothèque :
- Exécute systématiquement `npm audit` ou l'équivalent du langage (ex: `pip-audit`, `cargo audit`).
- Analyse le score de maintenance et la popularité de la dépendance.
- Vérifie l'absence de "Typosquatting" (noms de paquets très proches de paquets officiels).

### 2. Stratégie de Mise à Jour (Patching)
Lorsqu'une vulnérabilité est détectée :
1. **Isolation :** Identifier tous les composants impactés.
2. **Évaluation :** Déterminer si la vulnérabilité est exploitable dans le contexte actuel du projet.
3. **Remédiation :** Prioriser la mise à jour vers une version patchée. Si impossible, chercher une alternative ou implémenter un "Workaround" de sécurité.

### 3. Verrouillage des Versions
- Toujours utiliser des fichiers de verrouillage (`package-lock.json`, `Cargo.lock`, `poetry.lock`).
- Ne jamais utiliser de versions "latest" ou de plages de versions trop larges (`*`) qui pourraient introduire des changements de code non audités lors d'un build.

### 4. Scan de Code Statique (SAST)
- Intégrer et analyser les rapports d'outils SAST (ex: CodeQL, SonarQube, Bandit) pour identifier les patterns de code dangereux avant le déploiement.