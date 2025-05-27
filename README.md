## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

## Get started

ip parent: 192.168.1.16
ip appart : 192.168.1.70
ip pro : 192.168.1.56

## A modifier

- les couleurs dans tailwind.config.js mais aussi dans constants/colors
- bug formulaire create riddle
- couleurs background et loading spin
- revoir la gestion des erreurs
- ajouter un toast
- ajouter une modal de confirm pour les actions de suppression
- faire image et audio pour les indices
- nouvelles fonts
- changer splash screen et logo
- ajouter verif auteur sur certaines routes
- ajouter verif joueur en jeu sur game
- ajouter job aggregation score (faire une commande pour démo)
- nettoyer tous les commentaires, regarder les TODO
- mettre des identifiant pour ddb, debug à false true
- faire le CI, faire les tests
- faire page profil
- faire page QR codes
- faire location user sur map, recherche par périmètre
- corriger les stores, ajouter les conditions de refetch
- faire nouveau seeder plus complet
- comparer Auth::id() et auth()->id()
- voir si il faut vérifier personne connecté dans controllers vu qu'il y a déjà un guard
- changement password, password oublié, ...
- name unique
- ajouter description à user
- changer hint_used_number en extra_hints
- changer lastest active session step
- changer getTotalDuration
- mettre des policies dans controller plutot que vérifier si user est creator
- rajouter sur tous les update et delete un check de si c'est la derniere étape/indice et donc mettre en draft; rajouter le check quand on passe en publié
- changer les controler de home
- télécharger les qr codes