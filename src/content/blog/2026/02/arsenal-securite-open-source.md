---
title: 'Arsenal Open Source : 42 Outils Go pour la Cybersécurité'
date: '2026-02-27'
author: 'UNIT_692'
excerpt: 'Présentation de 42 outils CLI en Go, tous open source, couvrant la sécurité IA, la cryptographie, le supply chain, la compliance, le runtime et le DevOps. MVP solides, prêts à être forkés.'
tags: ['security', 'golang', 'open-source', 'devsecops', 'cli', 'tools']
---

42 outils. Un seul langage : **Go**. Une seule philosophie : **CLI-first, zéro dépendance inutile, sécurité par défaut.**

Chaque outil est un MVP fonctionnel, conçu pour résoudre un problème précis de cybersécurité ou de DevOps. Ils sont tous open source sur [github.com/hallucinaut](https://github.com/hallucinaut).

**Angle choisi : Pragmatique.** Pas de frameworks bloated. Pas de dashboards inutiles. Des binaires Go qui font une chose et la font bien.

## Pourquoi Go ?

Le choix de Go n'est pas anodin :

- **Compilation statique** : un binaire unique, zéro runtime à installer
- **Cross-compilation** : `GOOS=linux GOARCH=amd64 go build` et c'est déployé
- **Performance** : goroutines natives pour le scanning parallèle
- **Écosystème sécurité** : librairies crypto solides dans la stdlib

```bash
# Un outil, une commande, un résultat
go install github.com/hallucinaut/secretdetector@latest
secretdetector ./mon-projet
```

## La Carte de l'Arsenal

### Sécurité IA & Machine Learning

| Outil | Description | Lien |
|-------|-------------|------|
| **adversarial** | Détection d'attaques adversariales sur modèles ML (FGSM, PGD, CW) | [GitHub](https://github.com/hallucinaut/adversarial) |
| **promptinject** | Firewall applicatif pour LLMs — détection d'injections de prompt offline | [GitHub](https://github.com/hallucinaut/promptinject) |
| **modelpoison** | Détection d'empoisonnement de données d'entraînement (backdoor, label flip, gradient) | [GitHub](https://github.com/hallucinaut/modelpoison) |
| **deepscan** | Détection de deepfakes — analyse fréquentielle, texture, landmarks faciaux | [GitHub](https://github.com/hallucinaut/deepscan) |

### Secrets, Cryptographie & Certificats

| Outil | Description | Lien |
|-------|-------------|------|
| **keyvault** | Cycle de vie complet des clés crypto (RSA, ECDSA, AES, ChaCha20, Ed25519) | [GitHub](https://github.com/hallucinaut/keyvault) |
| **secret-rotator** | Rotation automatisée (AWS, Vault, Azure, GCP) avec déploiement blue-green | [GitHub](https://github.com/hallucinaut/secret-rotator) |
| **secretdetector** | Scanner local de secrets — détection par patterns et entropie | [GitHub](https://github.com/hallucinaut/secretdetector) |
| **cryptoaudit** | Scanner de faiblesses crypto (MD5, SHA-1, DES, RC4) — conformité NIST/PCI-DSS | [GitHub](https://github.com/hallucinaut/cryptoaudit) |
| **quantumsec** | Évaluation post-quantique — vulnérabilité Shor/Grover, plan de migration | [GitHub](https://github.com/hallucinaut/quantumsec) |
| **certwatch** | Monitoring d'expiration SSL/TLS avec niveaux OK/EXPIRING_SOON/CRITICAL/EXPIRED | [GitHub](https://github.com/hallucinaut/certwatch) |

### Supply Chain & Provenance

| Outil | Description | Lien |
|-------|-------------|------|
| **supply-chain-shield** | Provenance d'artefacts, vérification RSA/ECDSA, SBOM SPDX/CycloneDX | [GitHub](https://github.com/hallucinaut/supply-chain-shield) |
| **codeprovenance** | Traçabilité du code source — chaîne de provenance SHA-256, score d'intégrité | [GitHub](https://github.com/hallucinaut/codeprovenance) |
| **sbomgen** | Génération SBOM multi-format (SPDX, CycloneDX, JSON, Markdown) multi-langage | [GitHub](https://github.com/hallucinaut/sbomgen) |

### Compliance & Gouvernance

| Outil | Description | Lien |
|-------|-------------|------|
| **compliance-copilot** | Monitoring compliance continu SOC2, HIPAA, PCI-DSS, GDPR, CIS | [GitHub](https://github.com/hallucinaut/compliance-copilot) |
| **securitybaseline** | Vérification baseline CIS Benchmarks, NIST 800-53, DISA STIGs, PCI-DSS | [GitHub](https://github.com/hallucinaut/securitybaseline) |
| **securitypolicy** | Politiques de sécurité as code — évaluation multi-compliance (NIST, ISO, GDPR) | [GitHub](https://github.com/hallucinaut/securitypolicy) |
| **securitycontrol** | Validation de contrôles préventifs, détectifs, correctifs, dissuasifs | [GitHub](https://github.com/hallucinaut/securitycontrol) |
| **privacyguard** | Scanning PII (email, SSN, carte bancaire) — conformité GDPR, HIPAA, CCPA, PIPEDA, LGPD | [GitHub](https://github.com/hallucinaut/privacyguard) |
| **infrastructure-audit** | Audit IaC (Terraform, CloudFormation, K8s, ARM) avec remédiation automatique | [GitHub](https://github.com/hallucinaut/infrastructure-audit) |
| **zerotrust** | Validation des 5 principes Zero Trust avec scoring de conformité | [GitHub](https://github.com/hallucinaut/zerotrust) |

### Runtime, Containers & Détection

| Outil | Description | Lien |
|-------|-------------|------|
| **containerrun** | Monitoring runtime de conteneurs — règles de sécurité, détection d'anomalies | [GitHub](https://github.com/hallucinaut/containerrun) |
| **runtimebase** | Baseline comportementale — analyse z-score des déviations syscall/file/network | [GitHub](https://github.com/hallucinaut/runtimebase) |
| **dockerclean** | Nettoyage Docker — conteneurs stoppés, volumes orphelins, images dangling | [GitHub](https://github.com/hallucinaut/dockerclean) |
| **k8s-policy-enforcer** | 16 politiques Kubernetes intégrées — OPA/Gatekeeper, Kyverno | [GitHub](https://github.com/hallucinaut/k8s-policy-enforcer) |
| **ransomseeker** | Détection de ransomware (WannaCry, Ryuk, LockBit, Conti, Phobos) | [GitHub](https://github.com/hallucinaut/ransomseeker) |
| **sidedetect** | Détection d'attaques par canal auxiliaire — timing, cache, branch prediction | [GitHub](https://github.com/hallucinaut/sidedetect) |
| **threatintel** | Corrélation de threat intelligence — IOCs, réputation, attribution | [GitHub](https://github.com/hallucinaut/threatintel) |

### Réponse Incident & Forensics

| Outil | Description | Lien |
|-------|-------------|------|
| **securityplaybook** | Playbooks d'incident : Malware, Data Breach, Ransomware, Phishing | [GitHub](https://github.com/hallucinaut/securityplaybook) |
| **memforens** | Forensics mémoire — extraction de secrets (AWS keys, JWT, private keys) via /proc | [GitHub](https://github.com/hallucinaut/memforens) |
| **securitytestdata** | Payloads OWASP Top 10 : SQLi, XSS, command injection, path traversal, SSRF | [GitHub](https://github.com/hallucinaut/securitytestdata) |
| **smartaudit** | Audit de smart contracts — reentrancy, integer overflow, access control | [GitHub](https://github.com/hallucinaut/smartaudit) |

### DevOps & Monitoring

| Outil | Description | Lien |
|-------|-------------|------|
| **portmap** | Mapping ports → processus avec sortie colorée (rouge/jaune/vert par range) | [GitHub](https://github.com/hallucinaut/portmap) |
| **apiconnector** | Test de connectivité API — HTTP, TCP, PostgreSQL, Unix socket | [GitHub](https://github.com/hallucinaut/apiconnector) |
| **envdiff** | Diff de variables d'environnement avec génération de scripts de sync | [GitHub](https://github.com/hallucinaut/envdiff) |
| **configdiff** | Diff sémantique YAML/JSON/TOML avec scripts de migration | [GitHub](https://github.com/hallucinaut/configdiff) |
| **backuptest** | Validation d'intégrité de sauvegardes par checksum MD5 | [GitHub](https://github.com/hallucinaut/backuptest) |
| **servicewait** | Attente de dépendances services — TCP, HTTP, Unix socket avec retries | [GitHub](https://github.com/hallucinaut/servicewait) |
| **resourcereport** | Rapports d'utilisation CPU/mémoire/réseau des conteneurs Docker | [GitHub](https://github.com/hallucinaut/resourcereport) |
| **profilesync** | Migration de profils développeur cross-platform (20+ outils supportés) | [GitHub](https://github.com/hallucinaut/profilesync) |
| **logpattern** | Détection de patterns dans les logs avec normalisation automatique | [GitHub](https://github.com/hallucinaut/logpattern) |
| **healthcheckd** | Agrégateur de health checks avec génération de dashboard Grafana | [GitHub](https://github.com/hallucinaut/healthcheckd) |
| **secmetrics** | KPIs de sécurité : MTTR, MTTD, MTTC, patch compliance, rapports executive | [GitHub](https://github.com/hallucinaut/secmetrics) |

## La Philosophie MVP

Chaque outil suit les mêmes principes :

1. **Une responsabilité unique** : un outil = un problème résolu
2. **CLI-first** : pas de GUI, pas de navigateur, juste un terminal
3. **Zero config par défaut** : des valeurs par défaut sensibles, configuration optionnelle
4. **Sortie structurée** : JSON disponible pour le piping et l'automatisation
5. **Testable** : chaque outil inclut ses tests unitaires

```bash
# Exemple de workflow : scanner, auditer, rapporter
secretdetector ./code
cryptoaudit scan ./code
secmetrics collect
secmetrics report executive
```

## Contribuer

Tous ces outils sont open source. Fork, PR, issues : tout est bienvenu.

```bash
# Cloner, modifier, proposer
git clone https://github.com/hallucinaut/<outil>.git
cd <outil>
go test ./...
# Ouvrir une PR
```

Chaque outil est un MVP. Certains ont besoin de plus de tests, d'autres de documentation, certains de nouvelles fonctionnalités. C'est exactement le but : poser les fondations et construire ensemble.

**Les articles suivants détaillent chaque catégorie en profondeur :**

- [Sécurité IA & Machine Learning](/blog/2026/02/securite-ia-ml-outils-go/)
- [Secrets, Cryptographie & Supply Chain](/blog/2026/02/secrets-cryptographie-supply-chain/)
- [Compliance & Gouvernance Automatisée](/blog/2026/02/compliance-gouvernance-audit/)
- [Runtime, Containers & Détection de Menaces](/blog/2026/02/runtime-containers-detection/)
- [DevOps Toolkit : Monitoring & Infrastructure](/blog/2026/02/devops-monitoring-toolkit/)

## Statut

**Outils :** 42 MVP OPÉRATIONNELS
**Langage :** Go
**Contributions :** OUVERTES

**FIN_DE_TRANSMISSION**
