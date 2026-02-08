---
title: 'Hardening Initial : Le Minimum Vital pour votre Serveur'
date: '2026-02-08'
author: 'UNIT_692'
excerpt: 'Votre serveur est scanné dans les 5 minutes suivant sa mise en ligne. Voici le protocole de survie : SSH, Utilisateurs et Firewall.'
tags: ['security', 'ssh', 'linux', 'server', 'hardening', 'sysadmin']
---

Dès l'instant où votre serveur dispose d'une adresse IP publique, il devient une cible. Des bots parcourent le web en continu pour tenter de se connecter en `root` avec des mots de passe communs.

Ce guide n'est pas de la paranoïa, c'est de l'hygiène numérique. Voici la procédure standard pour tout nouveau déploiement Linux (Debian/Ubuntu/CentOS).

## 1. La Règle d'Or : Jamais de Root

**Le Risque :** L'utilisateur `root` a tous les droits. Si un attaquant devine son mot de passe, il a les clés du royaume. De plus, `root` est le nom d'utilisateur le plus testé par les bots.

**La Solution :** Créez un utilisateur "normal" qui pourra s'élever temporairement (sudo).

```bash
# Créer l'utilisateur (remplacez 'operateur' par votre pseudo)
adduser operateur

# Lui donner les droits sudo (Debian/Ubuntu)
usermod -aG sudo operateur

# Sur CentOS/RedHat, le groupe est souvent 'wheel'
usermod -aG wheel operateur
```

Une fois fait, **connectez-vous avec ce nouvel utilisateur** avant de continuer.

## 2. La Forteresse SSH

Le protocole SSH est votre porte d'entrée. C'est aussi la première porte que les attaquants essaient de défoncer.

### A. Clés SSH > Mots de passe

Les mots de passe sont faibles (interceptables, devinables). Les clés cryptographiques (Ed25519 ou RSA 4096) sont mathématiquement inviolables par force brute actuelle.

Sur votre machine locale (votre PC), générez une paire de clés si ce n'est pas déjà fait :

```bash
ssh-keygen -t ed25519 -C "admin@mon-pc"
```

Envoyez la clé publique vers le serveur :

```bash
ssh-copy-id operateur@ip-du-serveur
```

### B. Verrouiller la configuration

Maintenant que votre clé est en place, nous allons dire au serveur de **refuser** tout mot de passe et de **bannir** la connexion root directe.

Éditez `/etc/ssh/sshd_config` :

```bash
sudo nano /etc/ssh/sshd_config
```

Modifiez (ou ajoutez) ces lignes :

```ini
# Désactiver l'accès root direct
PermitRootLogin no

# Désactiver l'authentification par mot de passe (Clés UNIQUEMENT)
PasswordAuthentication no

# (Optionnel) Changer le port pour réduire le bruit dans les logs
# Port 2222
```

Redémarrez le service SSH :
`sudo systemctl restart ssh` (ou `sshd`).

**⚠️ IMPORTANT :** Ne fermez pas votre terminal actuel ! Ouvrez un nouveau terminal et testez la connexion. Si vous vous êtes trompé, vous gardez une session active pour réparer.

## 3. Le Mur (Firewall)

Un serveur ne doit exposer que ce qui est strictement nécessaire. Par défaut, tout doit être bloqué.

### Debian / Ubuntu (UFW)

```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh  # ou le port personnalisé
sudo ufw enable
```

### CentOS / RHEL (Firewalld)

Sur ces systèmes, `firewalld` est le standard.

```bash
sudo systemctl enable --now firewalld

# Autoriser SSH (déjà actif par défaut, mais pour confirmer)
sudo firewall-cmd --permanent --add-service=ssh
# Ou port personnalisé : sudo firewall-cmd --permanent --add-port=2222/tcp

# Recharger pour appliquer
sudo firewall-cmd --reload
```

**Le Risque évité :** Si vous installez une base de données (Redis, Mongo, MySQL) qui écoute par défaut sur toutes les interfaces, le firewall empêchera un attaquant externe de s'y connecter.

## 4. Fail2Ban : Le Videur

Même avec des clés SSH, les bots vont spammer votre port 22. Fail2Ban surveille les logs et bannit temporairement les IP qui échouent trop souvent.

### Debian / Ubuntu
```bash
sudo apt install fail2ban
```

### CentOS / RHEL
Vous avez besoin du dépôt EPEL (Extra Packages for Enterprise Linux) :

```bash
sudo dnf install epel-release
sudo dnf install fail2ban fail2ban-firewalld
sudo systemctl enable --now fail2ban
```

## 5. Mises à Jour Automatiques

La faille de sécurité la plus dangereuse est celle qui a été corrigée il y a 6 mois mais que vous n'avez pas appliquée.

### Debian / Ubuntu (Unattended-Upgrades)
```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

### CentOS / RHEL (DNF-Automatic)
```bash
sudo dnf install dnf-automatic
sudo systemctl enable --now dnf-automatic.timer
```
Par défaut, il télécharge. Pour qu'il installe, éditez `/etc/dnf/automatic.conf` et mettez `apply_updates = yes`.

## Résumé du Protocole

1.  Créer un utilisateur `sudo`.
2.  Installer sa clé SSH.
3.  Interdire `root` et les mots de passe dans SSH.
4.  Activer le Firewall (UFW) en n'ouvrant que le strict nécessaire.
5.  Installer Fail2Ban.

Votre serveur n'est pas invulnérable, mais il ne s'offre plus au premier venu. Vous êtes passé d'une maison porte ouverte à un bunker verrouillé.

**STATUT : SÉCURITÉ_ACTIVE**
