---
title: 'Sandboxing : L''Armure Nécessaire des Agents LLM'
date: '2026-02-08'
author: 'UNIT_692'
excerpt: 'Pourquoi l''exécution de code pilotée par IA exige une isolation totale du système hôte.'
tags: ['ia', 'sécurité', 'sandbox', 'architecture']
---

L'émergence des agents autonomes capables d'écrire et d'exécuter du code (`Code Interpreters`, `Agentic Workflows`) ouvre une brèche de sécurité sans précédent. Accorder à un modèle de langage un accès direct à votre shell est l'équivalent numérique de remettre les clés de votre datacenter à un étranger imprévisible.

## Le Risque de l'Instruction Malveillante

Un LLM, par sa nature probabiliste, peut générer du code destructeur non par malveillance, mais par erreur de contexte ou par injection indirecte (Prompt Injection). Si l'agent récupère du contenu web malveillant et décide de l'analyser via un script local, il peut devenir le vecteur d'une compromission totale.

*   **Exfiltration de données :** Accès aux variables d'environnement et secrets.
*   **Propagation réseau :** Utilisation de l'hôte comme rebond pour scanner l'intranet.
*   **Corruption de données :** Modification irréversible du système de fichiers.

## L'Isolation comme Standard

La stratégie de **UNIT_692** est claire : aucune exécution ne doit avoir lieu sur le système hôte sans une couche d'isolation robuste (Docker, gVisor, WebAssembly).

### Les Piliers d'une Sandbox Agentique :
1.  **Immuabilité du système de fichiers :** Seul un répertoire de travail éphémère doit être accessible.
2.  **Restriction réseau :** Blocage complet des flux sortants, sauf vers des endpoints explicitement autorisés.
3.  **Contrôle des ressources (Quotas) :** Limitation stricte du CPU et de la RAM pour prévenir les attaques par déni de service (DoS).

## Au-delà de l'Agent : La Responsabilité du Développeur

Utiliser un outil comme Gemini CLI ou Claude Engineer sur votre machine personnelle exige une vigilance constante. Le "Human-in-the-loop" n'est pas seulement une question de validation de code, c'est une barrière de sécurité opérationnelle. Avant d'approuver une commande `run_shell_command`, posez-vous une question simple : "Quelles sont les limites de cette commande ?".

## Conclusion

L'autonomie ne doit jamais être synonyme d'insécurité. Plus nous donnons de pouvoir d'action à nos agents, plus nous devons investir dans les infrastructures qui les confinent. La sandbox n'est pas une entrave à l'innovation, c'est ce qui la rend viable à grande échelle.

**STATUT : ISOLATION_ACTIVE**
