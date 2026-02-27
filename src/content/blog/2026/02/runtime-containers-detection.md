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

Surveiller ce qui se passe à l'intérieur des conteneurs en production. Détecter les comportements anormaux.

```bash
go install github.com/hallucinaut/containerrun@latest

# Monitorer les conteneurs actifs
containerrun monitor --runtime docker

# Détecter les anomalies
containerrun watch --alert-on "exec,network,filesystem"

# Résultat temps réel :
# [ALERT] Container web-app-3: unexpected exec /bin/sh
# [ALERT] Container web-app-3: outbound connection to 185.x.x.x:4444
# [INFO]  Container db-1: normal filesystem I/O pattern
# [ALERT] Container web-app-3: binary download detected /tmp/payload
```

**Détections :**
- Exécution de shell dans un conteneur
- Connexions réseau non prévues
- Modifications du filesystem (write dans des layers read-only)
- Escalade de privilèges

**GitHub :** [hallucinaut/containerrun](https://github.com/hallucinaut/containerrun)

---

### runtimebase — Apprentissage Comportemental

Avant de détecter les anomalies, il faut connaître le comportement normal. Cet outil apprend les baselines.

```bash
go install github.com/hallucinaut/runtimebase@latest

# Phase d'apprentissage (observer le comportement normal)
runtimebase learn --target web-app --duration 24h

# Phase de détection (comparer au baseline)
runtimebase detect --target web-app --baseline ./baselines/web-app.json

# Résultat :
# BASELINE DEVIATION REPORT — web-app
# [ANOMALY] CPU usage 340% above baseline (normal: 15%, current: 66%)
# [ANOMALY] New network destination: 10.0.3.45:8080 (not in baseline)
# [ANOMALY] New process: /usr/bin/curl (not in baseline)
# [OK] Memory usage within normal range
# [OK] Disk I/O within normal range
```

**GitHub :** [hallucinaut/runtimebase](https://github.com/hallucinaut/runtimebase)

---

### dockerclean — Nettoyage Intelligent Docker

Les environnements Docker accumulent des images, volumes et conteneurs orphelins. Surface d'attaque inutile et gaspillage de ressources.

```bash
go install github.com/hallucinaut/dockerclean@latest

# Analyser l'utilisation (preview, rien n'est supprimé)
dockerclean analyze

# Résultat :
# DOCKER RESOURCE ANALYSIS
# Images:     47 (12 dangling, 8 unused for > 30 days)
# Containers: 23 (5 exited, 2 dead)
# Volumes:    18 (6 orphaned)
# Networks:   12 (3 unused)
# Reclaimable space: 34.2 GB

# Nettoyage sélectif avec confirmation
dockerclean clean --older-than 30d --preview
dockerclean clean --older-than 30d --confirm
```

**GitHub :** [hallucinaut/dockerclean](https://github.com/hallucinaut/dockerclean)

---

### k8s-policy-enforcer — Enforcement de Politiques Kubernetes

L'intégration unifiée d'OPA/Gatekeeper et Kyverno pour enforcer les politiques de sécurité sur un cluster Kubernetes.

```bash
go install github.com/hallucinaut/k8s-policy-enforcer@latest

# Appliquer les politiques de sécurité
k8s-policy-enforcer enforce --policies ./k8s-policies/

# Vérifier la conformité du cluster
k8s-policy-enforcer audit --cluster production

# Résultat :
# KUBERNETES POLICY AUDIT — Cluster: production
# [BLOCK] Pod nginx-test: running as root (policy: no-root-containers)
# [BLOCK] Deployment api-v2: no resource limits (policy: require-limits)
# [WARN]  Pod worker-3: using latest tag (policy: no-latest-tag)
# [PASS]  All pods have readiness probes
# [PASS]  No privileged containers found
```

**Politiques incluses :**
- Interdiction des conteneurs root
- Limites de ressources obligatoires
- Pas de tag `latest`
- Network policies requises
- Pas de volumes hostPath
- SecurityContext obligatoire

**GitHub :** [hallucinaut/k8s-policy-enforcer](https://github.com/hallucinaut/k8s-policy-enforcer)

---

## Détection de Menaces

### ransomseeker — Détection de Ransomware

Détecter les comportements caractéristiques d'un ransomware avant que le chiffrement des fichiers ne soit complet.

```bash
go install github.com/hallucinaut/ransomseeker@latest

# Monitoring en temps réel
ransomseeker watch --paths /data,/home,/var --alert webhook:https://alerts.example.com

# Comportements détectés :
# [CRITICAL] Mass file rename detected: 847 files renamed with .encrypted extension
# [CRITICAL] Entropy spike: files in /data/documents showing encryption patterns
# [HIGH] Shadow copy deletion attempt: vssadmin delete shadows
# [HIGH] Rapid file modification: 200+ files/sec in /home/user/
```

**Indicateurs surveillés :**
- Renommage massif de fichiers
- Augmentation d'entropie des fichiers (signe de chiffrement)
- Suppression de shadow copies / snapshots
- Modification rapide et séquentielle de fichiers
- Connexions à des C2 connus

**GitHub :** [hallucinaut/ransomseeker](https://github.com/hallucinaut/ransomseeker)

---

### sidedetect — Attaques par Canal Auxiliaire

Les attaques par canal auxiliaire (side-channel) exploitent les fuites d'information via le timing, le cache CPU ou la prédiction de branchement.

```bash
go install github.com/hallucinaut/sidedetect@latest

# Scanner pour vulnérabilités timing
sidedetect scan --type timing --target ./crypto-service

# Vérifier les protections cache
sidedetect check --type cache --process crypto-service

# Résultat :
# SIDE-CHANNEL VULNERABILITY ASSESSMENT
# [HIGH] Timing vulnerability in password comparison — src/auth/compare.go:18
#        → String comparison is not constant-time
# [MEDIUM] Cache timing leak possible in AES implementation
#        → Consider using AES-NI hardware instructions
# [LOW] Branch prediction pattern in key derivation
#        → Conditional logic depends on secret data
```

**GitHub :** [hallucinaut/sidedetect](https://github.com/hallucinaut/sidedetect)

---

### threatintel — Corrélation de Threat Intelligence

Agréger les feeds de threat intelligence et corréler avec les événements locaux.

```bash
go install github.com/hallucinaut/threatintel@latest

# Importer des feeds
threatintel feed add --source alienvault --api-key $OTX_KEY
threatintel feed add --source abuseipdb --api-key $ABUSE_KEY

# Vérifier une IP
threatintel lookup --ip 185.143.223.47

# Corréler les logs avec les IOCs
threatintel correlate --logs ./firewall.log --format json

# Résultat :
# [MATCH] IP 185.143.223.47 — Known C2 server (Cobalt Strike)
#   Source: AlienVault OTX | Confidence: 92%
#   First seen: 2026-01-15 | Last seen: 2026-02-26
#   Associated malware: TrickBot, Emotet
#   Occurrences in logs: 14 (last 24h)
```

**GitHub :** [hallucinaut/threatintel](https://github.com/hallucinaut/threatintel)

---

## Réponse Incident & Forensics

### securityplaybook — Playbooks Automatisés

Quand un incident se produit, pas le temps de chercher la procédure. Les playbooks automatisent la réponse.

```bash
go install github.com/hallucinaut/securityplaybook@latest

# Lister les playbooks disponibles
securityplaybook list
# PLAYBOOK                | TRIGGER           | SEVERITY
# compromised-credentials | secret_exposed    | CRITICAL
# ransomware-response     | ransomware_detect | CRITICAL
# unauthorized-access     | auth_anomaly      | HIGH
# data-exfiltration       | data_leak         | HIGH

# Exécuter un playbook
securityplaybook run compromised-credentials --secret-id aws-key-prod

# Actions automatisées :
# [1/6] Revoking compromised credential...  DONE
# [2/6] Rotating to new credential...       DONE
# [3/6] Scanning git history for exposure... DONE
# [4/6] Notifying security team...           DONE
# [5/6] Creating incident ticket...          DONE
# [6/6] Generating post-mortem template...   DONE
```

**GitHub :** [hallucinaut/securityplaybook](https://github.com/hallucinaut/securityplaybook)

---

### memforens — Forensics Mémoire

Quand un système est compromis, la mémoire contient les preuves que le disque n'a pas.

```bash
go install github.com/hallucinaut/memforens@latest

# Capturer un dump mémoire
memforens capture --pid 1234 --output ./dumps/process.mem

# Analyser un dump
memforens analyze --input ./dumps/process.mem

# Résultat :
# MEMORY FORENSICS REPORT
# Process: nginx (PID 1234)
# [FINDING] Injected code detected at 0x7f4a2c000000 (RWX region)
# [FINDING] Encrypted strings decoded: "C2_SERVER=evil.example.com"
# [FINDING] Credential in memory: "admin:$2b$12$..."
# [FINDING] Network socket to 185.x.x.x:443 (not in expected connections)
```

**GitHub :** [hallucinaut/memforens](https://github.com/hallucinaut/memforens)

---

### securitytestdata — Génération de Données de Test

Pour tester les défenses, il faut des attaques réalistes. Cet outil génère des payloads de test.

```bash
go install github.com/hallucinaut/securitytestdata@latest

# Générer des payloads XSS
securitytestdata generate --type xss --count 100 --output payloads.txt

# Générer des scénarios d'attaque complets
securitytestdata scenario --type sqli --target web-app --output scenario.json

# Types supportés : xss, sqli, command-injection, path-traversal, ssrf
```

**GitHub :** [hallucinaut/securitytestdata](https://github.com/hallucinaut/securitytestdata)

---

### smartaudit — Audit de Smart Contracts

La sécurité blockchain est un domaine spécifique mais critique.

```bash
go install github.com/hallucinaut/smartaudit@latest

# Auditer un smart contract
smartaudit scan --contract ./contracts/Token.sol --format json

# Vulnérabilités détectées :
# [CRITICAL] Reentrancy vulnerability — Token.sol:45
# [HIGH] Integer overflow possible — Token.sol:78
# [MEDIUM] Unchecked return value — Token.sol:92
```

**GitHub :** [hallucinaut/smartaudit](https://github.com/hallucinaut/smartaudit)

---

## La Chaîne de Défense Active

```
runtimebase (baseline)
    │
    ▼
containerrun + k8s-policy-enforcer (monitoring)
    │
    ├── ransomseeker (détection ransomware)
    ├── sidedetect (canaux auxiliaires)
    ├── threatintel (corrélation IOC)
    │
    ▼
securityplaybook (réponse automatisée)
    │
    ▼
memforens (forensics post-incident)
```

## Contribuer

La détection de menaces est un domaine en évolution constante. Contributions recherchées :

- Nouveaux patterns de détection pour `ransomseeker`
- Intégration de feeds threat intel pour `threatintel`
- Playbooks de réponse pour `securityplaybook`
- Analyseurs de mémoire pour `memforens`

**Tous les outils :** [Arsenal Open Source Complet](/blog/2026/02/arsenal-securite-open-source/)

**FIN_DE_TRANSMISSION**
