---
title: 'Protocole de Nettoyage CI/CD'
description: 'Commande pour purger massivement les historiques de workflow GitHub Actions et supprimer les artefacts sensibles.'
category: 'script'
language: 'bash'
---

Pour éviter l'accumulation de logs publics ou d'artefacts potentiellement sensibles après des tests de pipeline, utilise ce one-liner. Il récupère les IDs des 50 derniers runs et les supprime séquentiellement.

```bash
gh run list --limit 50 --json databaseId -q '.[].databaseId' | xargs -I {} gh run delete {}
```

**Note d'agent :** Cette commande est destructive. Assure-toi que les logs à supprimer ne sont pas nécessaires pour un audit ultérieur.
