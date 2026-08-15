/* Cas de contrôle du moteur du comité social et économique.
   Chaque cas porte le résultat attendu et l'article qui le fonde. Un cas qui
   échoue arrête la publication. */
const M = require("./moteur-cse.js");
const CAS = [];
const c = (titre, texte, fn) => CAS.push({ titre, texte, fn });

c("Aucun comité en deçà de onze salariés", "L. 2311-2", () => M.delegation(10).du === false);
c("Onze salariés : un titulaire, dix heures", "R. 2314-1", () => { const d = M.delegation(11); return d.titulaires === 1 && d.heures === 10; });
c("Soixante salariés : quatre titulaires, dix-huit heures", "R. 2314-1", () => { const d = M.delegation(60); return d.titulaires === 4 && d.heures === 18; });
c("Trois cents salariés : onze titulaires, vingt-deux heures", "R. 2314-1", () => { const d = M.delegation(300); return d.titulaires === 11 && d.heures === 22; });
c("Au-delà de dix mille salariés : dernière tranche appliquée", "R. 2314-1", () => M.delegation(12000).titulaires === 35);
c("Les cinquante-quatre tranches sont continues", "R. 2314-1", () => M.R2314_1.every((t, i) => i === 0 || M.R2314_1[i-1][1] === null || t[0] === M.R2314_1[i-1][1] + 1));

c("Douze mois consécutifs : le seuil est atteint", "L. 2311-2", () => M.seuilAtteint([9,12,12,12,12,12,12,12,12,12,12,12,12], 11).atteint === true);
c("Une interruption suffit à ne pas atteindre le seuil", "L. 2311-2", () => M.seuilAtteint([12,12,12,12,12,10,12,12,12,12,12,12,12], 11).atteint === false);

c("Quarante-neuf salariés : pas de subvention de fonctionnement", "L. 2315-61", () => M.budgetFonctionnement(49, 1e6).du === false);
c("Mille neuf cent quatre-vingt-dix-neuf salariés : 0,20 %", "L. 2315-61", () => M.budgetFonctionnement(1999, 1e6).montant === 2000);
c("Deux mille salariés : 0,22 %", "L. 2315-61", () => M.budgetFonctionnement(2000, 1e6).montant === 2200);

c("Délai de consultation d'un mois dans le cas général", "R. 2312-6", () => M.delaiConsultation({}).jours === 30);
c("Deux mois en cas d'expertise", "R. 2312-6", () => M.delaiConsultation({ expertise: true }).jours === 60);
c("Trois mois en cas d'expertises centrale et d'établissement", "R. 2312-6", () => M.delaiConsultation({ expertisesCentraleEtEtablissement: true }).jours === 90);

c("Commission santé et sécurité : non due à deux cent quatre-vingt-dix-neuf", "L. 2315-36", () => M.cssct({ effectif: 299 }).obligatoire === false);
c("Commission santé et sécurité : due à trois cents", "L. 2315-36", () => M.cssct({ effectif: 300 }).obligatoire === true);
c("Établissement Seveso : due quel que soit l'effectif", "L. 2315-36, 3°", () => M.cssct({ effectif: 50, seveso: true }).obligatoire === true);

c("Douze réunions par an à partir de trois cents salariés", "L. 2315-28", () => M.reunions({ effectif: 300 }).parAn === 12);
c("Six réunions par an en deçà", "L. 2315-28", () => M.reunions({ effectif: 299 }).parAn === 6);
c("Un accord ne peut descendre sous six réunions", "L. 2312-19, 2°", () => M.reunions({ effectif: 400, accordPeriodicite: true, reunionsAccord: 5 }).licite === false);
c("Un accord à six réunions est licite", "L. 2312-19, 2°", () => M.reunions({ effectif: 400, accordPeriodicite: true, reunionsAccord: 6 }).licite === true);

c("Mandat de quatre ans à défaut d'accord", "L. 2314-33", () => M.mandat({}).annees === 4);
c("Un accord ne peut fixer cinq ans", "L. 2314-34", () => M.mandat({ dureeAccord: 5 }).licite === false);
c("Un accord peut fixer deux ans", "L. 2314-34", () => M.mandat({ dureeAccord: 2 }).licite === true);

c("Réduction de moitié : élections partielles dues", "L. 2314-10", () => M.electionsPartielles({ titulairesInitiaux: 10, titulairesRestants: 5 }).dues === true);
c("Moins de six mois avant le terme : non dues", "L. 2314-10", () => M.electionsPartielles({ titulairesInitiaux: 10, titulairesRestants: 5, moisAvantTerme: 3 }).dues === false);
c("Aucun des deux cas : non dues", "L. 2314-10", () => M.electionsPartielles({ titulairesInitiaux: 10, titulairesRestants: 8 }).dues === false);

c("Troisième collège à partir de vingt-cinq cadres", "L. 2314-11", () => M.colleges({ effectif: 600, nbCadres: 25 }).nombre === 3);
c("Deux collèges en deçà de vingt-cinq cadres", "L. 2314-11", () => M.colleges({ effectif: 600, nbCadres: 24 }).nombre === 2);
c("Nombre de cadres non renseigné : l'incertitude est signalée", "L. 2314-11", () => M.colleges({ effectif: 600 }).inconnu === true);

c("Parité : soixante-quarante sur trois candidats donne deux femmes et un homme", "L. 2314-30", () => { const r = M.listeParitaire({ femmes: 60, hommes: 40, candidats: 3 }); return r.candidatsFemmes === 2 && r.candidatsHommes === 1; });
c("Parité : l'alternance commence par le sexe majoritaire et s'arrête à épuisement", "L. 2314-30", () => M.listeParitaire({ femmes: 60, hommes: 40, candidats: 3 }).alternance === "F · H · F");
c("Parité : quatre-vingts-vingt sur dix donne huit femmes et deux hommes", "L. 2314-30", () => { const r = M.listeParitaire({ femmes: 80, hommes: 20, candidats: 10 }); return r.candidatsFemmes === 8 && r.candidatsHommes === 2; });
c("Parité : le conflit d'arrondi est signalé, non tranché", "L. 2314-30", () => M.listeParitaire({ femmes: 70, hommes: 30, candidats: 5 }).conflit === true);
c("Parité : impair et stricte égalité, le quatrième alinéa s'applique", "L. 2314-30, al. 4", () => M.listeParitaire({ femmes: 50, hommes: 50, candidats: 3 }).indifferent === true);
c("Parité : l'exclusion totale d'un sexe est signalée", "L. 2314-30, al. 5", () => { const r = M.listeParitaire({ femmes: 95, hommes: 5, candidats: 2 }); return r.candidatsHommes === 0 && !!r.exclusion; });
c("Parité : la règle ne s'applique pas à un candidat unique", "L. 2314-30", () => M.listeParitaire({ femmes: 50, hommes: 50, candidats: 1 }).applicable === false);
c("Parité : la base ne conclut jamais quand elle ne peut pas conclure", "L. 2314-30", () => { const r = M.listeParitaire({ femmes: 70, hommes: 30, candidats: 5 }); return r.candidatsFemmes === null && r.candidatsHommes === null; });

c("Expertise sur les orientations stratégiques : quatre-vingts pour cent employeur", "L. 2315-80, 2°", () => M.financementExpertise("orientations stratégiques").employeur === 80);
c("Expertise sur la situation économique : cent pour cent employeur", "L. 2315-80, 1°", () => M.financementExpertise("situation économique et financière").employeur === 100);
c("Expertise libre : cent pour cent comité", "L. 2315-81", () => M.financementExpertise("expertise libre").comite === 100);
c("Contestation de l'expertise : dix jours", "R. 2315-49", () => M.contestationExpertise("nécessité").jours === 10);
c("Le point de départ diffère selon l'objet de la contestation", "L. 2315-86", () => M.contestationExpertise("nécessité").depart !== M.contestationExpertise("coût final").depart);
c("Contestation de l'électorat : trois jours", "R. 2314-24", () => M.delaiContestation("électorat").jours === 3);
c("Contestation de la régularité de l'élection : quinze jours", "R. 2314-24", () => M.delaiContestation("régularité de l'élection").jours === 15);

if (require.main === module) {
  let ko = 0;
  for (const t of CAS) {
    let r; try { r = t.fn(); } catch (e) { r = false; }
    if (!r) { ko++; console.log("ÉCHEC  " + t.titre + "  [" + t.texte + "]"); }
  }
  console.log(`${CAS.length} cas · ${CAS.length - ko} réussis · ${ko} échec(s)`);
  if (ko) process.exit(1);
}
module.exports = CAS;
