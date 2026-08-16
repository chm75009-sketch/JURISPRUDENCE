/* Le questionnaire du plan de sauvegarde de l'emploi, et sa garantie de
   non-divergence dans les deux sens.

   Premier sens : tout contrôle doit être atteint par au moins une donnée
   demandée, sinon une exigence serait contrôlée sans jamais être renseignée.
   Second sens : tout champ qu'un contrôle lit doit être demandé, sinon le
   contrôle conclut sur du vide. Les deux font échouer la génération.

   Les champs communs au module économique — effectif, nombre de licenciements,
   dates, groupe, pièces — sont marqués « repris » : la page les préremplit
   depuis le brouillon de l'audit économique. Ils restent demandés, parce qu'un
   module qui suppose une saisie faite ailleurs conclut sur ce qu'il n'a pas lu.

   Usage : node questionnaire-pse.js      */
const fs = require("fs");
const { C, DETECTION } = require("./controles-pse.js");
const SRC = fs.readFileSync(__dirname + "/controles-pse.js", "utf8");
const MSRC = fs.readFileSync(__dirname + "/moteur-pse.js", "utf8");

/* Les champs lus par chaque fonction du moteur : un contrôle qui passe la fiche
   entière à M.planDu(f) lit indirectement ce que planDu lit. */
const CHAMPS_MOTEUR = {};
for (const m of MSRC.matchAll(/function (\w+)\(([^)]*)\)\s*\{/g)) {
  const suite = MSRC.slice(m.index).split(/\n(?=function |const [A-Za-z_]+ = |module\.exports)/)[0];
  CHAMPS_MOTEUR[m[1]] = [...new Set([...suite.matchAll(/\bf\.(\w+)/g)].map(x => x[1]))];
}

/* Les auxiliaires déclarés dans le fichier des contrôles — « lignes(f) »,
   « siPlanDu(f, …) » — lisent eux aussi la fiche. Un contrôle qui les appelle
   lit ce qu'ils lisent ; sans cela le questionnaire croit un contrôle orphelin
   alors qu'il est atteint par un champ, à travers un auxiliaire d'une ligne. */
for (const m of SRC.matchAll(/^(?:const (\w+) = f =>|function (\w+)\(f[,)])/gm)) {
  const nom = m[1] || m[2];
  const suite = SRC.slice(m.index).split(/\n(?=const [A-Za-z_]+ = |function |ctl\()/)[0];
  CHAMPS_MOTEUR[nom] = [...new Set([...suite.matchAll(/\bf\.(\w+)/g)].map(x => x[1]))];
}

function corpsDe(id) {
  const bloc = SRC.split(`ctl("${id}"`)[1];
  return bloc ? bloc.split("\nctl(")[0] : "";
}

/* Un champ composé — « plan.budgetTotal » — est lu à travers sa racine. */
const racine = c => String(c).split(".")[0];

function controlesDe(champ) {
  const r = racine(champ), out = [];
  for (const c of C) {
    const corps = corpsDe(c.id);
    if (!corps) continue;
    let vu = new RegExp(`f\\.${r}\\b`).test(corps) || new RegExp(`"${r}"`).test(corps)
      || (champ.includes(".") && corps.includes(champ.split(".").slice(1).join(".")));
    if (!vu) for (const m of corps.matchAll(/(?:M\.)?(\w+)\(\s*f\s*[,)]/g))
      if ((CHAMPS_MOTEUR[m[1]] || []).includes(r)) { vu = true; break; }
    if (vu) out.push(c.id);
  }
  return out;
}

function champsLusParLesControles() {
  const s = new Set();
  for (const c of C) {
    const corps = corpsDe(c.id);
    for (const m of corps.matchAll(/\bf\.([a-zA-Z_][a-zA-Z0-9_]*)/g)) s.add(m[1]);
    for (const m of corps.matchAll(/(?:M\.)?(\w+)\(\s*f\s*[,)]/g))
      for (const ch of CHAMPS_MOTEUR[m[1]] || []) s.add(ch);
  }
  return s;
}

const LIGNES = [];
const q = (rubrique, champ, libelle, format, piece) => LIGNES.push({ rubrique, champ, libelle, format, piece });

/* Aucun champ composé « à sous-questions » ici : les deux tableaux du module —
   les mesures du plan et les pièces — sont des tableaux ordinaires, dont les
   colonnes sont déduites du dossier de référence à l'empaquetage et vérifiées
   contre le code. Le formulaire en tire un éditeur de tableau, remplissable à
   la main ou par import d'un fichier Word, Excel, CSV ou PDF. */
const COMPOSES_LISTE = new Set([]);

q("Reprises de l'audit économique", "effectif", "Effectif de l'entreprise", "nombre", "registre du personnel");
q("Reprises de l'audit économique", "effectifEtablissement", "Effectif de l'établissement concerné", "nombre", "registre du personnel");
q("Reprises de l'audit économique", "groupe", "L'entreprise appartient-elle à un groupe ?", "oui / non", "organigramme du groupe");
q("Reprises de l'audit économique", "effectifGroupe", "Effectif total du groupe", "nombre", "comptes consolidés");
q("Reprises de l'audit économique", "nbLicenciements", "Nombre de licenciements envisagés sur trente jours", "nombre", "projet de licenciement");
q("Reprises de l'audit économique", "total30j", "Décompte des trente jours retenu par l'audit économique, refus de modification et licenciements déjà prononcés compris", "nombre", "—");
q("Reprises de l'audit économique", "dateNotification", "Date de notification des licenciements", "AAAA-MM-JJ", "lettres de licenciement");
q("Reprises de l'audit économique", "pieces", "Pièces versées au dossier", "liste d'objets", "les pièces elles-mêmes");

q("Le plan", "plan.mesures", "Les mesures du plan, une par ligne : rubrique de l'article L. 1233-62, intitulé, détail, nombre de bénéficiaires, budget, durée", "liste d'objets", "projet de plan");
q("Le plan", "plan.budgetTotal", "Budget total annoncé du plan", "euros", "projet de plan");
q("Le plan", "plan.salariesExposes", "Salariés dont la réinsertion est particulièrement difficile — âge, caractéristiques sociales, qualification", "liste", "liste nominative anonymisée");
q("Le plan", "plan.resultatGroupe", "Résultat consolidé du groupe sur le dernier exercice clos", "euros", "comptes consolidés");
q("Le plan", "plan.suivi", "Modalités de suivi : suivi des mesures, consultation du comité, bilan à l'administration", "objet", "projet de plan");

q("Accompagnement individuel", "plan.accompagnement", "Dispositif retenu : congé de reclassement ou contrat de sécurisation professionnelle", "texte", "projet de plan");
q("Accompagnement individuel", "plan.dureeConge", "Durée du congé de reclassement", "nombre de mois", "projet de plan");
q("Accompagnement individuel", "plan.formationReconversion", "Le congé comporte-t-il une formation de reconversion professionnelle ?", "oui / non", "projet de plan");
q("Accompagnement individuel", "plan.dateProposition", "Date de proposition du contrat de sécurisation professionnelle", "AAAA-MM-JJ", "preuve de remise, datée");

q("Voie et instruction", "pse.voie", "Voie retenue : accord majoritaire ou document unilatéral", "texte", "accord signé ou document");
q("Voie et instruction", "pse.suffrages", "Part des suffrages recueillie par les organisations signataires au premier tour des dernières élections", "nombre", "procès-verbal des élections");
q("Voie et instruction", "pse.dateDepotAdmin", "Date de réception par l'administration du dossier complet", "AAAA-MM-JJ", "accusé de réception");
q("Voie et instruction", "pse.dateDecisionAdmin", "Date de la décision de validation ou d'homologation", "AAAA-MM-JJ", "décision notifiée");

q("Après le licenciement", "plan.dateRupture", "Date de rupture des contrats", "AAAA-MM-JJ", "lettres de licenciement");
q("Après le licenciement", "plan.demandesReembauche", "Demandes de priorité de réembauche reçues", "liste", "courriers reçus, datés");
q("Après le licenciement", "plan.informationElusPostes", "Les représentants du personnel sont-ils informés des postes devenus disponibles ?", "oui / non", "ordres du jour et procès-verbaux");

/* ------------------------------------------------- la garantie, dans les deux sens */
const CONTEXTE = new Set([]);
const atteints = new Set(LIGNES.flatMap(l => controlesDe(l.champ)));
const orphelins = C.filter(x => !atteints.has(x.id)).map(x => x.id);
const demandes = new Set(LIGNES.map(l => racine(l.champ)));
const nonDemandes = [...champsLusParLesControles()]
  .filter(ch => !demandes.has(ch) && !CONTEXTE.has(ch)).sort();
const sansControle = LIGNES.filter(l => !controlesDe(l.champ).length).map(l => l.champ);

module.exports = { LIGNES, COMPOSES_LISTE, controlesDe };

if (require.main === module) {
  console.log(`${LIGNES.length} données · ${C.length} contrôles · atteints ${atteints.size}`
    + ` · orphelins ${orphelins.length ? orphelins.join(", ") : "aucun"}`
    + ` · champs lus non demandés ${nonDemandes.length ? nonDemandes.join(", ") : "aucun"}`
    + ` · données sans contrôle ${sansControle.length ? sansControle.join(", ") : "aucune"}`);
  if (orphelins.length || nonDemandes.length) {
    console.error("Divergence entre le questionnaire et les contrôles : la génération échoue.");
    process.exit(1);
  }
}
