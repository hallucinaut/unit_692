---
title: 'Runtime, Containers & Détection de Menaces : 11 Outils de Défense Active'
date: '2026-02-27'
author: 'UNIT_692'
excerpt: 'Monitoring de conteneurs, détection de ransomware, forensics mémoire, attaques par canal auxiliaire. 11 outils Go pour la défense active en production.'
tags: ['security', 'containers', 'kubernetes', 'docker', 'detection', 'forensics', 'golang', 'open-source']
---

La sécurité ne s'arrête pas au déploiement. C'est en production que les attaques se produisent. Le monitoring statique ne suffit plus : il faut détecter les anomalies comportementales, les mouvements latéraux, les comportements ransomware en temps réel.

**Angle choisi : Défense active.** 11 outils pour surveiller, détecter et répondre aux menaces en runtime.

## Containers & Kubernetes

### containerrun — Monitoring Runtime de Conteneurs

Surveiller ce qui se passe à l'intérieur des conteneurs en production. Moteur de règles de sécurité intégré et détection d'anomalies par baseline.

```bash
# Monitorer un conteneur
containerrun monitor mycontainer

# Détecter les anomalies
containerrun detect mycontainer

# Établir une baseline
containerrun baseline

# Vérification rapide
containerrun check
```

**Règles de sécurité pré-configurées :**

| Règle | Sévérité |
|-------|----------|
| Privilege Escalation | CRITICAL |
| Suspicious Exec | HIGH |
| Network Anomaly | MEDIUM |
| Filesystem Modification | MEDIUM |
| Resource Abuse | LOW |

**Détections :** événements de cycle de vie, exécutions de commandes, activité réseau, modifications filesystem, escalade de privilèges. L'anomaly detection analyse les déviations CPU, mémoire et réseau par rapport à la baseline.

**GitHub :** [hallucinaut/containerrun](https://github.com/hallucinaut/containerrun)

---

### runtimebase — Baseline Comportementale

Avant de détecter les anomalies, il faut connaître le comportement normal. `runtimebase` apprend les patterns normaux et utilise l'analyse z-score pour détecter les déviations.

```bash
# Phase d'apprentissage
runtimebase learn myapp

# Phase de détection
runtimebase detect myapp

# Vérification
runtimebase check myapp

# Analyser des logs
runtimebase analyze /var/log/myapp.log
```

**Patterns surveillés :** syscalls, accès fichiers, activité réseau, comportement des processus.

**Sévérité par z-score :**

| Z-Score | Sévérité |
|---------|----------|
| > 5 | CRITICAL |
| > 3 | HIGH |
| > 2 | MEDIUM |

L'approche statistique par z-score permet de détecter les déviations sans règles codées en dur — le système s'adapte au comportement réel de l'application.

**GitHub :** [hallucinaut/runtimebase](https://github.com/hallucinaut/runtimebase)

---

### dockerclean — Nettoyage Docker

Les environnements Docker accumulent des ressources orphelines : conteneurs stoppés, volumes inutilisés, images dangling. Surface d'attaque inutile et gaspillage de ressources.

```bash
# Preview (rien n'est supprimé)
dockerclean --dry-run

# Nettoyage effectif
dockerclean
```

Deux modes : `--dry-run` pour voir ce qui sera nettoyé, sans argument pour exécuter. Simple et prévisible.

**GitHub :** [hallucinaut/dockerclean](https://github.com/hallucinaut/dockerclean)

---

### k8s-policy-enforcer — Enforcement de Politiques Kubernetes

16 politiques de sécurité intégrées pour Kubernetes, avec intégration OPA/Gatekeeper et Kyverno.

```bash
# Auditer des manifests
./k8s-policy-enforcer --dir=./k8s-manifests

# Filtrer par namespace
./k8s-policy-enforcer --dir=./k8s --namespace=production

# Mode strict : échec sur warn et violations
./k8s-policy-enforcer --dir=./k8s --fail-strict=true --fail-warn=true
```

**16 Politiques intégrées :**

| ID | Politique | Catégorie |
|----|-----------|-----------|
| K8S-SEC-001 | No Privileged Containers | Security Context |
| K8S-SEC-002 | Run as Non-Root | Security Context |
| K8S-SEC-003 | Read-Only Root Filesystem | Security Context |
| K8S-SEC-004 | No Allow Privilege Escalation | Security Context |
| K8S-NET-001 | Network Policies Required | Network |
| K8S-NET-002 | Default Deny Ingress | Network |
| K8S-RES-001 | Resource Limits Required | Resource |
| K8S-POD-001 | No Host Network | Pod |
| K8S-IMG-001 | No Latest Tag | Image |
| K8S-SA-001 | No Default Service Account | Service Account |

Et 6 autres politiques couvrant les hostPath, les capabilities Linux, les probes de readiness, etc.

**GitHub :** [hallucinaut/k8s-policy-enforcer](https://github.com/hallucinaut/k8s-policy-enforcer)

---

## Détection de Menaces

### ransomseeker — Détection de Ransomware

Détecter les comportements caractéristiques d'un ransomware avant que le chiffrement des fichiers ne soit complet. Protection et récupération intégrées.

```bash
# Détecter les comportements ransomware
ransomseeker detect

# Activer la protection en temps réel
ransomseeker protect

# Récupérer des fichiers
ransomseeker recover

# Scanner un chemin spécifique
ransomseeker scan /path/to/scan

# Rapport
ransomseeker report
```

**Familles de ransomware reconnues :** WannaCry, Ryuk, LockBit, Conti, Phobos.

**Méthodes de détection :**
- Monitoring des modifications de fichiers en temps réel
- Détection de patterns de chiffrement (augmentation d'entropie)
- Monitoring des processus suspects
- Analyse comportementale

3 moteurs distincts : détection (`detect`), protection active (`protect`), récupération (`recover`).

**GitHub :** [hallucinaut/ransomseeker](https://github.com/hallucinaut/ransomseeker)

---

### sidedetect — Attaques par Canal Auxiliaire

Les attaques side-channel exploitent les fuites d'information via le timing, le cache CPU ou la prédiction de branchement. `sidedetect` analyse le code source pour trouver ces vulnérabilités.

```bash
# Scanner un projet
sidedetect scan ./myproject

# Analyser un fichier spécifique
sidedetect analyze crypto.go

# Vérification rapide
sidedetect check encryption.go
```

**Vulnérabilités détectées :**

| ID | Vulnérabilité | CVSS |
|----|---------------|------|
| TC-001 | Comparaison de password non constant-time | 7.5 |
| TC-002 | Indexation par secret (table lookup) | 7.0 |
| TC-003 | Branchement dépendant d'un secret | 6.5 |
| CA-001 | Table lookup avec index secret (cache timing) | 7.8 |
| BP-001 | Prédiction de branchement | 6.0 |

**Langages supportés :** Go, C/C++, Rust, Java, Python, JavaScript.

**GitHub :** [hallucinaut/sidedetect](https://github.com/hallucinaut/sidedetect)

---

### threatintel — Corrélation de Threat Intelligence

Agréger les indicateurs de compromission (IOCs), vérifier la réputation et corréler les événements de sécurité.

```bash
# Ajouter des indicateurs
threatintel add ip 192.168.1.100
threatintel add domain malicious.com

# Vérifier un indicateur
threatintel check 192.168.1.100

# Vérifier la réputation
threatintel reputation 10.0.0.1

# Corréler les événements
threatintel correlate
```

**Types d'indicateurs :** IP, domaine, URL, hash de fichier, email, fichier, certificat, CIDR.

La commande `correlate` croise tous les indicateurs enregistrés avec les événements de sécurité pour identifier les attaques coordonnées et attribuer les menaces à des acteurs connus.

**GitHub :** [hallucinaut/threatintel](https://github.com/hallucinaut/threatintel)

---

## Réponse Incident & Forensics

### securityplaybook — Playbooks de Réponse à Incident

Quand un incident se produit, pas le temps de chercher la procédure. Les playbooks automatisent la réponse étape par étape.

```bash
# Lister les playbooks disponibles
securityplaybook list

# Exécuter un playbook
securityplaybook run pb-001

# Voir les étapes d'un playbook
securityplaybook steps pb-001

# Rapport post-incident
securityplaybook report
```

**Playbooks pré-configurés :**

| ID | Playbook | Type |
|----|----------|------|
| pb-001 | Malware Response | Containment + Eradication |
| pb-002 | Data Breach Response | Investigation + Notification |
| pb-003 | Ransomware Response | Isolation + Recovery |
| pb-004 | Phishing Response | Analysis + Remediation |

Chaque playbook contient des étapes séquentielles avec actions automatisées. La commande `steps` permet de visualiser le déroulement avant exécution.

**GitHub :** [hallucinaut/securityplaybook](https://github.com/hallucinaut/securityplaybook)

---

### memforens — Forensics Mémoire

Quand un système est compromis, la mémoire contient les preuves que le disque n'a pas. `memforens` extrait les secrets depuis les dumps mémoire en parsant `/proc/self/maps`.

```bash
# Scanner un dump mémoire
memforens scan memory.dump

# Analyser en détail
memforens analyze memory.dump
```

**Types de secrets extraits :**

| Type | Confiance |
|------|-----------|
| AWS Access Keys | 95% |
| GitHub Tokens | 95% |
| Private Keys | 100% |
| JWT Tokens | 85% |
| API Keys | 70% |
| Passwords | 60% |

L'outil parse la structure mémoire (`/proc/self/maps`), extrait les chaînes imprimables et les filtre par patterns connus. Les niveaux de confiance indiquent la probabilité que la détection soit un vrai positif.

**GitHub :** [hallucinaut/memforens](https://github.com/hallucinaut/memforens)

---

### securitytestdata — Génération de Payloads de Test

Pour tester les défenses, il faut des attaques réalistes. `securitytestdata` génère des payloads OWASP Top 10 et gère des scénarios de test complets.

```bash
# Générer des payloads SQL injection
securitytestdata generate sql_injection

# Générer des payloads XSS
securitytestdata generate xss

# Lister les types disponibles
securitytestdata list

# Exécuter les scénarios de test
securitytestdata run

# Rapport de résultats
securitytestdata report

# Détails d'un scénario
securitytestdata info sc-001
```

**Types de payloads :** SQL injection, XSS, command injection, path traversal, SSRF.

**GitHub :** [hallucinaut/securitytestdata](https://github.com/hallucinaut/securitytestdata)

---

### smartaudit — Audit de Smart Contracts

La sécurité blockchain est un domaine spécifique mais critique. `smartaudit` détecte les vulnérabilités classiques des smart contracts.

```bash
# Auditer un smart contract
smartaudit audit contract.sol

# Analyser
smartaudit analyze contract.sol

# Vérification rapide
smartaudit check
```

**Vulnérabilités détectées :**
- **Reentrancy** (CWE-863) — le classique DAO hack
- **Integer overflow** (CWE-190)
- **Unchecked return values** (CWE-252)
- **Access control** (CWE-284)
- **Timestamp dependence**
- **Denial of Service**
- **Delegatecall vulnerabilities**
- **Unprotected mint**
- **Variable shadowing**
- **Gas limit issues**

**Niveaux de risque :** MINIMAL (0-0.2), LOW (0.2-0.4), MEDIUM (0.4-0.6), HIGH (0.6-0.8), CRITICAL (0.8-1.0).

**GitHub :** [hallucinaut/smartaudit](https://github.com/hallucinaut/smartaudit)

---

## La Chaîne de Défense Active

```
runtimebase learn (baseline)
    │
    ▼
containerrun monitor + k8s-policy-enforcer (runtime)
    │
    ├── ransomseeker detect (ransomware)
    ├── sidedetect scan (code analysis)
    ├── threatintel correlate (IOC matching)
    │
    ▼
securityplaybook run (réponse automatisée)
    │
    ▼
memforens scan (forensics post-incident)
```

## Contribuer

La détection de menaces évolue avec les attaques. Contributions recherchées :

- Nouvelles signatures de ransomware pour `ransomseeker`
- Nouveaux patterns side-channel pour `sidedetect`
- Intégration de feeds threat intel pour `threatintel`
- Playbooks de réponse pour `securityplaybook`

**Tous les outils :** [Arsenal Open Source Complet](/blog/2026/02/arsenal-securite-open-source/)

**FIN_DE_TRANSMISSION**
