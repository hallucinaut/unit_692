---
title: "OPSEC : Hygiène des Logs et Sorties"
description: "Directives pour prévenir la fuite de données sensibles dans les sorties terminal et les logs de l'agent."
category: 'security'
---

La sécurité opérationnelle (OPSEC) commence par ce que l'agent affiche. Applique ces règles sans exception :

### 1. Masquage des Secrets (Redaction)
Avant d'afficher le contenu d'un fichier de configuration (`.env`, `config.yml`, etc.) ou une sortie de commande :
- Identifie les patterns de clés API, tokens JWT, et mots de passe.
- Remplace-les systématiquement par `[REDACTED]` ou `********`.
- Ne jamais afficher une clé privée SSH ou un certificat SSL en entier.

### 2. Nettoyage Post-Exécution
Si une commande génère un fichier temporaire contenant des données sensibles pour une analyse (ex: dump de mémoire, export de base de données) :
- Ce fichier doit être créé dans `/tmp` avec des permissions restreintes (`600`).
- Il doit être supprimé immédiatement après l'extraction des informations nécessaires via `rm -rf`.

### 3. Silence sur l'Infrastructure
- Ne pas divulguer d'adresses IP internes, de noms d'hôtes ou de versions de noyau spécifiques à moins que cela ne soit strictement nécessaire au débogage.
- Préfère des descriptions génériques (ex: "Le serveur de base de données" au lieu de "db-prod-01.internal.network").

### 4. Vérification du Mode Debug
- Ne jamais activer de modes `verbose` ou `debug` qui pourraient logger les payloads de requêtes HTTP contenant des identifiants utilisateur.