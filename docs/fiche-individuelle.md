# Fiche individuelle

> Une page, avant la livraison. Prénom, nom, compte GitHub : 
ABO KOUAME JOSUE ,joshmarvin

1. **Une fonction que j'ai écrite**, et comment elle marche :
 export function listerOperations(operations) {
  if (operations.length === 0) {
    return 'Aucune opération enregistrée.';
  }
  return operations.map(formaterOperation).join('\n');
 
}
Ma fonction listerOperations sert à afficher toutes les opérations du registre sous forme de texte.

Elle reçoit un tableau d’opérations et renvoie une chaîne de caractères.

Elle fonctionne en deux temps. D’abord, elle vérifie si le tableau est vide : dans ce cas, elle renvoie directement le message  Aucune opération enregistrée.. Sinon, elle utilise .map pour appliquer formaterOperation à chaque opération, ce qui donne un tableau de lignes de texte. Ensuite, .join('\n') assemble ces lignes en un seul texte, avec un saut de ligne entre chacune.
2. **Une difficulté, et sa solution** : 
formaterOperation affichait undefined
En codant formaterOperation, le test échouait : ma fonction renvoyait undefined à la place de arrosage et de 2000. La cause était de mauvais noms de propriétés : j’avais écrit operation.type et operation.montant, alors que les objets utilisent operation.operation et operation.coutFCFA. En JavaScript, lire une propriété inexistante ne génère pas d’erreur, on obtient simplement undefined.

J’ai identifié les bons noms grâce au message du test (valeur reçue et attendue) et à l’exemple de saisie de la fiche. Après correction, le test passe. J’en retiens qu’il faut vérifier la structure des données avant de coder, et qu’un undefined dans un résultat signale souvent une faute de nom.

3. **L'entraide** (qui m'a aidé, qui j'ai aidé, sur quoi) : 
j ai ete aider par LOHOUIN lou freshnelle KAMAGATE junior,ZAMBLE BI BOTI,SOUMAHORO CHECK HAMED TIDIANE sur formaterOperation
j ai egalement aider Daly manuella LOHOUIN lou et Guei
