# TP inscription

## Rendu

A rendre pour le 1/09/2019 sur GitHub @centvingt.

## Livrables

Vous devrez rendre un site servi par Express comportant :
1. une page d’inscription,
1. une page d’adiministration.

### L’inscription

#### Côté client

L’utilisateur souhaitant s’inscrire :
1. se rend sur `/signup` qui affiche un formulaire,
1. il remplit le formulaire et l’envoie,
1. il reçoit un e-mail contenant un lien de validation,
1. il clique sur ce lien de validation qui ouvre une page dans son navigateur,
1. cette page contient un message de confirmation de son inscription si le  lien est validé dans les 24 h.

#### Côté serveur

Quand le serveur reçoit une requête du formulaire d’inscription :
1. il vérifie que le nom choisi par l’utilisateur n’est pas déjà pris,
1. il génère un token d’une vingtaine de caractères,
1. il enregistre le nom, le mot de passe et le token dans une collection d’utilisateurs temporaires,
1. il envoie à l’utilisateur un e-mail avec un lien de validation dont l’URL contient le token et qui expirera dans 24 h.

Quand le serveur reçoit une requête de validation :
1. il récupère le token dans un paramètre de l’URL,
1. il recherche dans la collection un utilisateur ayant un token correspondant à celui du paramètre de l’URL.

Si le token est trouvé :
1. l’utilisateur est effacé des utilisateurs temporaires,
1. l’utilisateur est ajouté aux utilisateurs définitifs,
1. la page de validation affiche que l’utilisateur est bien inscrit.

### La page d’administration

La page d’administration n’est disponible que si l’utilisateur est authentifié avec :
- identifiant : admin,
- mot de passe : admin.

Elle affiche le nom et l’e-mail de tous les utilisateurs.

La page d’administration nécessite :
1. un formulaire de connexion,
1. un bouton de déconnexion.
