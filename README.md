<div align="center">

# SlashCmd

**Bot Discord Multifonction en Slash Commands**

[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org/)
[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

<br>

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&pause=1000&color=5865F2&center=true&vCenter=true&random=false&width=500&lines=39+commandes+slash;Syst%C3%A8me+de+permissions+avanc%C3%A9;Mod%C3%A9ration+compl%C3%A8te;Interface+moderne+avec+embeds" alt="Typing SVG" />

<br>

</div>

---

## :sparkles: Apercu

SlashCmd est un bot Discord complet et moderne utilisant exclusivement les **Slash Commands**. Il dispose d'un systeme de permissions hierarchique (Buyer > Owner > Whitelist) et de **39 commandes** reparties en 4 categories.

---

## :crown: Administration

> Commandes reservees aux buyers et owners du bot.

| Commande | Description |
|:---------|:------------|
| `/owner` | Gerer les owners du bot *(add / remove / list / clear)* |
| `/whitelist` | Gerer la whitelist *(add / remove / list / clear)* |
| `/blacklist` | Gerer la blacklist *(add / remove / list / clear)* |

## :gear: Gestion

> Configuration et personnalisation du serveur.

| Commande | Description |
|:---------|:------------|
| `/emoji` | Ajouter des emojis depuis un autre serveur ou une URL |
| `/setsuggest` | Definir le salon des suggestions |
| `/soutien` | Attribuer un role automatiquement selon le statut |

## :shield: Moderation

> 23 outils de moderation pour gerer votre serveur.

<details>
<summary><b>Sanctions</b></summary>

| Commande | Description |
|:---------|:------------|
| `/ban` | Bannir un utilisateur |
| `/unban` | Debannir un utilisateur |
| `/kick` | Expulser un utilisateur |
| `/mute` | Mute un utilisateur (timeout) |
| `/unmute` | Unmute un utilisateur |
| `/warn` | Gerer les avertissements *(add / remove / list / clear)* |
| `/derank` | Retirer tous les roles d'un utilisateur |

</details>

<details>
<summary><b>Gestion des salons</b></summary>

| Commande | Description |
|:---------|:------------|
| `/clear` | Supprimer des messages en masse (1-100) |
| `/lock` | Verrouiller un salon textuel |
| `/unlock` | Deverrouiller un salon textuel |
| `/renew` | Recreer un salon a l'identique |
| `/slowmode` | Definir le mode lent |
| `/say` | Envoyer un message via le bot |

</details>

<details>
<summary><b>Informations</b></summary>

| Commande | Description |
|:---------|:------------|
| `/serverinfo` | Informations detaillees du serveur |
| `/roleinfo` | Informations et permissions d'un role |
| `/channelinfo` | Informations d'un salon (texte / vocal / categorie) |
| `/banlist` | Liste paginee des bannissements |

</details>

<details>
<summary><b>Membres & Roles</b></summary>

| Commande | Description |
|:---------|:------------|
| `/alladmin` | Liste des administrateurs |
| `/allbot` | Liste des bots |
| `/adminrole` | Liste des roles administrateur |
| `/massrole` | Ajouter/retirer un role a tous les membres |
| `/voicemove` | Deplacer les membres d'un salon vocal |
| `/server` | Gerer les serveurs du bot *(list / invite / leave)* |

</details>

## :pushpin: Utilitaire

> Commandes utilitaires et informations.

| Commande | Description |
|:---------|:------------|
| `/avatar` | Afficher l'avatar d'un utilisateur *(PNG, JPG, WEBP, GIF)* |
| `/banner` | Afficher la banniere d'un utilisateur |
| `/userinfo` | Informations detaillees d'un utilisateur |
| `/botinfo` | Statistiques et informations du bot |
| `/ping` | Latence du bot et du websocket |
| `/calcul` | Calculatrice interactive avec boutons |
| `/snipe` | Recuperer le dernier message supprime |
| `/voice` | Statistiques des salons vocaux |
| `/suggestion` | Soumettre une suggestion avec systeme de vote |
| `/help` | Menu d'aide interactif par categorie |

---

## :lock: Systeme de Permissions

```
Buyer (config.json)
  └── Owner (par serveur)
        └── Whitelist (par serveur)
```

| Role | Acces | Attribution |
|:-----|:------|:-----------|
| **Buyer** | Toutes les commandes | Defini dans `config.json` |
| **Owner** | Administration + Moderation + Gestion | `/owner add @user` |
| **Whitelist** | Moderation | `/whitelist add @user` |

---

## :rocket: Installation

**1.** Cloner le repository
```bash
git clone https://github.com/KhdDev/slashcmdbot.git
cd slashcmdbot
```

**2.** Installer les dependances
```bash
npm install
```

**3.** Configurer le bot
```bash
cp config.example.json config.json
```
Remplir `config.json` avec votre token et votre ID Discord :
```json
{
    "token": "VOTRE_TOKEN",
    "prefix": "=",
    "colors": "#2f3136",
    "owners": ["VOTRE_ID_DISCORD"]
}
```

**4.** Lancer le bot
```bash
node index.js
```

---

## :wrench: Technologies

<div align="center">

| Dependance | Utilisation |
|:-----------|:------------|
| [discord.js](https://discord.js.org/) v14 | Framework Discord |
| [mathjs](https://mathjs.org/) | Calculatrice |
| [ms](https://github.com/vercel/ms) | Conversion de durees |
| [axios](https://axios-http.com/) | Requetes HTTP |

</div>

---

<div align="center">

**Developpe par [kml69190](https://github.com/KhdDev)**

<br>

<a href="https://github.com/KhdDev/slashcmdbot/stargazers">
  <img src="https://img.shields.io/github/stars/KhdDev/slashcmdbot?style=social" alt="Stars">
</a>

</div>
