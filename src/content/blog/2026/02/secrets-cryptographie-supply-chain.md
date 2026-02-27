---
title: 'Secrets, Cryptographie & Supply Chain : 9 Outils pour Verrouiller le Pipeline'
date: '2026-02-27'
author: 'UNIT_692'
excerpt: 'Rotation de secrets, audit cryptographique, monitoring SSL, SBOM, provenance du code. 9 outils Go pour sécuriser chaque maillon de la chaîne logicielle.'
tags: ['security', 'cryptographie', 'supply-chain', 'secrets', 'golang', 'open-source', 'devsecops']
---

Un secret commité dans Git vit éternellement dans l'historique. Un certificat expiré met un service en production à genoux. Une dépendance compromise se propage silencieusement dans toute la supply chain.

**Angle choisi : Défense en profondeur.** 9 outils pour couvrir les trois piliers : secrets, cryptographie et intégrité de la supply chain.

## Secrets — Détecter, Rotater, Gérer

### secretdetector — Scanner Local de Secrets

Le premier rempart. Scanner le code avant qu'il ne quitte la machine.

```bash
# Scanner le répertoire courant
secretdetector .

# Scanner un projet spécifique
secretdetector /path/to/project

# Scanner un sous-dossier
secretdetector src/
```

**Détections par sévérité :**
- **CRITICAL** : AWS Access Keys (`AKIA...`), clés privées RSA/EC
- **WARNING** : API keys, passwords, tokens génériques

**Exclusions automatiques :** `.git`, `node_modules`, `vendor`, `bin`, `*.min.js` — pas de faux positifs sur les dépendances.

L'outil est simple volontairement : un chemin en argument, un rapport en sortie. Pas de configuration, pas de fichier YAML à maintenir.

**GitHub :** [hallucinaut/secretdetector](https://github.com/hallucinaut/secretdetector)

---

### secret-rotator — Rotation Automatisée des Secrets

Détecter ne suffit pas. Il faut rotater régulièrement et automatiquement, sans interruption de service.

```bash
# Découverte automatique et dry-run
./secret-rotator --discover=/path/to/configs --dry-run

# Rotation forcée avec configuration spécifique
./secret-rotator --config=rotation-config.json --force=true

# Découverte + rotation effective
./secret-rotator --discover=/secrets --force=true --dry-run=false
```

**Providers supportés :**
- AWS Secrets Manager
- HashiCorp Vault
- Azure Key Vault
- Google Cloud Secret Manager
- Credentials de bases de données
- API keys
- Certificats SSL/TLS

**Politiques de rotation :** Monthly, Quarterly, Annually, Max Age, On-Demand.

**Déploiement :** stratégies blue-green et rolling pour garantir le zero-downtime. Chaque rotation génère un audit trail complet en JSON.

**GitHub :** [hallucinaut/secret-rotator](https://github.com/hallucinaut/secret-rotator)

---

### keyvault — Gestion du Cycle de Vie des Clés

Au-delà des secrets applicatifs : la gestion complète des clés cryptographiques avec suivi d'état.

```bash
# Générer une clé
keyvault generate --algorithm rsa --key-size 2048
keyvault generate --algorithm ed25519

# Lister les clés
keyvault list

# Rotater une clé
keyvault rotate key-123

# Planifier une rotation automatique
keyvault schedule key-123 --policy policy-90-days

# Vérifier l'état des clés
keyvault check

# Import/Export
keyvault import key.pem
keyvault export key-123

# Rapport complet
keyvault report
```

**Algorithmes supportés :** RSA, ECDSA, AES, ChaCha20, Ed25519.

**États du cycle de vie :**

```
Generated → Active → Deprecated → Revoked → Destroyed
```

**Politiques de rotation :** 90 jours, 180 jours, annuelle.

**GitHub :** [hallucinaut/keyvault](https://github.com/hallucinaut/keyvault)

---

## Cryptographie — Auditer et Anticiper

### cryptoaudit — Scanner de Faiblesses Cryptographiques

Trouver les algorithmes obsolètes, les clés trop courtes, les implémentations vulnérables.

```bash
# Scanner un projet
cryptoaudit scan ./myproject

# Vérifier un fichier de configuration
cryptoaudit check config.yaml
```

**Faiblesses détectées :**
- **Algorithmes cassés** : MD5, SHA-1, DES, 3DES, RC4, MD4
- **Tailles de clé insuffisantes** : RSA < 2048, ECC < 256, AES < 128

**Conformité :** NIST SP 800-131A, PCI-DSS, CIS Benchmarks.

Deux commandes : `scan` pour un projet entier, `check` pour un fichier spécifique.

**GitHub :** [hallucinaut/cryptoaudit](https://github.com/hallucinaut/cryptoaudit)

---

### certwatch — Monitoring SSL/TLS

Un certificat expiré = un incident de production. `certwatch` surveille les certificats avec des niveaux d'alerte clairs.

```bash
# Surveiller un domaine
certwatch example.com

# Surveiller plusieurs domaines
certwatch example.com api.example.com mail.example.com
```

**Niveaux de statut :**

| Statut | Condition |
|--------|-----------|
| **OK** | > 30 jours avant expiration |
| **EXPIRING_SOON** | 7-30 jours |
| **CRITICAL** | < 7 jours |
| **EXPIRED** | Expiré |

Simple : des domaines en arguments, un tableau de statut en sortie. Idéal pour un cron ou un pipeline CI.

**GitHub :** [hallucinaut/certwatch](https://github.com/hallucinaut/certwatch)

---

### quantumsec — Préparation Post-Quantique

Les ordinateurs quantiques ne sont pas encore là. Mais la migration cryptographique prend des années.

```bash
# Évaluer des algorithmes
quantumsec assess "RSA-2048,AES-256,SHA-256"

# Analyser les vulnérabilités quantiques
quantumsec analyze "RSA-2048,ECC-256"

# Vérifier un algorithme spécifique
quantumsec check RSA-4096

# Timeline de la menace quantique
quantumsec timeline
```

**Analyse :**
- **Vulnérable à Shor** : RSA (toutes tailles), ECC — cassés par l'algorithme de Shor
- **Résistant à Grover** : AES-256 (sécurité effective 128 bits), SHA3
- **Quantum-safe** : Kyber, Dilithium — algorithmes post-quantiques NIST

La commande `timeline` donne une projection de la menace quantique et aide à prioriser la migration.

**GitHub :** [hallucinaut/quantumsec](https://github.com/hallucinaut/quantumsec)

---

## Supply Chain — Traçabilité et Intégrité

### supply-chain-shield — Sécurité de la Supply Chain Logicielle

L'outil le plus complet de l'arsenal pour la supply chain. Découverte automatique d'artefacts, vérification de signatures, génération de SBOM.

```bash
# Découverte et analyse d'artefacts
./supply-chain-shield --discover=./artifacts

# Avec échec sur vulnérabilités hautes
./supply-chain-shield --discover=./artifacts --fail-high=true

# Avec échec sur vulnérabilités critiques uniquement
./supply-chain-shield --discover=./dist --fail-critical=true

# Mode verbose avec dry-run
./supply-chain-shield --discover=./dist --verbose --dry-run
```

**Types d'artefacts :** containers, packages, binaires, fichiers de configuration, certificats.

**Capacités :**
- Vérification de signatures RSA/ECDSA
- Hashing SHA-256/SHA-512
- Provenance in-toto/SLSA
- SBOM SPDX/CycloneDX

**GitHub :** [hallucinaut/supply-chain-shield](https://github.com/hallucinaut/supply-chain-shield)

---

### codeprovenance — Traçabilité du Code Source

D'où vient ce code ? Le build est-il intègre ? Quelqu'un a-t-il modifié l'artefact après le build ?

```bash
# Enregistrer un artefact
codeprovenance track myapp

# Vérifier l'intégrité d'un build
codeprovenance verify build-001

# Afficher la chaîne de provenance
codeprovenance chain build-001

# Vérifier un fichier d'information de build
codeprovenance check build-info.json
```

Chaque artefact est enregistré avec un hash SHA-256. La chaîne de provenance permet de retracer chaque étape du build et de détecter les modifications non autorisées. Un score d'intégrité est calculé pour chaque artefact.

**GitHub :** [hallucinaut/codeprovenance](https://github.com/hallucinaut/codeprovenance)

---

### sbomgen — Génération de SBOM

Le SBOM (Software Bill of Materials) est devenu une exigence réglementaire. `sbomgen` le génère pour tous les écosystèmes.

```bash
# Générer un SBOM (format table par défaut)
sbomgen gen ./myproject

# Format JSON
sbomgen gen -o sbom.json -f json ./myproject

# Format Markdown
sbomgen gen --format markdown --dir ./myapp -o sbom.md

# Formats standards
sbomgen gen -f cyclonedx ./myproject
sbomgen gen -f spdx ./myproject

# Analyser les dépendances
sbomgen analyze ./myproject
```

**Formats de sortie :** SPDX, CycloneDX, JSON, YAML, Markdown, Table.

**Écosystèmes détectés :** npm (package.json), PyPI (requirements.txt), Go (go.mod), Cargo (Cargo.toml), Maven (pom.xml).

Chaque dépendance inclut son Package URL (pURL) pour une identification universelle.

**GitHub :** [hallucinaut/sbomgen](https://github.com/hallucinaut/sbomgen)

---

## Le Pipeline Sécurisé

Ces 9 outils s'assemblent dans un pipeline cohérent :

```
Code → secretdetector (pre-commit)
  → cryptoaudit scan (CI)
  → sbomgen gen (build)
  → codeprovenance track (attestation)
  → supply-chain-shield --discover (vérification)
  → certwatch (monitoring production)
  → secret-rotator --discover (rotation opérationnelle)
  → keyvault check (gestion des clés)
  → quantumsec assess (stratégie long terme)
```

## Contribuer

Chaque outil est un MVP open source. Les contributions les plus utiles :

- Nouveaux patterns de secrets pour `secretdetector`
- Support de providers cloud pour `secret-rotator`
- Algorithmes post-quantiques pour `quantumsec`
- Formats SBOM additionnels pour `sbomgen`

**Tous les outils :** [Arsenal Open Source Complet](/blog/2026/02/arsenal-securite-open-source/)

**FIN_DE_TRANSMISSION**
