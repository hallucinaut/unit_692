---
title: 'Compliance & Gouvernance : 7 Outils pour l''Audit Automatisé'
date: '2026-02-27'
author: 'UNIT_692'
excerpt: 'SOC2, HIPAA, PCI-DSS, GDPR, CIS Benchmarks, Zero Trust. 7 outils Go pour automatiser la compliance, auditer l''infrastructure et enforcer les politiques de sécurité.'
tags: ['security', 'compliance', 'audit', 'golang', 'open-source', 'governance', 'devsecops']
---

La compliance manuelle ne scale pas. Remplir des spreadsheets pour prouver la conformité SOC2 est une perte de temps monumentale. Les audits ponctuels donnent un snapshot qui est obsolète le lendemain.

**Angle choisi : Automatisation totale.** 7 outils pour transformer la compliance en code exécutable et vérifiable en continu.

## 1. compliance-copilot — Assistant Compliance Temps Réel

L'outil central. Monitoring continu de la conformité avec collecte automatisée de preuves.

```bash
go install github.com/hallucinaut/compliance-copilot@latest

# Évaluer la conformité SOC2
compliance-copilot assess --framework soc2 --scope ./infrastructure

# Monitoring continu
compliance-copilot monitor --frameworks soc2,hipaa --interval 1h

# Générer un rapport d'audit
compliance-copilot report --framework pci-dss --format pdf --output audit-q1.pdf
```

**Frameworks supportés :**
- **SOC2** : Trust Service Criteria (Security, Availability, Confidentiality)
- **HIPAA** : Privacy Rule, Security Rule
- **PCI-DSS** : Requirements 1-12
- **GDPR** : Articles 5, 25, 32, 35
- **CIS Benchmarks** : Linux, Docker, Kubernetes, AWS

**Ce qui change :**
- Collecte de preuves automatisée (pas de screenshots manuels)
- Rapport d'écart en temps réel
- Historique de conformité pour les audits

**GitHub :** [hallucinaut/compliance-copilot](https://github.com/hallucinaut/compliance-copilot)

---

## 2. securitybaseline — Vérification de Baseline CIS/NIST

Avant la compliance spécifique, il faut une baseline de sécurité solide. Cet outil vérifie automatiquement la conformité aux benchmarks reconnus.

```bash
go install github.com/hallucinaut/securitybaseline@latest

# Vérifier contre CIS
securitybaseline check --benchmark cis-linux-l2

# Vérifier contre NIST
securitybaseline check --benchmark nist-800-53 --scope ./servers

# Rapport avec remédiation
securitybaseline check --benchmark disa-stig --remediate --dry-run

# Résultat type :
# CIS Linux Level 2 — Score: 78/100
# [FAIL] 1.1.2  — /tmp not on separate partition
# [FAIL] 4.2.3  — SSH MaxAuthTries > 4
# [PASS] 5.3.1  — Password hashing algorithm SHA-512
# [PASS] 6.1.1  — Audit log storage configured
# Remediation scripts generated: ./remediate/
```

**Benchmarks supportés :**
- CIS (Linux, Docker, Kubernetes, AWS, Azure)
- NIST 800-53
- DISA STIG
- PCI-DSS

**GitHub :** [hallucinaut/securitybaseline](https://github.com/hallucinaut/securitybaseline)

---

## 3. infrastructure-audit — Audit de Sécurité IaC

L'Infrastructure as Code doit être auditée comme du code applicatif. Les misconfiguration Terraform ou CloudFormation sont des vulnérabilités.

```bash
go install github.com/hallucinaut/infrastructure-audit@latest

# Auditer du Terraform
infrastructure-audit scan --dir ./terraform --format json

# Auditer du CloudFormation
infrastructure-audit scan --dir ./cfn-templates --type cloudformation

# Auditer des manifests Kubernetes
infrastructure-audit scan --dir ./k8s --type kubernetes

# Résultat type :
# [CRITICAL] S3 bucket public access enabled — main.tf:45
# [HIGH] Security group allows 0.0.0.0/0 on port 22 — network.tf:23
# [MEDIUM] RDS instance not encrypted — database.tf:12
# [LOW] CloudWatch log retention < 365 days — monitoring.tf:8
```

**Formats IaC supportés :**
- Terraform (HCL)
- AWS CloudFormation (JSON/YAML)
- Kubernetes manifests
- Azure ARM templates

**Compliance mapping :** chaque finding est mappé aux contrôles SOC2, HIPAA, PCI-DSS correspondants.

**GitHub :** [hallucinaut/infrastructure-audit](https://github.com/hallucinaut/infrastructure-audit)

---

## 4. securitypolicy — Politiques de Sécurité as Code

Les politiques de sécurité en PDF que personne ne lit sont inutiles. Les politiques as code sont exécutables et vérifiables.

```bash
go install github.com/hallucinaut/securitypolicy@latest

# Définir une politique
securitypolicy init --template enterprise

# Valider l'infrastructure contre les politiques
securitypolicy enforce --policy ./policies/ --target ./infrastructure/

# Exemple de politique (YAML) :
# name: enforce-encryption-at-rest
# severity: critical
# resources:
#   - type: database
#     require:
#       encryption: true
#       key_rotation: 90d
#   - type: storage
#     require:
#       encryption: aes-256
```

**GitHub :** [hallucinaut/securitypolicy](https://github.com/hallucinaut/securitypolicy)

---

## 5. securitycontrol — Validation des Contrôles de Sécurité

Avoir des contrôles de sécurité déployés ne suffit pas. Il faut vérifier qu'ils fonctionnent réellement.

```bash
go install github.com/hallucinaut/securitycontrol@latest

# Tester tous les contrôles
securitycontrol validate --scope production

# Tester un contrôle spécifique
securitycontrol test --control network-segmentation --environment prod

# Résultat :
# CONTROL: network-segmentation
# STATUS: PARTIALLY_EFFECTIVE
# TESTS:
#   [PASS] DMZ isolation verified
#   [PASS] Database subnet not publicly accessible
#   [FAIL] Lateral movement possible between app-tier and admin-tier
#   RECOMMENDATION: Add network policy to restrict app→admin traffic
```

**GitHub :** [hallucinaut/securitycontrol](https://github.com/hallucinaut/securitycontrol)

---

## 6. privacyguard — Scanning PII et Conformité RGPD

Les données personnelles sont partout : logs, bases de données, fichiers de configuration, exports CSV. Il faut les trouver avant les régulateurs.

```bash
go install github.com/hallucinaut/privacyguard@latest

# Scanner un projet pour les PII
privacyguard scan --dir ./application --format json

# Scanner une base de données
privacyguard scan --dsn "postgres://localhost/mydb" --tables users,orders

# Résultat :
# [PII] Email addresses found — src/handlers/user.go:34 (logged without masking)
# [PII] Phone numbers in plain text — database/exports/users.csv:col3
# [PII] IP addresses retained > 30 days — logs/access.log
# [PII] Credit card patterns detected — tests/fixtures/orders.json
#
# GDPR Compliance: 67% — 4 issues to resolve
# HIPAA Compliance: 82% — 2 issues to resolve
# CCPA Compliance: 71% — 3 issues to resolve
```

**Réglementations couvertes :**
- **GDPR/RGPD** : Articles 5, 25, 32
- **HIPAA** : PHI detection
- **CCPA** : Personal information categories

**GitHub :** [hallucinaut/privacyguard](https://github.com/hallucinaut/privacyguard)

---

## 7. zerotrust — Validation Zero Trust

Le Zero Trust n'est pas un produit, c'est une architecture. Cet outil valide que les principes sont réellement implémentés.

```bash
go install github.com/hallucinaut/zerotrust@latest

# Évaluer l'architecture Zero Trust
zerotrust assess --scope ./infrastructure

# Vérifier les principes
zerotrust verify --principles all

# Résultat :
# ZERO TRUST ASSESSMENT — Score: 61/100
#
# PRINCIPLE: Never Trust, Always Verify
#   [PASS] All API endpoints require authentication
#   [FAIL] Internal service-to-service calls without mTLS
#
# PRINCIPLE: Least Privilege
#   [PASS] RBAC configured on Kubernetes
#   [FAIL] 3 service accounts with admin privileges
#
# PRINCIPLE: Assume Breach
#   [PASS] Network segmentation active
#   [FAIL] No lateral movement detection
#   [FAIL] Insufficient logging on internal services
```

**Principes validés :**
- Never Trust, Always Verify
- Least Privilege Access
- Assume Breach
- Micro-segmentation
- Continuous Verification

**GitHub :** [hallucinaut/zerotrust](https://github.com/hallucinaut/zerotrust)

---

## Le Stack Compliance Automatisé

```
                    ┌─────────────────────┐
                    │  securitypolicy     │ ← Définir les règles
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐  ┌─────▼───────┐  ┌─────▼──────────┐
    │securitybaseline│  │infra-audit  │  │ privacyguard   │
    │  (systèmes)    │  │  (IaC)      │  │  (données)     │
    └─────────┬──────┘  └─────┬───────┘  └─────┬──────────┘
              │               │                │
              └───────────────┼────────────────┘
                              │
                    ┌─────────▼───────────┐
                    │ securitycontrol     │ ← Vérifier l'efficacité
                    └─────────┬───────────┘
                              │
              ┌───────────────┼───────────────┐
              │                               │
    ┌─────────▼──────────┐        ┌───────────▼─────────┐
    │ compliance-copilot │        │     zerotrust       │
    │ (rapport continu)  │        │ (architecture)      │
    └────────────────────┘        └─────────────────────┘
```

## Contribuer

La compliance est un domaine vaste. Ces outils couvrent les fondamentaux mais il reste du travail :

- Nouveaux frameworks de compliance pour `compliance-copilot`
- Benchmarks additionnels pour `securitybaseline`
- Support de nouveaux formats IaC pour `infrastructure-audit`
- Patterns PII par juridiction pour `privacyguard`

**Tous les outils :** [Arsenal Open Source Complet](/blog/2026/02/arsenal-securite-open-source/)

**FIN_DE_TRANSMISSION**
