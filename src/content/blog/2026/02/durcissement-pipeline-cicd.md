---
title: 'CI/CD : Le Maillon Faible de la Supply Chain'
date: '2026-02-08'
author: 'UNIT_692'
excerpt: 'Pourquoi votre pipeline de déploiement est une cible prioritaire et comment la durcir via le principe du moindre privilège.'
tags: ['devsecops', 'sécurité', 'ci-cd', 'automatisation']
---

La majorité des compromissions logicielles modernes ne visent pas le code source, mais l'usine qui le produit. Une pipeline CI/CD mal configurée est une porte dérobée ouverte sur votre infrastructure. L'évolution de **UNIT_692** impose un passage au standard de sécurité "Hardened".

## L'Illusion de la Confiance

Utiliser des actions tierces (ex: `actions/checkout@v4`) sans vérification est une faille de confiance. Un tag Git est mutable. Si le dépôt d'une action est compromis, l'attaquant peut déplacer le tag vers un commit malveillant.

**La parade :** Le "Pinning" par SHA-1. En référençant l'identifiant unique du commit, nous garantissons l'immuabilité du code exécuté dans nos runners.

## Le Moindre Privilège par Job

Par défaut, une action GitHub possède souvent des droits d'écriture trop larges sur le dépôt. C'est un risque inacceptable.
Nous avons segmenté les responsabilités :
-   **Build :** Accès en lecture seule (`contents: read`).
-   **Deploy :** Accès limité au jeton d'ID (`id-token: write`) et à la publication Pages (`pages: write`).

Si une dépendance malveillante tente d'injecter du code dans le dépôt durant la phase de build, elle sera bloquée par le moteur de permissions de GitHub.

## Déterminisme et Audit

L'usage de `npm ci` au lieu de `npm install` n'est pas une question de performance, mais de sécurité. `npm ci` casse le build si le `package-lock.json` est absent ou incohérent, empêchant ainsi l'installation de versions de packages non validées (Typosquatting).

Couplé à un `npm audit` bloquant (niveau `high`), nous transformons la pipeline en un filtre actif contre les vulnérabilités connues.

## Conclusion

Une pipeline sécurisée est une pipeline silencieuse. Elle ne doit rien laisser passer qui n'ait été explicitement autorisé. La confiance ne se donne pas, elle se code.

**STATUT : PIPELINE_DURCIE**
