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

## :sparkles: Aper&ccedil;u

SlashCmd est un bot Discord complet et moderne utilisant exclusivement les **Slash Commands**. Il dispose d'un syst&egrave;me de permissions hi&eacute;rarchique (Buyer > Owner > Whitelist) et de **39 commandes** r&eacute;parties en 4 cat&eacute;gories.

---

## :crown: Administration

> Commandes r&eacute;serv&eacute;es aux buyers et owners du bot.

| Commande | Description |
|:---------|:------------|
| `/owner` | G&eacute;rer les owners du bot *(add / remove / list / clear)* |
| `/whitelist` | G&eacute;rer la whitelist *(add / remove / list / clear)* |
| `/blacklist` | G&eacute;rer la blacklist *(add / remove / list / clear)* |

## :gear: Gestion

> Configuration et personnalisation du serveur.

| Commande | Description |
|:---------|:------------|
| `/emoji` | Ajouter des emojis depuis un autre serveur ou une URL |
| `/setsuggest` | D&eacute;finir le salon des suggestions |
| `/soutien` | Attribuer un r&ocirc;le automatiquement selon le statut |

## :shield: Mod&eacute;ration

> 23 outils de mod&eacute;ration pour g&eacute;rer votre serveur.

<details>
<summary><b>Sanctions</b></summary>

| Commande | Description |
|:---------|:------------|
| `/ban` | Bannir un utilisateur |
| `/unban` | D&eacute;bannir un utilisateur |
| `/kick` | Expulser un utilisateur |
| `/mute` | Mute un utilisateur (timeout) |
| `/unmute` | Unmute un utilisateur |
| `/warn` | G&eacute;rer les avertissements *(add / remove / list / clear)* |
| `/derank` | Retirer tous les r&ocirc;les d'un utilisateur |

</details>

<details>
<summary><b>Gestion des salons</b></summary>

| Commande | Description |
|:---------|:------------|
| `/clear` | Supprimer des messages en masse (1-100) |
| `/lock` | Verrouiller un salon textuel |
| `/unlock` | D&eacute;verrouiller un salon textuel |
| `/renew` | Recr&eacute;er un salon &agrave; l'identique |
| `/slowmode` | D&eacute;finir le mode lent |
| `/say` | Envoyer un message via le bot |

</details>

<details>
<summary><b>Informations</b></summary>

| Commande | Description |
|:---------|:------------|
| `/serverinfo` | Informations d&eacute;taill&eacute;es du serveur |
| `/roleinfo` | Informations et permissions d'un r&ocirc;le |
| `/channelinfo` | Informations d'un salon (texte / vocal / cat&eacute;gorie) |
| `/banlist` | Liste pagin&eacute;e des bannissements |

</details>

<details>
<summary><b>Membres & R&ocirc;les</b></summary>

| Commande | Description |
|:---------|:------------|
| `/alladmin` | Liste des administrateurs |
| `/allbot` | Liste des bots |
| `/adminrole` | Liste des r&ocirc;les administrateur |
| `/massrole` | Ajouter/retirer un r&ocirc;le &agrave; tous les membres |
| `/voicemove` | D&eacute;placer les membres d'un salon vocal |
| `/server` | G&eacute;rer les serveurs du bot *(list / invite / leave)* |

</details>

## :pushpin: Utilitaire

> Commandes utilitaires et informations.

| Commande | Description |
|:---------|:------------|
| `/avatar` | Afficher l'avatar d'un utilisateur *(PNG, JPG, WEBP, GIF)* |
| `/banner` | Afficher la banni&egrave;re d'un utilisateur |
| `/userinfo` | Informations d&eacute;taill&eacute;es d'un utilisateur |
| `/botinfo` | Statistiques et informations du bot |
| `/ping` | Latence du bot et du websocket |
| `/calcul` | Calculatrice interactive avec boutons |
| `/snipe` | R&eacute;cup&eacute;rer le dernier message supprim&eacute; |
| `/voice` | Statistiques des salons vocaux |
| `/suggestion` | Soumettre une suggestion avec syst&egrave;me de vote |
| `/help` | Menu d'aide interactif par cat&eacute;gorie |

---

## :lock: Syst&egrave;me de Permissions

```
Buyer (config.json)
  └── Owner (par serveur)
        └── Whitelist (par serveur)
```

| R&ocirc;le | Acc&egrave;s | Attribution |
|:-----|:------|:-----------|
| **Buyer** | Toutes les commandes | D&eacute;fini dans `config.json` |
| **Owner** | Administration + Mod&eacute;ration + Gestion | `/owner add @user` |
| **Whitelist** | Mod&eacute;ration | `/whitelist add @user` |

---

## :rocket: Installation

**1.** Cloner le repository
```bash
git clone https://github.com/KhdDev/slashcmdbot.git
cd slashcmdbot
```

**2.** Installer les d&eacute;pendances
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

| D&eacute;pendance | Utilisation |
|:-----------|:------------|
| [discord.js](https://discord.js.org/) v14 | Framework Discord |
| [mathjs](https://mathjs.org/) | Calculatrice |
| [ms](https://github.com/vercel/ms) | Conversion de dur&eacute;es |
| [axios](https://axios-http.com/) | Requ&ecirc;tes HTTP |

</div>

---

<div align="center">

**D&eacute;velopp&eacute; par [kml69190](https://github.com/KhdDev)**

<br>

<a href="https://github.com/KhdDev/slashcmdbot/stargazers">
  <img src="https://img.shields.io/github/stars/KhdDev/slashcmdbot?style=social" alt="Stars">
</a>

</div>
