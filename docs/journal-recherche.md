# Journal de recherche

> Chaque recherche utile : ce que vous cherchiez, où (cours, [MDN](https://developer.mozilla.org/fr/docs/Web/JavaScript), [Node.js](https://nodejs.org/api/), un camarade, une IA…), ce que vous avez compris. Ce que vous gardez, vous devez pouvoir l'expliquer.

| Ce que je cherchais | Où | Ce que j'ai compris | Utilisé dans |
| --Ce que je cherchais	Où	Ce que j’ai compris	Utilisé dans
Comment lire un fichier sans bloquer le programme- | Node.js (doc fs)---fs.readFile est asynchrone : il lance la lecture et appelle une fonction de rappel quand c’est fini. readFileSync bloque tout jusqu’à la fin. | lireConfig.js, ligne 12--- | --- |


| Différence entre map et forEach | MDN + IA pour un exemple|map renvoie un nouveau tableau transformé, forEach ne renvoie rien (il sert aux effets de bord comme afficher) |traiterNotes.js, fonction moyennes() |
|
