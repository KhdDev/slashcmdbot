# SlashCmd - Bot Discord Multifonction

Un bot Discord complet en **Slash Commands** avec systeme de permissions (Owner / Whitelist), moderation avancee, gestion de serveur et commandes utilitaires.

## Fonctionnalites

### Administration (3 commandes)
| Commande | Description |
|----------|-------------|
| `/owner` | Gerer les owners du bot (add, remove, list, clear) |
| `/whitelist` | Gerer la whitelist (add, remove, list, clear) |
| `/blacklist` | Gerer la blacklist (add, remove, list, clear) |

### Gestion (3 commandes)
| Commande | Description |
|----------|-------------|
| `/emoji` | Ajouter des emojis sur le serveur |
| `/setsuggest` | Configurer le salon des suggestions |
| `/soutien` | Configurer le systeme de role par statut |

### Moderation (23 commandes)
| Commande | Description |
|----------|-------------|
| `/ban` `/unban` | Bannir / Debannir un utilisateur |
| `/kick` | Expulser un utilisateur |
| `/mute` `/unmute` | Mute / Unmute un utilisateur (timeout) |
| `/warn` | Gerer les avertissements (add, remove, list, clear) |
| `/derank` | Retirer tous les roles d'un utilisateur |
| `/clear` | Supprimer des messages en masse |
| `/lock` `/unlock` | Verrouiller / Deverrouiller un salon |
| `/renew` | Recreer un salon a l'identique |
| `/slowmode` | Definir le mode lent d'un salon |
| `/say` | Faire parler le bot |
| `/serverinfo` | Informations detaillees du serveur |
| `/roleinfo` | Informations et permissions d'un role |
| `/channelinfo` | Informations d'un salon |
| `/banlist` | Liste paginee des bannissements |
| `/alladmin` | Liste des administrateurs du serveur |
| `/allbot` | Liste des bots du serveur |
| `/adminrole` | Liste des roles avec la permission Admin |
| `/massrole` | Ajouter/retirer un role a tous les membres |
| `/voicemove` | Deplacer tous les membres d'un vocal |
| `/server` | Liste des serveurs, invitations, quitter |

### Utilitaire (10 commandes)
| Commande | Description |
|----------|-------------|
| `/avatar` | Afficher l'avatar d'un utilisateur (PNG, JPG, WEBP, GIF) |
| `/banner` | Afficher la banniere d'un utilisateur |
| `/userinfo` | Informations d'un utilisateur |
| `/botinfo` | Informations et statistiques du bot |
| `/ping` | Latence du bot et du websocket |
| `/calcul` | Calculatrice interactive avec boutons |
| `/snipe` | Recuperer le dernier message supprime |
| `/voice` | Statistiques des salons vocaux |
| `/suggestion` | Envoyer une suggestion avec vote |
| `/help` | Menu d'aide interactif par categorie |

## Systeme de Permissions

Le bot utilise un systeme de permissions hierarchique :

```
Buyer (config.json) > Owner (par serveur) > Whitelist (par serveur)
```

- **Buyer** : Defini dans `config.json`, acces total
- **Owner** : Ajoute via `/owner add`, acces a la majorite des commandes
- **Whitelist** : Ajoute via `/whitelist add`, acces aux commandes de moderation

## Installation

### Prerequis
- [Node.js](https://nodejs.org/) v16.9.0 ou superieur

### Etapes

1. **Cloner le repository**
```bash
git clone https://github.com/KhdDev/SlashCmd.git
cd SlashCmd
```

2. **Installer les dependances**
```bash
npm install
```

3. **Configurer le bot**

Renommer `config.example.json` en `config.json` et remplir :
```json
{
    "token": "VOTRE_TOKEN",
    "prefix": "=",
    "colors": "#2f3136",
    "owners": ["VOTRE_ID_DISCORD"]
}
```

4. **Lancer le bot**
```bash
node index.js
```

## Technologies

- [discord.js](https://discord.js.org/) v14
- [mathjs](https://mathjs.org/) - Calculatrice
- [ms](https://github.com/vercel/ms) - Conversion de durees

## Auteur

Developpe par [kml69190](https://github.com/KhdDev)
