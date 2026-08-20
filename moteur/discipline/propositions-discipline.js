/* Ce que chaque question accepte, module « discipline et règlement intérieur ».

   Les listes viennent du code qui reconnaît les valeurs, et moteur/commun/
   propositions.js le vérifie dans les deux sens à la publication : une valeur
   proposée doit exister dans le code, un littéral que le code compare doit être
   proposé. Le formulaire ne peut donc pas offrir une réponse que le moteur ne
   saurait pas exploiter.

   Usage : node propositions-discipline.js      */
const fs = require("fs"), path = require("path");
const V = require("../commun/propositions.js");

const lire = n => fs.readFileSync(path.join(__dirname, n), "utf8");
const SOURCES = ["controles-discipline.js", "moteur-discipline.js"].map(lire);

const OUI_NON = ["oui", "non"];

const P = {
  "cse.existe": { valeurs: OUI_NON, libre: false,
    aide: "Le comité social et économique. Son avis conditionne l'introduction du règlement intérieur (L. 1321-4) : sans comité, la formalité devient sans objet, mais l'absence de comité relève, elle, du module « comité »." },

  /* ------------------------------------------------ le règlement intérieur */
  "ri.existe": { valeurs: OUI_NON, libre: false,
    aide: "Le règlement intérieur est obligatoire à partir de cinquante salariés (L. 1311-2). En dessous, il est facultatif — mais s'il existe, il obéit aux mêmes règles de contenu et aux mêmes formalités." },
  "ri.contenuSanteSecurite": { valeurs: OUI_NON, libre: false,
    aide: "Les mesures d'application de la réglementation santé-sécurité dans l'entreprise, notamment les instructions prévues à l'article L. 4122-1 (L. 1321-1, 1°)." },
  "ri.contenuParticipation": { valeurs: OUI_NON, libre: false,
    aide: "Les conditions dans lesquelles les salariés peuvent être appelés, à la demande de l'employeur, à participer au rétablissement de conditions de travail protectrices (L. 1321-1, 2°)." },
  "ri.contenuDiscipline": { valeurs: OUI_NON, libre: false,
    aide: "Les règles générales et permanentes relatives à la discipline (L. 1321-1, 3°). C'est le siège du pouvoir disciplinaire : sans elles, aucune sanction n'est prévue." },
  "ri.echelleSanctions": { valeurs: OUI_NON, libre: false,
    aide: "La nature et l'échelle des sanctions : avertissement, blâme, mise à pied, mutation, rétrogradation, licenciement. Une sanction non prévue par le règlement intérieur ne peut pas être prononcée (Soc., 26 octobre 2010, n° 09-42.740)." },
  "ri.misePiedDureeMax": { valeurs: OUI_NON, libre: false,
    aide: "Une mise à pied disciplinaire n'est licite que si le règlement intérieur précise sa durée maximale (Soc., 26 octobre 2010, n° 09-42.740). « Mise à pied pouvant aller jusqu'à cinq jours » suffit ; « mise à pied » seul, non." },
  "ri.rappelDroitsDefense": { valeurs: OUI_NON, libre: false,
    aide: "Le rappel des droits de la défense définis aux articles L. 1332-1 à L. 1332-3, ou par la convention collective applicable (L. 1321-2, 1°)." },
  "ri.rappelHarcelement": { valeurs: OUI_NON, libre: false,
    aide: "Le rappel des dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes (L. 1321-2, 2°)." },
  "ri.rappelLanceursAlerte": { valeurs: OUI_NON, libre: false,
    aide: "Le rappel de l'existence du dispositif de protection des lanceurs d'alerte de la loi du 9 décembre 2016 (L. 1321-2, 3°)." },
  "ri.clausesInterdites": { valeurs: OUI_NON, libre: false,
    aide: "Clauses contraires aux lois, règlements ou conventions collectives ; restrictions aux droits et libertés non justifiées par la nature de la tâche ni proportionnées ; dispositions discriminatoires (L. 1321-3). Fouilles systématiques, interdictions générales, sanctions pécuniaires en font partie." },
  "ri.clauseNeutralite": { valeurs: OUI_NON, libre: false,
    aide: "Une clause inscrivant le principe de neutralité et restreignant la manifestation des convictions des salariés (L. 1321-2-1)." },
  "ri.neutraliteJustifieeProportionnee": { valeurs: OUI_NON, libre: false,
    aide: "La clause n'est licite qu'à double condition : justifiée par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, ET proportionnée au but recherché (L. 1321-2-1)." },
  "ri.redigeFrancais": { valeurs: OUI_NON, libre: false,
    aide: "Le règlement intérieur est rédigé en français ; il peut être accompagné de traductions (L. 1321-6)." },

  /* ------------------------------- les formalités du règlement intérieur */
  "ri.avisCSE": { valeurs: OUI_NON, libre: false,
    aide: "Le règlement intérieur « ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique » (L. 1321-4). L'avis accompagne ensuite le texte communiqué à l'inspection." },
  "ri.publicite": { valeurs: OUI_NON, libre: false,
    aide: "Porté par tout moyen à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche (R. 1321-1) : affichage, intranet, remise individuelle." },
  "ri.depotGreffe": { valeurs: OUI_NON, libre: false,
    aide: "Dépôt au greffe du conseil de prud'hommes du ressort de l'entreprise ou de l'établissement (R. 1321-2). Le délai d'un mois précédant l'entrée en vigueur court de la dernière des formalités de publicité et de dépôt (R. 1321-3)." },
  "ri.communicationInspection": { valeurs: OUI_NON, libre: false,
    aide: "Communication à l'inspecteur du travail, accompagnée de l'avis du comité, en même temps que les mesures de publicité (L. 1321-4)." },
  "ri.communicationDeuxExemplaires": { valeurs: OUI_NON, libre: false,
    aide: "R. 1321-4 : le texte est transmis à l'inspecteur du travail en deux exemplaires." },
  "ri.modifieDepuis": { valeurs: OUI_NON, libre: false,
    aide: "Toute modification ou tout retrait de clause refait courir les mêmes formalités : avis du comité, publicité, dépôt, communication (L. 1321-4, dernier alinéa)." },
  "ri.modificationsFormalites": { valeurs: OUI_NON, libre: false,
    aide: "Une modification introduite sans avis du comité ni publicité n'est pas opposable au salarié." },
  "ri.notesServiceGenerales": { valeurs: OUI_NON, libre: false,
    aide: "Les notes de service portant des obligations générales et permanentes dans les matières de L. 1321-1 et L. 1321-2 sont des adjonctions au règlement intérieur (L. 1321-5) — charte informatique, note sur les fouilles, note sur l'alcool." },
  "ri.notesServiceFormalites": { valeurs: OUI_NON, libre: false,
    aide: "Elles suivent en toute hypothèse les formalités du titre. Seule exception : l'urgence, pour les seules obligations de santé et de sécurité, avec communication immédiate au secrétaire du comité et à l'inspection." },
  "ri.demandeInspection": { valeurs: OUI_NON, libre: false,
    aide: "L'inspecteur du travail peut à tout moment exiger le retrait ou la modification des dispositions contraires aux articles L. 1321-1 à L. 1321-3 et L. 1321-6 (L. 1322-1)." },
  "ri.suiteDemandeInspection": { valeurs: OUI_NON, libre: false,
    aide: "La décision est motivée, notifiée à l'employeur et communiquée au comité (L. 1322-2). La voie ouverte est le recours hiérarchique (L. 1322-3), non l'inaction." },

  /* ---------------------------------------------------- la sanction auditée */
  "sanction.auditee": { valeurs: OUI_NON, libre: false,
    aide: "Répondez « non » pour n'auditer que le règlement intérieur ; « oui » pour examiner en outre une sanction envisagée ou déjà prononcée." },
  "sanction.nature": {
    valeurs: ["avertissement", "blâme", "mise à pied disciplinaire", "mutation disciplinaire",
      "rétrogradation", "licenciement disciplinaire", "sanction pécuniaire ou amende", "autre sanction"],
    libre: false,
    aide: "Constitue une sanction toute mesure, autre que les observations verbales, prise à la suite d'un agissement considéré comme fautif (L. 1331-1). L'étiquette ne décide pas de la procédure : c'est l'incidence sur la présence, la fonction, la carrière ou la rémunération (L. 1332-2)." },
  "sanction.incidence": { valeurs: OUI_NON, libre: false,
    aide: "C'est le critère de L. 1332-2 : l'entretien n'est pas dû pour « un avertissement ou une sanction de même nature n'ayant pas d'incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération »." },
  "sanction.prevueRI": { valeurs: OUI_NON, libre: false,
    aide: "Une sanction autre que le licenciement ne peut être prononcée que si elle est prévue par le règlement intérieur, chez l'employeur tenu d'en établir un (Soc., 23 mars 2017, n° 15-23.090 ; Soc., 26 octobre 2010, n° 09-42.740)." },
  "sanction.griefsEcrits": { valeurs: OUI_NON, libre: false,
    aide: "« Aucune sanction ne peut être prise à l'encontre du salarié sans que celui-ci soit informé, dans le même temps et par écrit, des griefs retenus contre lui » (L. 1332-1). L'exigence vaut même pour l'avertissement." },
  "sanction.retenueSalaire": { valeurs: OUI_NON, libre: false,
    aide: "Les amendes et autres sanctions pécuniaires sont interdites (L. 1331-2). La perte de salaire liée à une mise à pied disciplinaire régulière n'en est pas une : elle résulte de la suspension du contrat." },
  "sanction.salarieProtege": { valeurs: OUI_NON, libre: false,
    aide: "Élu, délégué syndical, représentant de proximité, conseiller du salarié, membre d'un conseil d'administration… Le statut protecteur ajoute une procédure spéciale que ce module SIGNALE sans l'auditer." },
  "sanction.poursuitesPenales": { valeurs: OUI_NON, libre: false,
    aide: "Seule réserve au délai de deux mois : « à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales » (L. 1332-4)." },
  "sanction.sanctionsAnterieuresInvoquees": { valeurs: OUI_NON, libre: false,
    aide: "« Aucune sanction antérieure de plus de trois ans à l'engagement des poursuites disciplinaires ne peut être invoquée à l'appui d'une nouvelle sanction » (L. 1332-5)." },
  "sanction.convocationEnvoyee": { valeurs: OUI_NON, libre: false,
    aide: "L'employeur qui a choisi de convoquer est tenu de respecter tous les termes de la procédure, quelle que soit la sanction finalement infligée (Soc., 16 avril 2008, n° 06-41.999)." },
  "sanction.convocationObjet": { valeurs: OUI_NON, libre: false,
    aide: "R. 1332-1 : la lettre indique l'objet de l'entretien entre le salarié et l'employeur." },
  "sanction.convocationDateHeureLieu": { valeurs: OUI_NON, libre: false,
    aide: "R. 1332-1 : elle précise la date, l'heure et le lieu de cet entretien." },
  "sanction.convocationAssistance": { valeurs: OUI_NON, libre: false,
    aide: "R. 1332-1 : elle rappelle que le salarié peut se faire assister par une personne de son choix APPARTENANT AU PERSONNEL de l'entreprise — la sanction disciplinaire n'ouvre pas l'assistance par un conseiller extérieur." },
  "sanction.convocationRemise": { valeurs: ["récépissé", "lettre recommandée"], autres: ["autre mode"], libre: true,
    aide: "R. 1332-1 n'ouvre que deux voies : la remise contre récépissé ou la lettre recommandée, dans le délai de deux mois fixé à l'article L. 1332-4." },
  "sanction.entretienTenu": { valeurs: OUI_NON, libre: false,
    aide: "Au cours de l'entretien, l'employeur indique le motif de la sanction envisagée et recueille les explications du salarié (L. 1332-2)." },
  "sanction.notificationEcrite": { valeurs: OUI_NON, libre: false,
    aide: "R. 1332-2 : la sanction fait l'objet d'une décision écrite et motivée." },
  "sanction.notificationMotivee": { valeurs: OUI_NON, libre: false,
    aide: "La motivation énonce les griefs. Une lettre qui se borne à « votre comportement » ne met pas le salarié en mesure de les discuter." },
  "sanction.notificationRemise": { valeurs: ["récépissé", "lettre recommandée"], autres: ["autre mode"], libre: true,
    aide: "R. 1332-2 : la décision est notifiée soit par lettre remise contre récépissé, soit par lettre recommandée, dans le délai d'un mois prévu par L. 1332-2." },
  "sanction.misePiedConservatoire": { valeurs: OUI_NON, libre: false,
    aide: "La mise à pied conservatoire n'est pas une sanction : elle écarte le salarié le temps de la procédure. Aucune sanction définitive relative à ces faits ne peut être prise sans que la procédure de L. 1332-2 ait été respectée (L. 1332-3)." },

  /* ------------------------------------------------------ la garantie de fond */
  "garantie.procedureApplicable": { valeurs: OUI_NON, libre: false,
    aide: "C'est la première chose à vérifier dans une convention collective : conseil de discipline, commission paritaire, avis préalable, entretien imposé. Une procédure conventionnelle non suivie est assimilée à la violation d'une garantie de fond (Soc., 8 septembre 2021, n° 19-15.039)." },
  "garantie.source": { valeurs: [], autres: ["la convention collective", "le règlement intérieur", "les deux"],
    libre: true, indicatif: true,
    aide: "La source est reprise telle quelle dans le rapport : le module ne discrimine pas entre convention collective et règlement intérieur — la Cour de cassation les traite de la même façon (Soc., 8 septembre 2021, n° 19-15.039)." },
  "garantie.nature": {
    valeurs: ["consultation d'un organisme appelé à donner son avis"],
    autres: ["entretien imposé avant toute sanction", "autre formalité prévue avant la sanction"],
    libre: true,
    aide: "La consultation d'un organisme chargé de donner son avis sur un licenciement envisagé constitue une garantie de fond : sans elle, le licenciement ne peut avoir de cause réelle et sérieuse (Soc., 8 septembre 2021, n° 19-15.039)." },
  "garantie.suivie": { valeurs: ["oui", "non", "tardivement ou imparfaitement"], libre: false,
    aide: "« Tardivement ou imparfaitement » n'est pas « oui » : le caractère tardif de la demande d'avis est une irrégularité, et il appartient au juge de rechercher si elle a privé le salarié de sa défense ou a pu influencer la décision (Soc., 20 mars 2024, n° 22-17.292)." },
  "garantie.droitsDefensePrives": { valeurs: OUI_NON, libre: false,
    aide: "Première branche du critère : l'irrégularité a-t-elle privé le salarié de la possibilité d'assurer utilement sa défense ?" },
  "garantie.influenceDecision": { valeurs: OUI_NON, libre: false,
    aide: "Seconde branche du critère : l'irrégularité est-elle susceptible d'avoir exercé, en l'espèce, une influence sur la décision finale de sanctionner ?" },
  "garantie.licenciementSubordonneSanctions": { valeurs: OUI_NON, libre: false,
    aide: "Si le règlement intérieur ou la convention collective subordonnent le licenciement à l'existence de sanctions antérieures, l'avertissement lui-même peut influer sur le maintien dans l'entreprise : l'entretien préalable devient obligatoire (Soc., 3 mai 2011, n° 10-14.104 ; Soc., 22 septembre 2021, n° 18-22.204)." },

  pieces: { valeurs: [], autres: ["reglement-interieur", "convocation-entretien", "notification-sanction",
    "avis-cse", "recepisse-greffe", "clause-conventionnelle"], libre: true, multiple: true, indicatif: true,
    aide: "Les documents que vous joignez. Un règlement intérieur ne se prouve que par son texte, un dépôt que par le récépissé du greffe." },
};

const ECARTS = V.verifier(P, SOURCES);
module.exports = { P, ECARTS };

if (require.main === module) {
  console.log(`${Object.keys(P).length} question(s) à propositions`);
  if (ECARTS.length) { ECARTS.forEach(e => console.log("ÉCART — " + e)); process.exit(1); }
  console.log("propositions et code concordent dans les deux sens");
}
