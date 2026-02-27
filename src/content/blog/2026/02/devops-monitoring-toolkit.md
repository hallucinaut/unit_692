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

### portmap — Mapping des Ports

Qui écoute sur quel port ? Quel processus utilise le port 8080 ? `portmap` répond en une commande avec une sortie colorée.

```bash
# Mapper tous les ports en écoute
portmap

# Filtrer un port spécifique
portmap | grep 8080

# PORT   │ PROTO │ PID   │ PROCESS   │ COMMAND
# 22     │ TCP   │ 1234  │ sshd      │ /usr/sbin/sshd -D       (rouge)
# 443    │ TCP   │ 5678  │ nginx     │ nginx: master process   (rouge)
# 3000   │ TCP   │ 9012  │ node      │ node server.js          (jaune)
# 8080   │ TCP   │ 7890  │ java      │ java -jar api.jar       (vert)
```

**Code couleur :**
- **Rouge** : ports well-known (< 1024)
- **Jaune** : ports registered (1024-7999)
- **Vert** : ports dynamiques (8000+)

Utilise `ss` (iproute2), `lsof` et `ps` en interne. Plus lisible que `ss -tlnp | grep ...` et aucune dépendance à installer.

**GitHub :** [hallucinaut/portmap](https://github.com/hallucinaut/portmap)

---

### apiconnector — Test de Connectivité API

Vérifier la connectivité vers toutes les APIs dont dépend un service, en une commande.

```bash
# Tester un endpoint HTTP
apiconnector api=http://localhost:8080/health

# Tester plusieurs services
apiconnector api=http://localhost:8080/health db=postgres://localhost:5432

# Tester avec méthode HTTP spécifique
apiconnector api=http://localhost:8080/health web=http://localhost:3000[GET]
```

**Format d'entrée :** `nom=url` — chaque service est identifié par un nom et son URL. Support HTTP/HTTPS et connectivité TCP (PostgreSQL, Redis, etc.).

**GitHub :** [hallucinaut/apiconnector](https://github.com/hallucinaut/apiconnector)

---

### healthcheckd — Agrégateur de Health Checks

Un point unique pour connaître l'état de santé de tous les services. Avec génération automatique de dashboard Grafana.

```bash
# Vérifier un service
healthcheckd api=http://localhost:8080/health

# Vérifier plusieurs services
healthcheckd api=http://localhost:8080/health web=http://localhost:3000

# Avec méthode HTTP spécifique
healthcheckd service=http://localhost:9000/status[GET]
```

Même syntaxe que `apiconnector` (`nom=url`), mais orienté monitoring continu plutôt que test ponctuel. La génération de dashboard Grafana permet une intégration directe dans un stack d'observabilité existant.

**GitHub :** [hallucinaut/healthcheckd](https://github.com/hallucinaut/healthcheckd)

---

## Configuration & Environnement

### envdiff — Diff de Variables d'Environnement

Pourquoi ça marche en dev mais pas en prod ? Souvent, une variable d'environnement manquante.

```bash
# Comparer dev et prod
./envdiff .env.dev .env.prod

# Sortie JSON pour automatisation
./envdiff config/dev.json config/prod.json --json
```

**Catégories de résultat :**
- **Common** : présentes dans les deux fichiers, valeurs identiques
- **Only in left** : présentes uniquement dans le premier fichier
- **Only in right** : présentes uniquement dans le second
- **Modified** : présentes dans les deux, valeurs différentes

La sortie identifie immédiatement les variables manquantes ou modifiées. L'option `--json` permet d'intégrer le diff dans un pipeline CI et de générer des scripts de synchronisation.

**GitHub :** [hallucinaut/envdiff](https://github.com/hallucinaut/envdiff)

---

### configdiff — Diff Sémantique de Configurations

Au-delà du `diff` textuel : comprendre les différences sémantiques entre deux fichiers de configuration.

```bash
# Comparer deux configs YAML
configdiff config.dev.yaml config.prod.yaml

# Comparer du JSON
configdiff settings.json settings.backup.json
```

**Formats supportés :** YAML, JSON, TOML.

L'outil parse les fichiers et compare les clés/valeurs sémantiquement, pas ligne par ligne. Un changement d'indentation ou de formatage ne sera pas signalé comme une différence. Seuls les ajouts, suppressions et modifications de valeurs sont rapportés. Génération de scripts de migration incluse.

**GitHub :** [hallucinaut/configdiff](https://github.com/hallucinaut/configdiff)

---

### servicewait — Attente de Services

Dans les environnements conteneurisés, les services démarrent dans un ordre imprévisible. Il faut attendre que les dépendances soient prêtes.

```bash
# Attendre un service
servicewait db:localhost:5432:tcp

# Attendre un service HTTP avec health check
servicewait api:localhost:8080:http:/health

# Attendre plusieurs services
servicewait db:localhost:5432:tcp redis:localhost:6379:tcp api:localhost:8080:http:/ready
```

**Format :** `nom:host:port:protocole` — chaque service est décrit en une seule chaîne.

**Protocoles :** TCP, HTTP/HTTPS, Unix socket.

**Comportement :** timeout de 5s par check, 30 retries maximum. Exit 0 si tous les services sont prêts, exit 1 en cas d'échec.

Remplace les scripts `while ! nc -z ...` par quelque chose de fiable et lisible.

**GitHub :** [hallucinaut/servicewait](https://github.com/hallucinaut/servicewait)

---

## Monitoring & Rapports

### secmetrics — Métriques de Sécurité

Mesurer la sécurité avec des KPIs concrets. Génère des rapports adaptés à l'audience : executive, technique ou markdown.

```bash
# Collecter les métriques
secmetrics collect

# Afficher les KPIs
secmetrics kpis

# Rapport executive (pour la direction)
secmetrics report executive

# Rapport technique (pour l'équipe sécurité)
secmetrics report technical

# Rapport markdown (pour la documentation)
secmetrics report markdown

# Résumé rapide
secmetrics summary

# Santé globale
secmetrics health
```

**KPIs suivis :**
- **MTTR** : Mean Time To Remediate
- **MTTD** : Mean Time To Detect
- **MTTC** : Mean Time To Contain
- **Security coverage** : couverture des contrôles
- **Patching compliance** : conformité des patchs
- **Remediation rate** : taux de remédiation

**Niveaux de santé :**

| Statut | Critère |
|--------|---------|
| **HEALTHY** | >= 90% compliance, <= 30% risque |
| **GOOD** | En dessous de HEALTHY mais acceptable |
| **FAIR** | Améliorations nécessaires |
| **POOR** | Action urgente requise |

**GitHub :** [hallucinaut/secmetrics](https://github.com/hallucinaut/secmetrics)

---

### resourcereport — Rapports d'Utilisation des Ressources

Comprendre la consommation de ressources des conteneurs Docker avec plusieurs formats de sortie.

```bash
# Rapport texte (défaut)
resourcereport

# Rapport JSON pour automatisation
resourcereport --json

# Rapport HTML
resourcereport --html > report.html

# Filtrer par conteneur
resourcereport api worker
```

**Métriques collectées :** CPU, mémoire, réseau — directement depuis les conteneurs Docker.

**Niveaux de statut :**

| Statut | CPU |
|--------|-----|
| **LOW** | < 50% |
| **NORMAL** | 50-80% |
| **HIGH** | > 80% |

3 formats de sortie (texte, JSON, HTML) pour s'adapter à tous les contextes : monitoring humain, pipeline CI ou dashboard web.

**GitHub :** [hallucinaut/resourcereport](https://github.com/hallucinaut/resourcereport)

---

### logpattern — Détection de Patterns dans les Logs

Trouver les patterns récurrents dans des millions de lignes de logs. `logpattern` normalise automatiquement les contenus variables pour regrouper les messages similaires.

```bash
# Analyser un fichier de logs
logpattern /var/log/app.log

# Lire depuis stdin
cat app.log | logpattern -
```

**Normalisation automatique :**
- Nombres → `<NUM>`
- UUIDs → `<UUID>`
- Adresses IP → `<IP>`
- Timestamps → `<TIMESTAMP>`

L'outil transforme `"Connection refused to 10.0.3.45:5432"` et `"Connection refused to 10.0.3.46:5432"` en un seul pattern : `"Connection refused to <IP>:<NUM>"`. Les patterns récurrents sont comptés et triés par fréquence.

**GitHub :** [hallucinaut/logpattern](https://github.com/hallucinaut/logpattern)

---

## Backup & Migration

### backuptest — Validation de Sauvegardes

Un backup qui n'a jamais été testé n'est pas un backup.

```bash
# Valider un fichier de backup
backuptest /backup/daily/database.sql

# Valider tous les backups d'un répertoire
backuptest /backup/daily
```

**Validation par checksum MD5.** Statuts :

| Statut | Condition |
|--------|-----------|
| **OK** | Checksum valide, fichier lisible |
| **WARNING** | Fichier vide |
| **ERROR** | Fichier illisible ou corrompu |

Simple : un chemin en argument (fichier ou répertoire), un statut en sortie.

**GitHub :** [hallucinaut/backuptest](https://github.com/hallucinaut/backuptest)

---

### profilesync — Migration de Profils Cross-Platform

Migrer un poste de travail entre Linux, macOS et Windows sans perdre sa configuration.

```bash
# Preview de la migration
./profilesync --source=linux --dest=macos --dry-run

# Migration effective
./profilesync --source=linux --dest=macos --dry-run=false

# Migration forcée (écraser les fichiers existants)
./profilesync --source=linux --dest=macos --force=true
```

**20+ outils supportés :**
- **Éditeurs** : VS Code, IntelliJ, Vim, Emacs
- **Shell** : Bash, Zsh, Fish, Tmux
- **VCS** : Git (config + gitignore global)
- **SSH** : clés et config
- **Navigateurs** : Chrome, Firefox
- **Package managers** : NPM, Yarn, Pip
- **DevOps** : Docker, kubectl, Helm, Terraform, AWS CLI

Le mode `--dry-run` (par défaut) montre les fichiers qui seront migrés sans rien modifier. Essentiel pour vérifier avant d'écraser une configuration existante.

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

Les outils DevOps sont ceux qui bénéficient le plus des contributions terrain :

- Formats de logs pour `logpattern`
- Providers de backup pour `backuptest`
- Plateformes et outils pour `profilesync`
- Protocoles pour `apiconnector` et `servicewait`

```bash
git clone https://github.com/hallucinaut/<outil>.git
go test ./...
# PR bienvenue
```

**Tous les outils :** [Arsenal Open Source Complet](/blog/2026/02/arsenal-securite-open-source/)

**FIN_DE_TRANSMISSION**
