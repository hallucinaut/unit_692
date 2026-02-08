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

### B. Verrouiller la configuration & Changer le Port

Nous allons dire au serveur de refuser les mots de passe, de bannir root, et de **déplacer SSH sur un port non-standard** (ex: 2222). Cela réduit drastiquement les logs de tentatives de brute-force (les bots scannent surtout le 22).

Éditez `/etc/ssh/sshd_config` :

```bash
sudo nano /etc/ssh/sshd_config
```

Modifiez ces lignes :

```ini
# Désactiver l'accès root direct
PermitRootLogin no

# Désactiver l'authentification par mot de passe (Clés UNIQUEMENT)
PasswordAuthentication no

# Changer le port (choisissez un nombre entre 1024 et 65535)
Port 2222
```

**⚠️ ATTENTION : Ne redémarrez pas SSH tout de suite !** Vous devez d'abord ouvrir le firewall, sinon vous serez enfermé dehors.

### C. Ajuster le Firewall et SELinux (Critique)

Si vous changez le port, vous devez prévenir le système.

**1. Ouvrir le port dans le Firewall :**

*   **Debian/Ubuntu (UFW) :**
    ```bash
    sudo ufw allow 2222/tcp
    sudo ufw reload
    ```
*   **CentOS/RHEL (Firewalld) :**
    ```bash
    sudo firewall-cmd --permanent --add-port=2222/tcp
    sudo firewall-cmd --reload
    ```

**2. Gérer SELinux (CentOS/RHEL uniquement) :**
Si SELinux est actif (ce qui est recommandé), il bloquera SSH sur un port non-standard. Autorisez-le :
```bash
sudo dnf install policycoreutils-python-utils
sudo semanage port -a -t ssh_port_t -p tcp 2222
```

**3. Redémarrer SSH :**
Maintenant que la voie est libre, appliquez la config.
```bash
sudo systemctl restart sshd
```

### D. Comment se connecter au nouveau port ?

Votre ancienne commande `ssh user@ip` ne fonctionnera plus (elle vise le port 22 par défaut).

**Méthode manuelle :**
```bash
ssh -p 2222 operateur@ip-du-serveur
```

**Méthode automatique (recommandée) :**
Créez un fichier `~/.ssh/config` sur votre **ordinateur local** :

```bash
nano ~/.ssh/config
```

Ajoutez-y :
```ssh
Host mon-serveur
    HostName ip-du-serveur
    User operateur
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
```

Désormais, tapez simplement `ssh mon-serveur` pour vous connecter.

**⚠️ IMPORTANT :** Ne fermez pas votre terminal actuel ! Ouvrez un nouveau terminal et testez la connexion. Si vous vous êtes trompé, vous gardez une session active pour réparer.

## 3. Le Mur (Firewall)

Un serveur ne doit exposer que ce qui est strictement nécessaire. Par défaut, tout doit être bloqué.

### Debian / Ubuntu (UFW)

```bash
sudo apt install ufw
sudo ufw default deny incoming
sudo ufw default allow outgoing
# Note : Si vous avez changé le port SSH à l'étape précédente,
# assurez-vous qu'il est bien autorisé (ex: sudo ufw allow 2222/tcp)
sudo ufw enable
```

### CentOS / RHEL (Firewalld)

Sur ces systèmes, `firewalld` est le standard.

```bash
sudo systemctl enable --now firewalld

# Vérifiez vos ports ouverts
sudo firewall-cmd --list-all

# Recharger pour appliquer si besoin
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

## 6. Bonus : Audit & Monitoring

Sécuriser, c'est bien. Surveiller, c'est mieux.

### Logwatch (Rapport quotidien)
Cet outil analyse vos logs et vous envoie un résumé par mail chaque matin (tentatives SSH, erreurs sudo, espace disque).

```bash
# Debian/Ubuntu
sudo apt install logwatch

# CentOS/RHEL
sudo dnf install logwatch
```
Configurez l'email de réception dans `/usr/share/logwatch/default.conf/logwatch.conf` (copiez-le dans `/etc/logwatch/conf/` avant modification).

### Rkhunter (Chasseur de Rootkits)
Il scanne le système à la recherche de fichiers modifiés ou de signatures de rootkits connus.

```bash
# Debian/Ubuntu
sudo apt install rkhunter

# CentOS/RHEL (via EPEL)
sudo dnf install rkhunter
```
Lancez un scan manuel : `sudo rkhunter --check`.

## Résumé du Protocole

1.  Créer un utilisateur `sudo`.
2.  Installer sa clé SSH.
3.  Interdire `root` et les mots de passe dans SSH.
4.  Activer le Firewall (UFW) en n'ouvrant que le strict nécessaire.
5.  Installer Fail2Ban.

Votre serveur n'est pas invulnérable, mais il ne s'offre plus au premier venu. Vous êtes passé d'une maison porte ouverte à un bunker verrouillé.

**STATUT : SÉCURITÉ_ACTIVE**
