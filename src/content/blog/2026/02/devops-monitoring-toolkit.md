---
title: 'DevOps Toolkit : 11 Outils CLI pour le Monitoring et l''Infrastructure'
date: '2026-02-27'
author: 'UNIT_692'
excerpt: 'Mapping de ports, health checks, diff de configs, validation de backups, métriques de sécurité. 11 outils Go pour le quotidien DevOps.'
tags: ['devops', 'monitoring', 'infrastructure', 'golang', 'open-source', 'cli', 'tools']
---

Le DevOps au quotidien, c'est du diagnostic, de la comparaison, du monitoring et de la validation. Des tâches répétitives qui méritent des outils dédiés plutôt que des one-liners bash fragiles.

**Angle choisi : Productivité.** 11 outils CLI qui remplacent les scripts bricolés par des binaires fiables et testés.

## Diagnostic & Réseau

### portmap — Mapping Interactif des Ports

Qui écoute sur quel port ? Quel processus utilise le port 8080 ?

```bash
go install github.com/hallucinaut/portmap@latest

# Mapper tous les ports en écoute
portmap

# Résultat coloré :
# PORT   │ PROTO │ PID   │ PROCESS        │ COMMAND
# 22     │ TCP   │ 1234  │ sshd           │ /usr/sbin/sshd -D
# 80     │ TCP   │ 5678  │ nginx          │ nginx: master process
# 443    │ TCP   │ 5678  │ nginx          │ nginx: master process
# 3000   │ TCP   │ 9012  │ node           │ node server.js
# 5432   │ TCP   │ 3456  │ postgres       │ /usr/lib/postgresql/16/bin/postgres
# 8080   │ TCP   │ 7890  │ java           │ java -jar api.jar

# Filtrer par port
portmap --port 8080

# Format JSON pour scripting
portmap --format json
```

Plus rapide et plus lisible que `ss -tlnp | grep ...`. Un seul binaire, zéro dépendance.

**GitHub :** [hallucinaut/portmap](https://github.com/hallucinaut/portmap)

---

### apiconnector — Test de Connectivité API

Vérifier la connectivité vers toutes les APIs dont dépend un service, en une commande.

```bash
go install github.com/hallucinaut/apiconnector@latest

# Tester la connectivité
apiconnector test --config ./api-endpoints.yaml

# Résultat :
# ENDPOINT                        │ PROTO │ STATUS │ LATENCY │ TLS
# https://api.stripe.com          │ HTTPS │ ✓ 200  │ 45ms    │ TLS 1.3
# https://api.sendgrid.com        │ HTTPS │ ✓ 200  │ 67ms    │ TLS 1.3
# tcp://redis.internal:6379       │ TCP   │ ✓ OK   │ 2ms     │ N/A
# unix:///var/run/docker.sock     │ UNIX  │ ✓ OK   │ <1ms    │ N/A
# https://api.broken.example.com  │ HTTPS │ ✗ TIMEOUT│ >5000ms │ N/A

# Matrice de connectivité entre environnements
apiconnector matrix --envs dev,staging,prod
```

**Protocoles supportés :** HTTP/HTTPS, TCP, Unix socket, gRPC.

**GitHub :** [hallucinaut/apiconnector](https://github.com/hallucinaut/apiconnector)

---

### healthcheckd — Agrégateur de Health Checks

Un dashboard unifié de l'état de santé de tous les services.

```bash
go install github.com/hallucinaut/healthcheckd@latest

# Configurer et lancer
healthcheckd serve --config ./healthchecks.yaml --port 8090

# Vérification ponctuelle
healthcheckd check --config ./healthchecks.yaml

# Résultat :
# SERVICE          │ STATUS  │ LATENCY │ LAST CHECK
# api-gateway      │ HEALTHY │ 12ms    │ 10s ago
# auth-service     │ HEALTHY │ 8ms     │ 10s ago
# database-primary │ HEALTHY │ 3ms     │ 10s ago
# cache-redis      │ DEGRADED│ 145ms   │ 10s ago  ← latence élevée
# search-elastic   │ DOWN    │ TIMEOUT │ 10s ago  ← incident

# Générer un dashboard Grafana
healthcheckd grafana --output dashboard.json
```

**GitHub :** [hallucinaut/healthcheckd](https://github.com/hallucinaut/healthcheckd)

---

## Configuration & Environnement

### envdiff — Diff de Variables d'Environnement

Pourquoi ça marche en dev mais pas en prod ? Souvent, une variable d'environnement manquante.

```bash
go install github.com/hallucinaut/envdiff@latest

# Comparer dev et prod
envdiff compare --source .env.dev --target .env.prod

# Résultat :
# VARIABLE              │ DEV              │ PROD             │ STATUS
# DATABASE_URL          │ localhost:5432   │ rds.aws:5432     │ DIFFERENT
# REDIS_URL             │ localhost:6379   │ redis.aws:6379   │ DIFFERENT
# API_KEY               │ test_key_123     │ (not set)        │ MISSING ←
# DEBUG                 │ true             │ (not set)        │ MISSING
# LOG_LEVEL             │ debug            │ info             │ DIFFERENT
# NEW_FEATURE_FLAG      │ (not set)        │ true             │ ONLY IN PROD

# Générer un script de synchronisation
envdiff sync --source .env.dev --target .env.prod --output sync.sh
```

**GitHub :** [hallucinaut/envdiff](https://github.com/hallucinaut/envdiff)

---

### configdiff — Diff Sémantique de Configurations

Au-delà du `diff` textuel : comprendre les différences sémantiques entre deux fichiers de configuration.

```bash
go install github.com/hallucinaut/configdiff@latest

# Comparer deux configs YAML
configdiff compare config-v1.yaml config-v2.yaml

# Résultat sémantique :
# PATH                        │ v1           │ v2           │ TYPE
# server.port                 │ 8080         │ 9090         │ CHANGED
# server.tls.enabled          │ false        │ true         │ CHANGED
# database.pool_size          │ 10           │ (removed)    │ REMOVED
# cache.ttl                   │ (not set)    │ 3600         │ ADDED
# logging.level               │ info         │ info         │ UNCHANGED

# Formats : YAML, JSON, TOML, INI
# Générer un script de migration
configdiff migrate --from config-v1.yaml --to config-v2.yaml --output migrate.sh

# Valider contre un schéma
configdiff validate --config config.yaml --schema schema.json
```

**GitHub :** [hallucinaut/configdiff](https://github.com/hallucinaut/configdiff)

---

### servicewait — Attente Intelligente de Services

Dans les environnements conteneurisés, les services démarrent dans un ordre imprévisible. Il faut attendre que les dépendances soient prêtes.

```bash
go install github.com/hallucinaut/servicewait@latest

# Attendre que les services soient prêts
servicewait wait --services "postgres:5432,redis:6379,elasticsearch:9200" --timeout 60s

# Avec health check intelligent
servicewait wait --service postgres:5432 --check "pg_isready" --interval 2s

# Graphe de dépendances
servicewait graph --config ./dependencies.yaml --output startup.sh

# Résultat :
# [WAIT] postgres:5432 ... ready (2.3s)
# [WAIT] redis:6379 ... ready (0.8s)
# [WAIT] elasticsearch:9200 ... ready (12.4s)
# [OK] All services ready. Total wait: 12.4s
```

Remplace les scripts `while ! nc -z ...` par quelque chose de fiable.

**GitHub :** [hallucinaut/servicewait](https://github.com/hallucinaut/servicewait)

---

## Monitoring & Rapports

### secmetrics — Métriques de Sécurité

Mesurer la sécurité avec des KPIs concrets, pas des impressions.

```bash
go install github.com/hallucinaut/secmetrics@latest

# Collecter les métriques
secmetrics collect --sources vulnscan,incidents,patching

# Dashboard
secmetrics dashboard --format json

# Résultat :
# SECURITY METRICS DASHBOARD — February 2026
# ──────────────────────────────────────────
# MTTR (Mean Time To Remediate):     4.2 hours
# Vulnerability Backlog:             23 (3 critical)
# Patch Compliance:                  94%
# Security Training Completion:      87%
# Incidents This Month:              2
# Mean Time To Detect:               1.8 hours
# Security Debt Score:               B+ (improving)
```

**GitHub :** [hallucinaut/secmetrics](https://github.com/hallucinaut/secmetrics)

---

### resourcereport — Rapports d'Utilisation des Ressources

Comprendre la consommation de ressources avec des projections et des tendances.

```bash
go install github.com/hallucinaut/resourcereport@latest

# Générer un rapport
resourcereport generate --format html --output report.html

# Rapport JSON pour automatisation
resourcereport generate --format json --period 30d

# Résultat :
# RESOURCE USAGE REPORT — Last 30 Days
# CPU:    avg 42% | peak 89% | trend: +5%/month
# Memory: avg 6.2GB/16GB | peak 12.1GB | trend: +8%/month
# Disk:   used 234GB/500GB | growth: 12GB/month
# Network: avg 450Mbps | peak 1.2Gbps
#
# COST PROJECTION (next 90 days):
# Current: $1,240/month
# Projected: $1,380/month (+11%)
# Recommendation: Consider scaling disk before April
```

**GitHub :** [hallucinaut/resourcereport](https://github.com/hallucinaut/resourcereport)

---

### logpattern — Détection de Patterns dans les Logs

Trouver les patterns récurrents et les anomalies dans des millions de lignes de logs.

```bash
go install github.com/hallucinaut/logpattern@latest

# Analyser des logs
logpattern analyze --input /var/log/syslog --format json

# Résultat :
# LOG PATTERN ANALYSIS
# Pattern 1: "Connection refused to *:5432" — 847 occurrences (23%)
#   → First: 2026-02-27 03:14:00 | Last: 2026-02-27 06:45:00
#   → ANOMALY: 500% increase vs baseline
#
# Pattern 2: "Authentication failed for user *" — 234 occurrences (6%)
#   → Concentrated from single IP: 10.0.3.45
#   → ALERT: Possible brute force
#
# Pattern 3: "Request timeout after 30s" — 156 occurrences (4%)
#   → Correlated with Pattern 1 (database connectivity)

# Générer des règles d'alerte
logpattern rules --input /var/log/syslog --output alertmanager-rules.yaml
```

**GitHub :** [hallucinaut/logpattern](https://github.com/hallucinaut/logpattern)

---

## Backup & Migration

### backuptest — Validation de Sauvegardes

Un backup qui n'a jamais été testé n'est pas un backup. C'est un fichier.

```bash
go install github.com/hallucinaut/backuptest@latest

# Valider l'intégrité d'un backup
backuptest verify --backup ./backups/db-2026-02-27.sql.gz

# Simuler une restauration
backuptest restore-test --backup ./backups/db-latest.gz --target test-db

# Résultat :
# BACKUP INTEGRITY TEST
# File: db-2026-02-27.sql.gz
# Size: 2.4 GB
# Checksum: SHA256 OK ✓
# Decompression: OK ✓
# SQL Syntax: OK ✓
# Restore Simulation: OK ✓ (completed in 4m23s)
# Record Count: 2,847,392 rows across 45 tables
# Status: VERIFIED
```

**GitHub :** [hallucinaut/backuptest](https://github.com/hallucinaut/backuptest)

---

### profilesync — Migration de Profils Cross-Platform

Migrer un poste de travail entre Linux, macOS et Windows sans perdre sa configuration.

```bash
go install github.com/hallucinaut/profilesync@latest

# Exporter le profil actuel
profilesync export --output ./my-profile.tar.gz

# Éléments exportés :
# [OK] Shell config (.bashrc, .zshrc)
# [OK] Git config (.gitconfig, .gitignore_global)
# [OK] SSH keys and config
# [OK] IDE settings (VSCode, JetBrains)
# [OK] Terminal profiles (iTerm2, Windows Terminal)
# [OK] Browser bookmarks
#
# Profile exported: 45 MB

# Importer sur une nouvelle machine
profilesync import --input ./my-profile.tar.gz --merge
```

**GitHub :** [hallucinaut/profilesync](https://github.com/hallucinaut/profilesync)

---

## Le Quotidien Automatisé

Ces 11 outils couvrent le cycle DevOps complet :

```
Diagnostic      → portmap, apiconnector
Monitoring      → healthcheckd, secmetrics, logpattern
Configuration   → envdiff, configdiff
Orchestration   → servicewait
Rapports        → resourcereport
Backup          → backuptest
Migration       → profilesync
```

Chaque outil remplace un script bash fragile par un binaire Go testé. Chaque outil produit du JSON pour s'intégrer dans les pipelines existants. Chaque outil est un MVP prêt à évoluer.

## Contribuer

Les outils DevOps sont ceux qui bénéficient le plus des contributions terrain. Chaque environnement est différent, chaque workflow a ses spécificités :

- Nouveaux providers pour `apiconnector`
- Formats de logs pour `logpattern`
- Providers de backup pour `backuptest`
- Plateformes pour `profilesync`

```bash
git clone https://github.com/hallucinaut/<outil>.git
go test ./...
# PR bienvenue
```

**Tous les outils :** [Arsenal Open Source Complet](/blog/2026/02/arsenal-securite-open-source/)

**FIN_DE_TRANSMISSION**
