// Synthèse des dépenses enregistrées.
// Fiche : fiches/5-synthese.md · Vérifier : npm run test:synthese

// Renvoie la somme des coûts, en FCFA. Liste vide : 0.
export function totalCouts(operations) {
 return operations.reduce((total,operation) => total+operation.coutFCFA,0)
}

// Renvoie un objet : pour chaque parcelle, le nombre d'opérations et le total de leurs coûts.
// Exemple : { P1: { nombre: 4, total: 15500 }, P2: { nombre: 3, total: 9500 } }
// Liste vide : {} (un objet vide).
export function syntheseParParcelle(operations) {
  const objet={}
  for (const operation of operations){
    if (objet [operation.parcelle]===undefined){
      objet [operation.parcelle]={nombre:0,total:0}
    }
    objet [operation.parcelle].nombre += 1
    objet [operation.parcelle].total += operation.coutFCFA
  } 
  return objet
}

// Renvoie { min, max } des coûts, ou null si la liste est vide.
// Exemple : { min: 1500, max: 8000 }
export function coutMinMax(operations) {
if (operations.length===0){
  return null;
}
const couts = operations.map((op) => op.coutFCFA )
return {
    min:Math.min(...couts),
    max :Math.max(...couts),

}
  

}
