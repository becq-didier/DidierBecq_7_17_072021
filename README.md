Pour commencer à utiliser la CLI de Vue, la version de Node 8.9
ou supérieure est nécessaire (v8.11.0 ou + est recommandée).
L'installation sur votre machine se fait en mettant cette ligne dans votre terminal
(ou Windows PowerShell si vous êtes sur Windows) :

npm install -g @vue/cli
# OU (selon si vous avez l’habitude d’utiliser npm ou yarn)
yarn global add @vue/cli

Une fois l'installation terminée, vous devriez être en mesure d'exécuter :
vue --version
@vue/cli 4.5.13

Créer un nouveau projet avec Vue CLI est une opération simple. Lançons-nous et créons un projet ensemble :
vue create my-first-vue-cli-app
Vous devriez être invité à choisir un preset ( vous pouvez le traduire par "préréglage") :

Un preset correspond aux options préconfigurées installées automatiquement avec chaque application. Comme votre installation de Vue CLI est nouvelle, vous verrez qu'elle ne dispose que d'un preset par défaut (Babel, ESLint), ainsi que d'une option permettant de sélectionner les fonctionnalités manuellement. Pour parcourir l'ensemble des configurations de Vue CLI, utilisez la touche "flèche vers le bas" pour déplacer la sélection, et appuyez sur Entrée pour choisir notre sélection.

Une fois que vous avez choisi « Manually select features » (sélectionner les fonctionnalités manuellement), l'écran d'accueil suivant devrait apparaître :
--------
Les options présentées ici dépassent certes le cadre de ce cours, mais vous pouvez voir qu'il existe de nombreuses options pour configurer vos projets. Passons maintenant au préprocesseur CSS.

Il vous sera utile si vous souhaitez activer le « mode historique » pour le routeur. Tapez  n  et appuyez sur la touche Retour.

Pour notre préprocesseur CSS, nous choisirons  Sass/SCSS (with node-sass)

Pour notre linter, nous choisirons  ESLint with error prevention only

Pour la configuration de lint, choisissez Lint on save

Pour l'emplacement souhaité de la configuration, choisissez In dedicated config files

Vous disposez également d'une option permettant de sauvegarder cette configuration pour de futures applications, mais comme il s'agit d'une configuration temporaire, nous allons saisir  N  pour que notre configuration ne soit pas sauvegardée comme preset.


----------
$ cd my-first-vue-cli-app
$ npm run serve

