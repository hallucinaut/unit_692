---
title: 'Cheat Sheet Linux Ultime : Bash, Red Hat, Arch & Debian'
date: '2026-02-08'
author: 'UNIT_692'
excerpt: "L'encyclopédie définitive des commandes Linux. Bash, gestionnaires de paquets, kernel, sécurité et optimisation système."
tags: ['linux', 'bash', 'redhat', 'arch', 'sysadmin', 'devops', 'security']
---

En administration système, la maîtrise des outils en ligne de commande est le socle de toute architecture résiliente. Voici une référence exhaustive des commandes indispensables.

## 1. Maîtrise de Bash & Shell (Avancé)

### Raccourcis et Astuces
- `Ctrl + R` : Recherche récursive dans l'historique.
- `Ctrl + Z` / `fg` : Suspendre un processus / Reprendre en avant-plan.
- `bg` : Reprendre un processus suspendu en arrière-plan.
- `disown -h [job_id]` : Détacher un processus du shell (survit à la fermeture).
- `tmux` / `screen` : Multiplexeurs de terminaux (sessions persistantes).
- `alias ll='ls -lah --color=auto'` : Créer un raccourci permanent (à mettre dans `.bashrc`).

### Redirections et Pipes Complexes
- `command > file.log 2>&1` : Rediriger stdout et stderr vers le même fichier.
- `command | tee file.log` : Afficher à l'écran ET écrire dans un fichier.
- `find . -name "*.txt" -exec grep "pattern" {} +` : Rechercher dans les fichiers trouvés.
- `xargs` : Transformer une sortie en arguments pour une autre commande (ex: `find . -name "*.tmp" | xargs rm`).

## 2. Gestion des Paquets (Toutes Distributions)

### Red Hat / Fedora / RHEL (DNF)
- `sudo dnf install [pkg]` : Installer.
- `sudo dnf remove [pkg]` : Supprimer.
- `sudo dnf upgrade` : Mettre à jour le système.
- `dnf history undo [id]` : Annuler une transaction spécifique.
- `dnf repolist` : Lister les dépôts activés.
- `dnf check-update` : Vérifier les mises à jour sans les installer.

### Arch Linux (Pacman & AUR)
- `sudo pacman -Syu` : Mise à jour totale.
- `sudo pacman -S [pkg]` : Installer.
- `sudo pacman -Rs [pkg]` : Supprimer avec dépendances inutiles.
- `pacman -Qi [pkg]` : Infos détaillées sur un paquet installé.
- `pacman -Ql [pkg]` : Lister tous les fichiers installés par un paquet.
- `checkupdates` : Lister les mises à jour disponibles (via `pacman-contrib`).

### Debian / Ubuntu (APT)
- `sudo apt update && sudo apt upgrade` : Cycle de mise à jour standard.
- `sudo apt dist-upgrade` : Gérer intelligemment les changements de dépendances.
- `apt search [query]` : Rechercher un paquet.
- `apt show [pkg]` : Détails complets.
- `sudo apt autoremove` : Nettoyer les dépendances orphelines.

## 3. Administration Système & Processus

### Gestion des Processus
- `top` / `htop` / `btop` : Surveillance interactive des ressources (CPU, RAM).
- `ps auxf` : Afficher l'arbre des processus.
- `pgrep -l [name]` : Trouver le PID par le nom.
- `pkill -9 [name]` : Tuer tous les processus par nom.
- `kill -l` : Lister tous les signaux disponibles (SIGTERM, SIGKILL, SIGHUP).
- `nice -n 10 command` : Lancer avec une priorité réduite.
- `renice +5 -p [pid]` : Changer la priorité d'un processus en cours.
- `lsof -i :80` : Lister les fichiers/processus utilisant le port 80.
- `strace -p [pid]` : Tracer les appels système d'un processus.
- `crontab -e` : Éditer les tâches planifiées (cron jobs).

### Logs et Surveillance (Systemd)
- `journalctl -p err..emerg` : Afficher uniquement les erreurs critiques.
- `journalctl -u sshd --since today` : Logs SSH du jour.
- `systemctl list-dependencies [service]` : Voir l'arbre des dépendances d'un service.
- `systemctl set-property [service] CPUQuota=50%` : Limiter dynamiquement les ressources.

## 4. Réseau & Sécurité

### Outils Réseau Modernes
- `ip -br a` : Vue compacte des interfaces.
- `ip route add default via 192.168.1.1` : Ajouter une route.
- `ss -tulpn` : Sockets (remplace `netstat`).
- `mtr google.com` : Traceroute + Ping en temps réel.
- `curl -O [URL]` : Télécharger un fichier.
- `wget [URL]` : Télécharger un fichier (récursif avec `-r`).
- `tcpdump -i any 'tcp port 80'` : Sniffer le trafic HTTP.
- `nmap -sP 192.168.1.0/24` : Scan de découverte sur le réseau local.

### Sécurité et Permissions
- `chmod 600 [file]` : Lecture/Écriture pour le propriétaire uniquement.
- `chmod 755 [dir]` : Standard pour les répertoires.
- `chown -R user:group [dir]` : Changement récursif de propriétaire.
- `ufw status` / `ufw allow 22/tcp` : Gestion simple du firewall (Debian/Ubuntu).
- `firewall-cmd --add-port=80/tcp --permanent` : Firewall Red Hat.
- `last` : Voir les dernières connexions utilisateurs.

## 5. Stockage, Archivage et Compression

### Disques et Systèmes de Fichiers
- `lsblk -o NAME,FSTYPE,SIZE,MOUNTPOINT` : Liste personnalisée des blocs.
- `df -h` : Espace disque disponible.
- `du -sh [dir]` : Taille totale d'un dossier.
- `fdisk -l` / `gdisk -l` : Tables de partitions.
- `mount /dev/sdb1 /mnt` : Monter une partition.

### Archivage (Tar, Zip, Sync)
- `tar -cvf archive.tar [dir]` : Créer une archive sans compression.
- `tar -xvf archive.tar` : Extraire.
- `tar -czvf archive.tar.gz [dir]` : Compresser avec Gzip.
- `tar -cjvf archive.tar.bz2 [dir]` : Compresser avec Bzip2 (meilleur taux).
- `zip -r archive.zip [dir]` : Format Zip standard.
- `rsync -avz [source] [dest]` : Synchronisation efficace de fichiers/dossiers.

## 6. Informations Matériel (Hardware)

- `lscpu` : Détails du processeur.
- `lsusb` / `lspci` : Périphériques USB et PCI.
- `free -h` : État de la mémoire vive (RAM).
- `dmidecode -t system` : Infos BIOS/Carte mère (root requis).
- `sensors` : Températures et ventilateurs (via `lm-sensors`).

## 7. SSH & Accès Distant

- `ssh-keygen -t ed25519` : Générer une clé sécurisée moderne.
- `ssh-copy-id user@host` : Copier sa clé publique vers un serveur.
- `ssh -L 8080:localhost:80 user@host` : Tunneling SSH (Local Port Forwarding).
- `scp file.txt user@host:/path/` : Copie sécurisée de fichiers.

## 8. Traitement de Texte & Parsing (Power Tools)

- `grep -Ev "^#|^$"` : Afficher un fichier sans les commentaires ni les lignes vides.
- `sed -n '5,10p' file` : Afficher uniquement les lignes 5 à 10.
- `awk '{print $NF}' file` : Afficher le dernier champ de chaque ligne.
- `jq . /path/to/file.json` : Formater et afficher du JSON proprement.
- `sort | uniq -c | sort -nr` : Compter les occurrences et trier par fréquence.
- `cut -d':' -f1 /etc/passwd` : Extraire les noms d'utilisateurs.

## 9. Noyau, Modules & Boot (Kernel)

- `uname -a` : Informations complètes sur le noyau et l'architecture.
- `dmesg -T | tail` : Voir les derniers messages du tampon circulaire du noyau avec horodatage.
- `lsmod` : Lister les modules du noyau chargés.
- `sudo modprobe [module]` : Charger un module du noyau.
- `sudo modprobe -r [module]` : Décharger un module.
- `sysctl -a` : Lister tous les paramètres du noyau configurables.
- `lsinitrd` : Examiner le contenu de l'image initramfs.

## 10. Virtualisation & Conteneurs (Basiques)

- `docker ps -a` : Lister tous les conteneurs (actifs et arrêtés).
- `docker images` : Lister les images locales.
- `docker exec -it [container] bash` : Entrer dans un conteneur en cours d'exécution.
- `docker-compose up -d` : Lancer une pile de services en arrière-plan.
- `podman machine start` : Démarrer la VM Podman (sur macOS/Windows/Fedora).
- `virsh list --all` : Lister les VMs KVM/Qemu.

## 11. Développement & Versionnement (Git)

- `git status` : État des fichiers suivis.
- `git diff` : Voir les modifications non indexées.
- `git log --oneline --graph --all` : Visualiser l'historique des commits.
- `git checkout -b [branch]` : Créer et basculer sur une nouvelle branche.
- `git commit -am "message"` : Indexer et committer les fichiers modifiés.
- `git remote -v` : Voir les dépôts distants configurés.

## 12. Environnement & Variables

- `export VAR="valeur"` : Définir une variable d'environnement pour la session actuelle.
- `env` / `printenv` : Afficher toutes les variables d'environnement.
- `source ~/.bashrc` : Recharger la configuration du shell sans se déconnecter.
- `which [command]` : Localiser le binaire d'une commande dans le PATH.
- `whereis [command]` : Localiser le binaire, les sources et les pages de manuel.
