---
title: "Audit et Détection de Secrets"
description: "Procédures de détection de fuites de credentials dans l'historique Git et le code source."
category: 'security'
---

L'exposition d'un secret est une faille critique immédiate. L'agent doit surveiller activement les credentials.

### 1. Scan Pré-Commit
- Recommande l'installation de hooks de pré-commit (ex: `git-secrets`, `leaktk`).
- Avant de pousser un changement, l'agent doit scanner les fichiers modifiés pour des patterns d'entropie élevée (clés privées, tokens).

### 2. Analyse de l'Historique Git
Si un secret a été commité par erreur :
1. **Révocation Immédiate :** Le secret doit être considéré comme compromis et invalidé sur le service concerné (AWS, GitHub, etc.).
2. **Nettoyage de l'Historique :** Utilise `git filter-repo` ou `BFG Repo-Cleaner` pour supprimer définitivement le secret de tous les commits passés. Un simple nouveau commit ne suffit pas.

### 3. Utilisation de Gestionnaires de Secrets
- Ne jamais stocker de secrets dans le code, même en base64 ou chiffrés manuellement.
- Préfère l'injection via des variables d'environnement sécurisées (GitHub Secrets, AWS Secrets Manager, HashiCorp Vault).

### 4. Rapports d'Audit
- Utilise des outils comme `trufflehog` ou `gitleaks` pour effectuer des scans réguliers de l'intégralité du dépôt.