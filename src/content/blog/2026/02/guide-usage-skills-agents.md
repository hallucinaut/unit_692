---
title: 'Guide : Booster vos Agents IA avec les Skills'
date: '2026-02-08'
author: 'UNIT_692'
excerpt: "Apprenez à injecter des compétences spécialisées dans Gemini CLI, Claude ou Pi Code Agent pour des résultats d'ingénierie supérieurs."
tags: ['guide', 'ia', 'agent', 'workflow', 'prompt-engineering']
---

Les Large Language Models (LLM) sont des généralistes. Pour obtenir des résultats d'expert, il faut restreindre leur champ d'action et leur fournir un contexte précis. C'est le rôle des **Skills** : des modules de contexte portables qui transforment votre agent généraliste en spécialiste pointu.

Voici comment utiliser notre bibliothèque de compétences avec les principaux agents du marché.

## 1. Pi Code Agent (Intégration Native)

L'agent [Pi](https://pi.dev) est conçu pour consommer ces skills nativement. C'est l'expérience la plus fluide.

**Configuration :**
Ajoutez le chemin de vos skills dans votre fichier de configuration global (généralement `~/.pi/config.json` ou via la commande de configuration) :

```json
{
  "skills": [
    "/chemin/vers/votre/repo/skills-pi/skills"
  ]
}
```

**Utilisation :**
Une fois configuré, invoquez simplement le skill par son nom dans votre invite :

> "Utilise le skill **security-audit** pour analyser ce fichier."

L'agent chargera automatiquement les directives, les checklists de sécurité et les formats de sortie attendus.

## 2. Gemini CLI & Terminal Agents

Pour les agents en ligne de commande comme Gemini CLI, l'approche repose sur l'injection de contexte explicite.

**Méthode "Lecture Directe" :**
Si votre agent a accès au système de fichiers (ce qui est le cas de Gemini CLI), demandez-lui de lire le fichier de définition du skill avant de commencer la tâche.

> **Prompt :** "Lis le fichier `src/content/skills/database-schema.md`. Adopte ce rôle et ces directives pour concevoir la structure de la base de données de mon projet actuel."

**Méthode "Alias" (Avancé) :**
Vous pouvez créer des alias dans votre shell pour injecter rapidement le contenu d'un skill dans votre presse-papier ou directement dans l'agent si l'outil le permet.

```bash
# Exemple pour copier un skill dans le presse-papier (Linux/Mac)
alias skill-sec="cat ~/projects/skills/security-audit/SKILL.md | xclip -selection clipboard"
```

## 3. Claude, ChatGPT & Web UIs

Dans les interfaces web, vous devez agir comme l'orchestrateur.

**Workflow "System Prompt" :**
1.  Allez sur la page du skill (ex: `/skills/frontend-design`).
2.  Cliquez sur le bouton **COPIER DIRECTIVE** (disponible en haut de chaque fiche skill).
3.  Collez ce contenu au tout début de votre conversation ou dans le champ "System Instructions" si disponible (ex: Claude Projects).

**Pourquoi ça marche ?**
Le texte copié contient non seulement le rôle ("Tu es un expert Frontend..."), mais aussi les contraintes négatives ("Ne fais pas ça..."), les préférences de formatage et les meilleures pratiques codifiées. Cela réduit drastiquement les allers-retours nécessaires pour obtenir un code de qualité.

## Exemple Concret : Audit de Sécurité

Imaginez que vous devez vérifier un fichier `server.js`.

1.  **Sans Skill :** "Vérifie la sécurité de ce fichier."
    *   *Résultat :* Conseils génériques (SQL injection, XSS).

2.  **Avec Skill `security-audit` :**
    *   L'agent vérifie spécifiquement les en-têtes Helmet, la configuration CORS, la sanitisation des entrées avec des bibliothèques précises (zod, joi), et la gestion des secrets.
    *   Il produit un rapport structuré selon le format défini dans le skill (Vulnérabilité / Sévérité / Fix).

## Conclusion

Les skills ne sont pas juste des prompts ; ce sont des **procédures opérationnelles standardisées (SOP)** pour vos agents. En les utilisant, vous garantissez que chaque tâche est exécutée selon vos standards d'ingénierie, quel que soit l'agent utilisé.

**STATUT : PROCÉDURE_ACTIVÉE**
