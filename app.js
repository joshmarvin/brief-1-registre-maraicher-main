// Registre des opérations maraîchères — point d'entrée : le menu.
// Lancer : node app.js
import { demander, fermerSaisie, ouvrirSaisie } from './src/saisie.js';
import { chargerJson, enregistrerJson } from './src/stockage.js';
import { OPERATIONS, ajouterOperation, formaterOperation, listerOperations, trouverParId } from './src/registre.js';
import { filtrerParCulture, filtrerParParcelle, trierParCout, trierParDate } from './src/recherche.js';
import { coutMinMax, syntheseParParcelle, totalCouts } from './src/synthese.js';
import { supprimerOperation, modifierOperation,trierParCoutDecroissant, parcelleLaPlusCouteuse } from './src/bonus.js';

const FICHIER_DONNEES = 'donnees/operations.json';
const CHAMPS = ['date', 'parcelle', 'culture', 'operation', 'coutFCFA'];

function afficherAccueil() {
  console.log('='.repeat(52));
  console.log('   REGISTRE DES OPÉRATIONS MARAÎCHÈRES');
  console.log('   Exploitation maraîchère pédagogique');
  console.log('='.repeat(52));
}

function afficherMenu() {
  console.log('');
  console.log('-'.repeat(21) + ' MENU ' + '-'.repeat(21));
  console.log('1. Ajouter une opération');
  console.log('2. Lister les opérations');
  console.log('3. Rechercher (identifiant, parcelle, culture)');
  console.log('4. Trier (coût croissant, coût decroissant, date)');
  console.log('5. Synthèse des dépenses');
  console.log('6. Supprimer une opération');
  console.log('7. Modifier une opération');
  console.log('0. Quitter');
}

function afficherErreurs(titre, erreurs) {
  console.log(titre);
  for (const erreur of erreurs) {
    console.log(`  - ${erreur}`);
  }
}

async function ajouter(operations) {
  console.log('--- Ajouter une opération ---');
  const id = await demander('Identifiant (ex. O11) : ');
  if (id === null) return;
  const date = await demander('Date (AAAA-MM-JJ) : ');
  if (date === null) return;
  const parcelle = await demander('Parcelle (ex. P1) : ');
  if (parcelle === null) return;
  const culture = await demander('Culture (ex. tomate) : ');
  if (culture === null) return;
  const operation = await demander(`Opération (${OPERATIONS.join(', ')}) : `);
  if (operation === null) return;
  const cout = await demander('Coût en FCFA : ');
  if (cout === null) return;

  const saisie = {
    id: id.trim().toUpperCase(),
    date: date.trim(),
    parcelle: parcelle.trim().toUpperCase(),
    culture: culture.trim().toLowerCase(),
    operation: operation.trim().toLowerCase(),
    coutFCFA: cout.trim(),
  };

  const erreurs = ajouterOperation(operations, saisie);
  if (erreurs.length === 0) {
    await enregistrerJson(FICHIER_DONNEES, operations);
    console.log(`Opération ${saisie.id} ajoutée. Le registre compte ${operations.length} opération(s).`);
  } else {
    afficherErreurs('Opération refusée :', erreurs);
    console.log(`Le registre compte toujours ${operations.length} opération(s).`);
  }
}

function lister(operations) {
  console.log(`--- Liste des opérations (${operations.length}) ---`);
  console.log(listerOperations(operations));
}

async function rechercher(operations) {
  console.log('--- Rechercher ---');
  console.log('1. Par identifiant');
  console.log('2. Par parcelle');
  console.log("3. Les opérations d'une culture");
  const choix = await demander('Votre choix : ');
  if (choix === null) return;

  if (choix.trim() === '1') {
    const reponse = await demander('Identifiant : ');
    if (reponse === null) return;
    const id = reponse.trim().toUpperCase();
    const trouvee = trouverParId(operations, id);
    console.log(trouvee === undefined ? `Opération ${id} introuvable.` : formaterOperation(trouvee));
  } else if (choix.trim() === '2') {
    const reponse = await demander('Parcelle : ');
    if (reponse === null) return;
    const parcelle = reponse.trim().toUpperCase();
    const resultat = filtrerParParcelle(operations, parcelle);
    console.log(`${resultat.length} opération(s) sur la parcelle ${parcelle} :`);
    console.log(listerOperations(resultat));
  } else if (choix.trim() === '3') {
    const reponse = await demander('Culture : ');
    if (reponse === null) return;
    const culture = reponse.trim().toLowerCase();
    const resultat = filtrerParCulture(operations, culture);
    console.log(`${resultat.length} opération(s) pour la culture ${culture} :`);
    console.log(listerOperations(resultat));
  } else {
    console.log('Choix inconnu : retour au menu.');
  }
}

async function trier(operations) {
  console.log('--- Trier ---');
  console.log('1. Par coût croissant');
  console.log('2. Par date, de la plus ancienne à la plus récente');
  console.log('3. Par coût decroissant');
  const choix = await demander('Votre choix : ');
  if (choix === null) return;

  if (choix.trim() === '1') {
    console.log(listerOperations(trierParCout(operations)));
  } else if (choix.trim() === '2') {
    console.log(listerOperations(trierParDate(operations)));
  } else if (choix.trim() === '3') {
    console.log(listerOperations(trierParCoutDecroissant(operations)));
  } else  console.log('Choix inconnu : retour au menu.');

}

function synthese(operations) {
  console.log('--- Synthèse des dépenses enregistrées ---');
  console.log(`Nombre d'opérations : ${operations.length}`);
  console.log(`Total des coûts : ${totalCouts(operations)} FCFA`);
  console.log('Par parcelle :');
  for (const [parcelle, donnees] of Object.entries(syntheseParParcelle(operations))) {
    console.log(`  ${parcelle} : ${donnees.nombre} opération(s), ${donnees.total} FCFA`);
  }
  const minMax = coutMinMax(operations);
  if (minMax === null) {
    console.log('Coût minimum et maximum : aucune donnée.');
  } else {
    console.log(`Coût minimum : ${minMax.min} FCFA · Coût maximum : ${minMax.max} FCFA`);
  }

  const plusCouteuse = parcelleLaPlusCouteuse(operations);
  if (plusCouteuse !== null) {
  console.log(`La parcelle la plus coûteuse est : ${plusCouteuse.parcelle} (${plusCouteuse.total} FCFA)`);
  }
  console.log ('')
  console.log('Rappel : ce sont des dépenses. Sans les revenus, elles ne mesurent pas la rentabilité.');
} 

async function supprimer(operations) {
  console.log('--- Supprimer une opération ---');
  const reponse = await demander('Identifiant : ');
  if (reponse === null) return false;
  const identifiant = reponse.trim().toUpperCase();

  if (supprimerOperation(operations, identifiant) === undefined) {
    console.log(`Opération ${identifiant} introuvable.`);
    return false;
  }

  await enregistrerJson(FICHIER_DONNEES, operations);
  console.log(`Opération ${identifiant} supprimée. Le registre compte ${operations.length} opération(s).`);
  return true;
}

async function modifier(operations) {
  console.log('--- Modifier une opération ---');

  // 1. Identifiant, vérifié tout de suite
  const reponseId = await demander('Identifiant : ');
  if (reponseId === null) return false;
  const identifiant = reponseId.trim().toUpperCase();

  if (trouverParId(operations, identifiant) === undefined) {
    console.log(`Opération ${identifiant} introuvable.`);
    return false;
  }

  // 2. Champ à modifier (insensible à la casse)
  const reponseChamp = await demander(`Champ à modifier (${CHAMPS.join(', ')}) : `);
  if (reponseChamp === null) return false;
  const champ = CHAMPS.find(
    c => c.toLowerCase() === reponseChamp.trim().toLowerCase()
  );
  if (champ === undefined) {
    console.log(`Champ inconnu : ${reponseChamp.trim()}`);
    return false;
  }

  // 3. Nouvelle valeur, normalisée comme dans ajouter()
  const reponseValeur = await demander('Nouvelle valeur : ');
  if (reponseValeur === null) return false;
  let valeur = reponseValeur.trim();
  if (champ === 'parcelle') valeur = valeur.toUpperCase();
  if (champ === 'culture' || champ === 'operation') valeur = valeur.toLowerCase();

  // 4. Modification et enregistrement
  const erreurs = modifierOperation(operations, identifiant, champ, valeur);
  if (erreurs.length > 0) {
    afficherErreurs('Modification refusée :', erreurs);
    return false;
  }

  await enregistrerJson(FICHIER_DONNEES, operations);
  console.log(`Opération ${identifiant} modifiée.`);
  return true;
}

async function main() {
  ouvrirSaisie();
  afficherAccueil();

  let operations;
  try {
    operations = await chargerJson(FICHIER_DONNEES);
    console.log(`${operations.length} opération(s) chargée(s) depuis ${FICHIER_DONNEES}.`);
  } catch (erreur) {
    if (erreur.code === 'ENOENT') {
      // Fichier absent : on démarre avec un registre vide
      console.log(`Fichier ${FICHIER_DONNEES} introuvable. Le registre démarre vide.`);
      operations = [];
    } else {
      // Fichier illisible ou JSON invalide : on s'arrête pour ne pas écraser les données
      console.log(`Impossible de lire ${FICHIER_DONNEES} : ${erreur.message}`);
      console.log('Arrêt du programme pour ne pas écraser vos données.');
      fermerSaisie();
      return;
    }
  }

  let continuer = true;
  while (continuer) {
    afficherMenu();
    const reponse = await demander('Votre choix : ');
    const choix = reponse === null ? null : reponse.trim();

    if (choix === null || choix === '0') {
      console.log('Au revoir !');
      continuer = false;
    } else {
      try {
        switch (choix) {
          case '1': await ajouter(operations); break;
          case '2': lister(operations); break;
          case '3': await rechercher(operations); break;
          case '4': await trier(operations); break;
          case '5': synthese(operations); break;
          case '6': await supprimer(operations); break;
          case '7': await modifier(operations); break;
          default:
            console.log(`Choix inconnu : « ${choix} ». Tapez un chiffre du menu.`);
        }
      } catch (erreur) {
        if (erreur.message.startsWith('TODO')) {
          console.log(`À compléter : ${erreur.message}`);
        } else {
          console.log(`Erreur inattendue : ${erreur.message}`);
        }
      }
    }
  }

  fermerSaisie();
}

main();
