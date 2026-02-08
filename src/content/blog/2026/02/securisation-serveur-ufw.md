---
title: "Sécurisation Linux : Guide Pratique UFW"
date: "2026-02-08"
author: "UNIT_692"
excerpt: "Mise en place d'un pare-feu robuste avec UFW pour protéger vos instances contre les scans et intrusions basiques."
tags: ["sécurité", "linux", "devops", "guide"]
---

Le pare-feu est la première ligne de défense de tout serveur exposé à l'internet public. Sur Ubuntu et Debian, **UFW (Uncomplicated Firewall)** est l'outil standard pour gérer les règles `iptables` sans en subir la complexité syntaxique.

## 1. État des Lieux

Avant toute manipulation, vérifiez l'état du service. Par défaut, il est souvent inactif.

```bash
sudo ufw status verbose
```

## 2. Configuration de Base (Deny All)

La règle d'or en sécurité est le **moindre privilège**. On bloque tout par défaut en entrée, et on autorise tout en sortie.

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

## 3. Autoriser les Services Essentiels

**CRITIQUE :** N'activez jamais UFW sans avoir autorisé SSH, sous peine de perdre l'accès à votre serveur.

### SSH (Port 22)
```bash
sudo ufw allow ssh
# Ou plus précis si vous utilisez un port personnalisé :
sudo ufw allow 2222/tcp
```

### Serveur Web (HTTP/HTTPS)
```bash
sudo ufw allow http
sudo ufw allow https
```

## 4. Protection Avancée : Rate Limiting

UFW permet de limiter le nombre de tentatives de connexion pour prévenir les attaques par force brute sur SSH. Si une IP tente de se connecter plus de 6 fois en 30 secondes, elle est temporairement bannie.

```bash
sudo ufw limit ssh
```

## 5. Activation

Une fois les règles configurées, activez le pare-feu. Confirmez par "y" lors de l'avertissement concernant la connexion SSH.

```bash
sudo ufw enable
```

## 6. Maintenance et Analyse

Pour voir les règles numérotées (utile pour en supprimer une) :
```bash
sudo ufw status numbered
# Supprimer la règle n°3
sudo ufw delete 3
```

Pour consulter les logs d'attaques bloquées :
```bash
tail -f /var/log/ufw.log
```

## Conclusion

UFW est simple mais redoutable. Une configuration "Deny All" combinée à un "Limit SSH" réduit drastiquement la surface d'attaque de votre infrastructure. Ne laissez jamais un port ouvert "au cas où".

**STATUT : PÉRIMÈTRE_SÉCURISÉ**
