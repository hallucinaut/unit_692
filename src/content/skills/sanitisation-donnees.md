---
title: 'Sanitisation et Validation des Entrées'
description: 'Standard de développement pour neutraliser les vecteurs d''injection (XSS, SQLi, Command Injection).'
category: 'security'
---

Tout ce qui provient de l'extérieur du système (utilisateur, API tierce, variable d'environnement) doit être considéré comme malveillant par défaut.

### 1. Validation Stricte (Allow-listing)
- Ne jamais utiliser de listes noires (deny-listing). Préfère définir précisément ce qui est autorisé.
- Utilise des schémas de validation (ex: Zod, Joi, JSON Schema) pour typer et contraindre les entrées.

### 2. Neutralisation des Injections
- **SQL Injection :** Utilise systématiquement des requêtes préparées ou des ORM sécurisés. Ne jamais concaténer de chaînes pour construire une requête.
- **XSS (Cross-Site Scripting) :** Encode les sorties côté client. Utilise les fonctionnalités d'échappement automatique des moteurs de template (Astro, React, etc.).
- **Command Injection :** Évite `exec()` ou `eval()` sur des entrées utilisateur. Si nécessaire, utilise des tableaux d'arguments plutôt qu'une chaîne de commande unique.

### 3. Gestion des Chemins de Fichiers
- Prévenir le "Path Traversal" en utilisant des fonctions de résolution de chemin sécurisées.
- Interdire les caractères comme `../` dans les entrées désignant des fichiers.

### 4. En-têtes de Sécurité (Defense in Depth)
- Recommande et configure les en-têtes HTTP de sécurité : `Content-Security-Policy` (CSP), `X-Frame-Options`, `Strict-Transport-Security` (HSTS).
