/* Les modèles du plan d'action — étage 3.

   LA RÈGLE DE CES MODÈLES, née d'un retour d'usage : une coquille n'est pas
   un livrable. Chaque modèle porte, dans le document lui-même :

   1. LA STRUCTURE INTÉGRALE — pour la BDESE, la liste complète des rubriques,
      sections et sujets dus à l'effectif déclaré, générée depuis le découpage
      des décrets réalisé par le module BDESE (donnees-modeles.json, jamais
      recopiée à la main) ; pour le règlement intérieur, le plan complet des
      clauses de L. 1321-1 à L. 1321-6 ; pour le registre unique, les colonnes
      exactes de L. 1221-13 et D. 1221-23 ; pour la CSSCT, la délibération
      entière avec les règles de L. 2315-38, L. 2315-39 et L. 2315-41 ; etc.
      Le renvoi au module dédié reste — EN NOTE DE FIN, jamais comme contenu.

   2. UN EXEMPLE FICTIF PRÉCIS ET CHIFFRÉ, adapté à l'effectif et au secteur
      déclarés : partout où il y aurait un blanc, une valeur plausible marquée
      « [exemple] » — noms fictifs, dates cohérentes avec la date d'audit,
      nombres réalistes pour l'effectif (membres de CSSCT, bénéficiaires de
      l'obligation d'emploi à 6 %, tranches de R. 2314-1…).

   3. LES CHAMPS À PERSONNALISER, listés à la fin du document.

   Ce qui n'a pas été lu à la source ne s'affirme pas : les valeurs issues de
   la convention collective ou de textes hors du champ du relais sont
   marquées « à compléter selon la convention » ou « à vérifier », jamais
   posées comme des règles.                                                  */
const fs = require("fs");
const DM = JSON.parse(fs.readFileSync(__dirname + "/donnees-modeles.json", "utf8"));

/* ── les briques ──────────────────────────────────────────────────────── */
const h = x => ({ t: "h", x });
const par = x => ({ t: "p", x });
const puce = x => ({ t: "puce", x });
const champ = x => ({ t: "champ", x });

const ex = v => v + " [exemple]";
const q = v => (v !== undefined && v !== null && String(v).trim() !== "" ? String(v).trim() : null);
const effN = p => { const v = p.effectif;
  return typeof v === "number" && isFinite(v) ? v
    : (q(v) !== null && isFinite(+v) ? +v : null); };
const eff = p => { const n = effN(p); return n === null ? ex("120") : String(n); };
const nomE = p => q(p.entreprise) || ex("SOCIÉTÉ NOUVELLE DUMONT");
const ccn = p => q(p.conventionCollective) || "votre convention collective (à identifier)";

/* Les dates de l'exemple : cohérentes avec la date d'audit — à défaut, avec
   le jour où le modèle est produit. */
const jour0 = p => /^\d{4}-\d{2}-\d{2}$/.test(String(p.dateAudit || "")) ? p.dateAudit
  : new Date().toISOString().slice(0, 10);
const plusJours = (p, n) => {
  const [a, m, j] = jour0(p).split("-").map(Number);
  return new Date(Date.UTC(a, m - 1, j + n)).toISOString().slice(0, 10);
};

/* Le vocabulaire du secteur : les unités de travail et risques de l'exemple
   s'écrivent dans la langue de l'activité déclarée. Rien de juridique ici —
   c'est de l'illustration, marquée comme telle. */
function secteurProfil(p) {
  const s = String(p.secteur || "").toLowerCase();
  if (/transport|routier|logisti|messager/.test(s)) return { nom: "transport routier",
    unites: [["Conduite (personnels roulants)", "risque routier, manutention lors des chargements, troubles musculo-squelettiques, horaires atypiques", "entretien des véhicules, protocoles de chargement, organisation des tournées, prévention de la somnolence"],
      ["Quai et entrepôt", "circulation d'engins, chutes de plain-pied et de hauteur, écrasement, port de charges", "plan de circulation, engins vérifiés, équipements de protection, allées marquées"],
      ["Atelier mécanique", "outils et machines, produits (huiles, solvants), levage de véhicules", "habilitations, fiches de données de sécurité, ponts élévateurs vérifiés"],
      ["Services administratifs et exploitation", "travail sur écran, risques psychosociaux, sédentarité", "aménagement des postes, régulation de la charge, ergonomie"]] };
  if (/industri|usine|product|métallurg|plasturg|chimi/.test(s)) return { nom: "industrie",
    unites: [["Production", "machines, bruit, manutention, produits chimiques", "protecteurs de machines, protections auditives, aides à la manutention, fiches de données de sécurité"],
      ["Maintenance", "interventions sur équipements, travail en hauteur, énergies", "consignation, permis de travail, habilitations"],
      ["Logistique et magasin", "circulation d'engins, gestes répétitifs, chutes", "plan de circulation, rotation des tâches"],
      ["Services administratifs", "travail sur écran, risques psychosociaux", "aménagement des postes, régulation de la charge"]] };
  if (/btp|bâtiment|construction|travaux/.test(s)) return { nom: "bâtiment et travaux publics",
    unites: [["Chantiers", "chutes de hauteur, engins, ensevelissement, coactivité", "échafaudages vérifiés, plans de prévention, port des équipements"],
      ["Atelier et dépôt", "machines, manutention, produits", "protecteurs, stockages conformes"],
      ["Conduite d'engins et livraisons", "risque routier, renversement", "vérifications générales périodiques, formation des conducteurs"],
      ["Bureaux d'études et administratif", "travail sur écran, risques psychosociaux", "ergonomie, organisation du travail"]] };
  if (/commerce|vente|distribution|magasin/.test(s)) return { nom: "commerce",
    unites: [["Surface de vente", "manutention, chutes, contact clientèle (incivilités)", "aides à la manutention, sols entretenus, procédures d'alerte"],
      ["Réserve et réception", "circulation, port de charges, gerbeurs", "plan de circulation, formation aux engins"],
      ["Caisses et accueil", "gestes répétitifs, station assise ou debout prolongée, tensions clientèle", "rotation des postes, aménagement"],
      ["Services administratifs", "travail sur écran", "ergonomie des postes"]] };
  return { nom: q(p.secteur) || "services",
    unites: [["Exploitation / production de services", "charge mentale, déplacements professionnels, travail sur écran", "organisation de la charge, prévention du risque routier en mission"],
      ["Relation clientèle", "tensions et incivilités, amplitude horaire", "procédures d'alerte, régulation des plannings"],
      ["Fonctions support", "travail sur écran, sédentarité", "ergonomie, pauses visuelles"],
      ["Locaux et maintenance", "interventions techniques, produits d'entretien", "consignes, fiches de données de sécurité"]] };
}

/* La table de R. 2314-1 (module CSE) : titulaires et heures pour l'effectif. */
function r2314(p) {
  const n = effN(p); if (n === null) return null;
  const t = DM.r2314_1.tranches;
  for (const [min, max, tit, hres] of t) if (n >= min && n <= max) return { titulaires: tit, heures: hres };
  const dernier = t[t.length - 1];
  return n > dernier[1] ? { titulaires: dernier[2], heures: dernier[3] } : null;
}
/* La CSSCT : trois membres au minimum (L. 2315-39) ; l'exemple propose une
   taille plausible pour l'effectif — c'est l'accord qui fixera le nombre. */
const cssctMembres = p => { const n = effN(p) || 0;
  return n >= 2000 ? 8 : n >= 1000 ? 6 : n >= 500 ? 5 : n >= 300 ? 4 : 3; };

const entete = (p, objet) => [
  par(`${nomE(p)} — effectif déclaré : ${eff(p)} salarié(s)` +
    (q(p.secteur) ? ` — secteur : ${q(p.secteur)}` : "") +
    (q(p.conventionCollective) ? ` — convention : ${q(p.conventionCollective)}` : "")),
  par(`Objet : ${objet}. Établi le ${jour0(p)}.`),
  par("Trame complète avec exemple fictif : les valeurs marquées « [exemple] » sont plausibles pour votre profil, elles ne sont pas les vôtres — remplacez-les avant tout usage, et faites relire."),
];
const aPers = liste => [h("À personnaliser avant usage"),
  ...liste.map(x => puce(x))];
const noteFin = x => par("Pour aller plus loin : " + x);

/* ═══════════════════════════════════════════════════════ les modèles ══ */
const MODELES = {

  /* ─────────────────────────────────────────────── instances ─────────── */

  "SOC-INS-CSE": p => {
    const d = r2314(p);
    return {
    titre: "Note de lancement du processus électoral (CSE)",
    lignes: [...entete(p, "organisation des élections du comité social et économique"),
      h("1. Constat et fondement"),
      par(`L'effectif de ${nomE(p)} (${eff(p)} salariés) atteint le seuil de onze salariés pendant douze mois consécutifs : le comité social et économique doit être mis en place (L. 2311-2). L'information du personnel se fait par tout moyen conférant date certaine, et le premier tour se tient au plus tard le quatre-vingt-dixième jour suivant cette diffusion (L. 2314-4).`),
      d ? par(`Délégation à élire pour cet effectif, selon la table de l'article R. 2314-1 extraite par le module comité : ${d.titulaires} titulaires (et autant de suppléants), ${d.heures} heures de délégation mensuelles par titulaire — sous réserve du protocole d'accord préélectoral.`) : par("Délégation à élire : le nombre de titulaires et d'heures se lit dans la table de l'article R. 2314-1 — renseignez l'effectif pour qu'il se calcule."),
      h("2. Calendrier (exemple cohérent avec la date d'audit)"),
      puce(`Information du personnel de l'organisation des élections, avec la date envisagée du premier tour : le ${ex(plusJours(p, 7))}`),
      puce(`Information et invitation des organisations syndicales à négocier le protocole d'accord préélectoral et à établir leurs listes (L. 2314-5) : le ${ex(plusJours(p, 7))}`),
      puce(`Négociation du protocole d'accord préélectoral (collèges, répartition, modalités de vote) : réunions des ${ex(plusJours(p, 28))} et ${ex(plusJours(p, 42))}`),
      puce(`Dépôt des candidatures : au plus tard le ${ex(plusJours(p, 60))}`),
      puce(`Premier tour : le ${ex(plusJours(p, 75))} (au plus tard le quatre-vingt-dixième jour suivant l'information) — second tour éventuel : le ${ex(plusJours(p, 89))}`),
      puce(`Procès-verbaux établis et transmis ; procès-verbal de carence si aucun candidat ne s'est présenté aux deux tours`),
      h("3. Pilotage"),
      champ(`Pilote du processus : ${ex("Camille MARTIN, directrice des ressources humaines")} — appui juridique : ${ex("cabinet conseil habituel")}`),
      ...aPers(["Les dates du calendrier (l'exemple respecte la borne des 90 jours — recalez-les sur votre réalité)",
        "Le nom du pilote et des négociateurs du protocole",
        "Le nombre de sièges et d'heures si le protocole y déroge",
        "Les modalités de vote (urne, correspondance, électronique)"]),
      noteFin("l'audit complet du fonctionnement (réunions, budgets, consultations, parité) se fait dans le module « comité social et économique » (audit-cse.html).")],
  }; },

  "SOC-INS-CSE-ETAB": p => ({
    titre: "Trame d'accord sur les établissements distincts",
    lignes: [...entete(p, "détermination du nombre et du périmètre des établissements distincts (L. 2313-1)"),
      h("Article 1 — Nombre et périmètre des établissements distincts"),
      par(`Les parties conviennent que ${nomE(p)} comporte ${ex("trois")} établissements distincts, déterminés au regard de l'autonomie de gestion de leurs responsables, notamment en matière de gestion du personnel :`),
      puce(ex("Établissement de Villeneuve-Nord — siège, exploitation et services support — 4 100 salariés")),
      puce(ex("Établissement de Genlis-Sud — agences régionales groupées — 2 300 salariés")),
      puce(ex("Établissement de Roncq-Est — ateliers et plateformes — 1 109 salariés")),
      h("Article 2 — Représentation du personnel"),
      par("Un comité social et économique d'établissement est élu dans chacun des établissements définis à l'article 1. Un comité social et économique central d'entreprise est constitué au niveau de l'entreprise (L. 2313-1) ; la répartition des sièges entre établissements figure en annexe."),
      h("Article 3 — Durée, révision, dépôt"),
      par(`Le présent accord est conclu pour une durée ${ex("indéterminée")}. Il est déposé dans les conditions légales et tenu à la disposition du personnel.`),
      champ(`Signataires : la direction (${ex("Dominique BERNARD, directeur général")}) et les organisations syndicales représentatives — le ${ex(plusJours(p, 30))}`),
      ...aPers(["Le nombre, le nom et le périmètre réels des établissements — c'est l'autonomie de gestion qui les définit, pas la géographie seule",
        "Les effectifs par établissement et la répartition des sièges",
        "La durée de l'accord et les modalités de révision"]),
      noteFin("l'architecture élue (comités d'établissement, comité central, représentants de proximité) s'audite dans le module « comité social et économique ».")],
  }),

  "SOC-INS-CSSCT": p => {
    const m = cssctMembres(p);
    return {
    titre: "Délibération et trame d'accord : création de la CSSCT",
    lignes: [...entete(p, "création de la commission santé, sécurité et conditions de travail (L. 2315-36)"),
      h("1. Le cadre légal, lu à la source"),
      puce("Création obligatoire : entreprises et établissements distincts d'au moins trois cents salariés, et établissements à hauts risques quel que soit l'effectif (L. 2315-36)."),
      puce("Présidence : l'employeur ou son représentant. Composition : au minimum trois membres représentants du personnel, dont au moins un représentant du second collège (ou du troisième le cas échéant), désignés par le comité parmi ses membres, par résolution, pour une durée qui prend fin avec celle du mandat des élus (L. 2315-39)."),
      puce("Attributions : par délégation du comité, tout ou partie de ses attributions relatives à la santé, à la sécurité et aux conditions de travail — à l'exception du recours à un expert et des attributions consultatives (L. 2315-38)."),
      puce("L'accord d'entreprise fixe : le nombre de membres, les missions déléguées et leurs modalités d'exercice, les modalités de fonctionnement dont le nombre d'heures de délégation, les modalités de formation, et le cas échéant les moyens alloués (L. 2315-41)."),
      h("2. Trame d'accord (exemple chiffré pour l'effectif déclaré)"),
      puce(`Article 1 — Nombre de membres : ${ex(String(m))} représentants du personnel, dont au moins un du second collège (minimum légal : trois).`),
      puce(`Article 2 — Missions déléguées : ${ex("analyse des risques, inspections trimestrielles, enquêtes après accident, préparation des consultations santé-sécurité du comité")} — hors expertise et consultations, que la loi réserve au comité.`),
      puce(`Article 3 — Fonctionnement : ${ex("quatre réunions par an au moins, présidées par l'employeur")} ; heures de délégation spécifiques : ${ex("10 heures par mois et par membre")}.`),
      puce(`Article 4 — Formation des membres : dans les conditions des articles L. 2315-16 à L. 2315-18 (renvoi de L. 2315-41, 4°).`),
      puce(`Article 5 — Moyens : ${ex("local, documentation, temps de secrétariat")}.`),
      h("3. Délibération de désignation (à prendre en réunion du comité)"),
      par(`« Le comité social et économique de ${nomE(p)}, réuni le ${ex(plusJours(p, 21))}, désigne par résolution comme membres de la commission santé, sécurité et conditions de travail : ${ex("Sacha LEROY (2e collège), Camille MARTIN, Dominique BERNARD, Andrea COSTA")} — pour une durée prenant fin avec le mandat en cours. »`),
      ...aPers(["Le nombre de membres et les noms des désignés (l'exemple propose " + m + " membres pour votre effectif — c'est l'accord qui décide)",
        "Les missions réellement déléguées, les heures et le nombre de réunions",
        "La date de la réunion de désignation"]),
      noteFin("la composition, les modalités et la formation des membres s'auditent en détail dans le module « santé, sécurité et conditions de travail » (audit-sst.html).")],
  }; },

  "SOC-INS-COMMISSIONS": p => {
    const n = effN(p);
    const membres = k => (n === null ? k : Math.max(3, Math.min(k + 2, Math.round(k + n / 900))));
    return {
    titre: "Délibération de constitution des commissions du comité (régime supplétif)",
    lignes: [...entete(p, "constitution des commissions supplétives du comité : formation, information et aide au logement, égalité professionnelle"),
      h("0. À lire avant tout : ces commissions ne jouent qu'À DÉFAUT D'ACCORD"),
      par("Un accord d'entreprise conclu dans les conditions du premier alinéa de l'article L. 2232-12 peut prévoir la création de commissions supplémentaires pour l'examen de problèmes particuliers (L. 2315-45). Les commissions ci-dessous sont le RÉGIME SUPPLÉTIF : elles s'imposent « en l'absence d'accord prévu à l'article L. 2315-45 ». Première vérification, donc : existe-t-il un accord qui organise les commissions ? S'il existe, c'est lui qui commande, et cette délibération se réécrit sur son plan."),
      puce("Commission de la formation — à défaut d'accord, dans les entreprises d'au moins trois cents salariés (L. 2315-49)."),
      puce("Commission d'information et d'aide au logement — à défaut d'accord, dans les entreprises d'au moins trois cents salariés ; les entreprises de moins de trois cents salariés peuvent se grouper pour la former (L. 2315-50)."),
      puce("Commission de l'égalité professionnelle — à défaut d'accord, dans les entreprises d'au moins trois cents salariés (L. 2315-56)."),
      puce("Les rapports des commissions sont soumis à la délibération du comité ; l'employeur peut leur adjoindre, avec voix consultative, des experts et techniciens de l'entreprise choisis hors du comité, tenus au secret professionnel et à l'obligation de discrétion (L. 2315-45)."),
      h("1. Délibération — préambule (à porter au procès-verbal)"),
      par(`« Le comité social et économique de ${nomE(p)} (${eff(p)} salariés), réuni le ${ex(plusJours(p, 21))} sous la présidence de ${ex("Dominique BERNARD, directeur général")}, constate qu'aucun accord d'entreprise au sens de l'article L. 2315-45 n'organise ses commissions${n !== null && n >= 1000 ? " — l'effectif appelant en outre une commission économique, objet d'une délibération distincte (L. 2315-46)" : ""}. En conséquence, il constitue les commissions ci-après, pour une durée prenant fin avec les mandats en cours. »`),
      h("2. Commission de la formation (L. 2315-49)"),
      par(`« Il est constitué une commission de la formation, composée de ${ex(String(membres(5)) + " membres")}, dont ${ex("Sacha LEROY, rapporteur")}. Elle est chargée : 1° de préparer les délibérations du comité prévues aux 1° et 3° de l'article L. 2312-17 dans les domaines qui relèvent de sa compétence ; 2° d'étudier les moyens permettant de favoriser l'expression des salariés en matière de formation et de participer à leur information dans ce domaine ; 3° d'étudier les problèmes spécifiques concernant l'emploi et le travail des jeunes et des travailleurs handicapés. Réunions : ${ex("deux par an, avant chaque consultation concernée — les " + plusJours(p, 60) + " et " + plusJours(p, 240))}. »`),
      h("3. Commission d'information et d'aide au logement (L. 2315-50, L. 2315-51)"),
      par(`« Il est constitué une commission d'information et d'aide au logement, composée de ${ex(String(membres(3)) + " membres")}, dont ${ex("Andrea COSTA, rapporteure")}. Elle facilite le logement et l'accession des salariés à la propriété et à la location de locaux d'habitation. À cet effet : 1° elle recherche les possibilités d'offre de logements correspondant aux besoins du personnel, en liaison avec les organismes habilités à collecter la participation des employeurs à l'effort de construction ; 2° elle informe les salariés sur leurs conditions d'accès à la propriété ou à la location et les assiste dans les démarches d'obtention des aides financières auxquelles ils peuvent prétendre. Réunions : ${ex("deux par an ; compte rendu annuel au comité")}. »`),
      h("4. Commission de l'égalité professionnelle (L. 2315-56)"),
      par(`« Il est constitué une commission de l'égalité professionnelle, composée de ${ex(String(membres(4)) + " membres")}, dont ${ex("Camille MARTIN, rapporteure")}. Elle est notamment chargée de préparer les délibérations du comité prévues au 3° de l'article L. 2312-17, dans les domaines qui relèvent de sa compétence. Elle travaille à partir des données de la base de données économiques, sociales et environnementales (rubrique égalité professionnelle) et de l'index publié. Réunions : ${ex("deux par an, dont une avant la consultation sur la politique sociale")}. »`),
      h("5. Moyens et fonctionnement communs (exemple)"),
      puce(`Temps de réunion : ${ex("payé comme temps de travail, non imputé sur les heures de délégation")} — à caler sur les règles applicables et sur votre accord éventuel.`),
      puce(`Accès aux informations : ${ex("rubriques utiles de la BDESE ouvertes en lecture aux membres de chaque commission")}.`),
      puce(`Experts et techniciens adjoints avec voix consultative (L. 2315-45) : ${ex("le responsable formation pour la commission formation, le contrôleur de gestion sociale pour l'égalité")} — soumis au secret professionnel et à l'obligation de discrétion.`),
      puce(`Rapports : chaque commission remet un rapport soumis à la délibération du comité — calendrier : ${ex("rapport formation en " + plusJours(p, 75).slice(0, 7) + ", rapport égalité en " + plusJours(p, 200).slice(0, 7))}.`),
      h("6. Cas des entreprises de moins de trois cents salariés"),
      par("Elles ne sont pas tenues par ce régime supplétif ; l'article L. 2315-50 leur ouvre en revanche la possibilité de se grouper entre elles pour former la commission d'information et d'aide au logement — une piste utile aux petits effectifs sur un même bassin."),
      ...aPers(["L'existence (ou non) d'un accord L. 2315-45 : c'est la première question, et elle change tout",
        "Le nombre de membres et les noms, commission par commission",
        "Le rythme de réunions, les moyens et les experts adjoints",
        "Les dates de délibération et de remise des rapports"]),
      noteFin("le fonctionnement complet du comité et de ses commissions (heures, budgets, consultations préparées par les commissions) s'audite dans le module « comité social et économique ».")],
  }; },

  "SOC-INS-COMMISSION-ECO": p => ({
    titre: "Délibération de constitution de la commission économique (1 000 salariés)",
    lignes: [...entete(p, "création de la commission économique du comité, à défaut d'accord (L. 2315-46)"),
      h("1. Le cadre, lu à la source"),
      puce("En l'absence d'accord prévu à l'article L. 2315-45, dans les entreprises d'au moins mille salariés, une commission économique est créée au sein du comité social et économique OU du comité social et économique central (L. 2315-46)."),
      puce("Elle est chargée notamment d'étudier les documents économiques et financiers recueillis par le comité et toute question que ce dernier lui soumet (L. 2315-46)."),
      puce("Première vérification : un accord d'entreprise organise-t-il déjà les commissions (L. 2315-45) ? S'il existe, il commande — cette délibération ne vaut qu'à défaut."),
      h("2. Choisir le niveau : comité unique ou comité central"),
      par(`${nomE(p)} déclare ${eff(p)} salariés. Dans une entreprise à établissements distincts, la commission économique se constitue au niveau du comité central — c'est là que remontent les documents économiques et financiers consolidés ; dans une entreprise à comité unique, au niveau de ce comité. Niveau retenu dans l'exemple : ${ex("comité social et économique central")}.`),
      h("3. Délibération (à porter au procès-verbal)"),
      par(`« Le comité social et économique ${ex("central")} de ${nomE(p)}, réuni le ${ex(plusJours(p, 28))}, constate qu'aucun accord au sens de l'article L. 2315-45 n'organise ses commissions et que l'effectif de l'entreprise atteint mille salariés. En conséquence, il crée en son sein une commission économique, composée de ${ex("cinq membres")} : ${ex("Sacha LEROY (rapporteur), Camille MARTIN, Dominique BERNARD, Andrea COSTA, Paul DURAND")}. La commission étudie les documents économiques et financiers recueillis par le comité et toute question que celui-ci lui soumet. Elle rend compte au comité par un rapport soumis à sa délibération. Durée : celle des mandats en cours. »`),
      h("4. Programme de travail (exemple chiffré)"),
      puce(`Réunions : ${ex("deux par an au moins — les " + plusJours(p, 45) + " et " + plusJours(p, 225))}, dont une en préparation de la consultation sur la situation économique et financière.`),
      puce(`Documents étudiés : ${ex("comptes annuels et rapport de gestion, comptes prévisionnels, situation de trésorerie, rubriques financières de la BDESE, documents remis à l'expert-comptable du comité")}.`),
      puce(`Experts et techniciens adjoints avec voix consultative (L. 2315-45) : ${ex("le directeur administratif et financier, invité sur les points de méthode")} — secret professionnel et obligation de discrétion applicables.`),
      puce(`Questions soumises par le comité : ${ex("effets du plan d'investissement sur l'emploi, structure de l'endettement, comparaison des marges par établissement")}.`),
      h("5. Articulation"),
      puce("Avec la BDESE : la commission travaille d'abord sur les rubriques financières de la base — vérifiez qu'elles sont alimentées avant la première réunion."),
      puce("Avec l'expertise comptable du comité : la commission prépare et exploite, elle ne remplace pas le recours à l'expert lorsque le comité le décide."),
      ...aPers(["L'existence d'un accord L. 2315-45, qui écarte ce régime supplétif",
        "Le niveau retenu (comité unique ou comité central) et les noms des membres",
        "Le calendrier des réunions et la liste des documents réellement remis"]),
      noteFin("les consultations économiques du comité, leurs délais et l'expertise s'auditent dans le module « comité social et économique ».")],
  }),

  "SOC-INS-COMMISSION-MARCHES": p => ({
    titre: "Commission des marchés du comité : délibération et procédure d'achat",
    lignes: [...entete(p, "création de la commission des marchés au sein du comité (L. 2315-44-1, D. 2315-29)"),
      h("1. Le critère : les comptes du comité, pas l'effectif de l'entreprise"),
      puce("Une commission des marchés est créée au sein du comité social et économique qui dépasse, pour au moins deux des trois critères mentionnés au II de l'article L. 2315-64, des seuils fixés par décret (L. 2315-44-1)."),
      puce("Ces seuils sont : 1° le nombre de cinquante salariés du comité à la clôture d'un exercice ; 2° le montant de ressources annuelles prévu au 2° de l'article R. 612-1 du code de commerce, ressources définies à l'article D. 2315-34 ; 3° le montant du total du bilan prévu au 3° de l'article R. 612-1 du code de commerce (D. 2315-29)."),
      puce("Le seuil mentionné à l'article L. 2315-44-2 — celui à partir duquel un marché passe par la commission — est fixé à 30 000 euros (D. 2315-29, dernier alinéa)."),
      puce(`Conséquence pratique : l'effectif de l'entreprise (${eff(p)} salariés ici) n'entre pas dans le test. Ce sont les comptes du comité qui décident — le trésorier et l'expert-comptable du comité les tiennent.`),
      h("2. Le test, à faire à chaque clôture des comptes du comité (exemple chiffré)"),
      puce(`Critère 1 — salariés du comité à la clôture de l'exercice ${ex(String(Number(jour0(p).slice(0, 4)) - 1))} : ${ex("6 salariés — seuil de cinquante NON dépassé")}.`),
      puce(`Critère 2 — ressources annuelles (D. 2315-34) : ${ex("1 920 000 € — seuil du 2° de R. 612-1 du code de commerce dépassé (montant à reprendre du texte en vigueur : il n'a pas été vérifié au relais, R. 612-1 relevant du code de commerce)")}.`),
      puce(`Critère 3 — total du bilan du comité : ${ex("2 400 000 € — seuil du 3° de R. 612-1 dépassé")}.`),
      puce(`Résultat de l'exemple : deux des trois critères dépassés → la commission des marchés est due. Deux suffisent : ce n'est pas un cumul des trois.`),
      h("3. Délibération de constitution (à porter au procès-verbal du comité)"),
      par(`« Le comité social et économique de ${nomE(p)}, réuni le ${ex(plusJours(p, 30))}, constate qu'il dépasse, pour au moins deux des trois critères de l'article D. 2315-29, les seuils réglementaires. En conséquence, il crée en son sein une commission des marchés, composée de ${ex("trois membres : Andrea COSTA (trésorière, rapporteure), Sacha LEROY, Paul DURAND")}. La commission choisit les fournisseurs et prestataires du comité pour les marchés dont le montant dépasse 30 000 euros, et rend compte au comité. Durée : celle des mandats en cours. »`),
      h("4. Procédure d'achat au-delà de 30 000 euros (exemple)"),
      puce(`Expression du besoin et cahier des charges par le comité : ${ex("prestation de voyages et séjours, budget prévisionnel 145 000 €")}.`),
      puce(`Consultation d'au moins ${ex("trois")} prestataires ; ouverture et analyse des offres par la commission le ${ex(plusJours(p, 60))} — critères de choix arrêtés à l'avance et écrits.`),
      puce(`Choix motivé, porté à la délibération du comité, et rapport annuel de la commission joint aux comptes du comité.`),
      puce("Conflits d'intérêts : chaque membre déclare les liens éventuels avec les candidats — la déclaration est consignée."),
      h("5. Qui fait quoi"),
      par("La commission est une obligation DU COMITÉ : c'est lui qui la crée et la fait fonctionner. L'employeur n'en est pas le maître d'œuvre — mais il a intérêt à signaler l'obligation par écrit au comité, car des marchés passés hors procédure fragilisent la gestion des activités sociales et culturelles et alimentent les contentieux internes."),
      ...aPers(["Les chiffres réels des comptes du comité (les trois critères se testent sur eux)",
        "Les montants des seuils du 2° et du 3° de R. 612-1 du code de commerce, à reprendre du texte en vigueur — non vérifiés ici, ce code n'étant pas servi par le relais",
        "Les membres de la commission et les critères de choix des fournisseurs",
        "La procédure interne d'achat et son seuil de déclenchement (30 000 euros au plus tard)"]),
      noteFin("les comptes du comité, leur certification et leur présentation s'auditent dans le module « comité social et économique ».")],
  }),

  "SOC-INS-FORMATION-ELUS": p => {
    const n = effN(p);
    const d = r2314(p);
    const titulaires = d ? d.titulaires : null;
    const benef = titulaires !== null ? titulaires * 2 + 1 : null; /* titulaires + suppléants + référent */
    const cout = benef !== null ? benef * 5 * 400 : null;
    return {
    titre: "Formation santé-sécurité des élus : programmation et budget",
    lignes: [...entete(p, "formation en santé, sécurité et conditions de travail des membres du comité et du référent (L. 2315-18, L. 2315-16)"),
      h("1. Ce que la loi impose, lu à la source"),
      puce("Les membres de la délégation du personnel du comité social et économique ET le référent prévu au dernier alinéa de l'article L. 2314-1 (référent harcèlement du comité) bénéficient de la formation nécessaire à l'exercice de leurs missions en matière de santé, de sécurité et de conditions de travail (L. 2315-18)."),
      puce("Durée minimale : CINQ JOURS lors du premier mandat des membres de la délégation du personnel."),
      puce("En cas de renouvellement du mandat, durée minimale : trois jours pour chaque membre, quelle que soit la taille de l'entreprise ; CINQ jours pour les membres de la commission santé, sécurité et conditions de travail dans les entreprises d'au moins trois cents salariés (L. 2315-18, 1° et 2°)."),
      puce("Le financement de cette formation est pris en charge par l'employeur, dans des conditions prévues par décret en Conseil d'État (L. 2315-18, dernier alinéa)."),
      puce("Le temps consacré aux formations est pris sur le temps de travail et rémunéré comme tel ; il n'est pas déduit des heures de délégation (L. 2315-16)."),
      puce("À retenir : l'obligation naît avec le comité — donc dès onze salariés, et non à trois cents. Le seuil de trois cents ne joue que sur la durée du renouvellement des membres de la CSSCT."),
      h("2. Recensement des bénéficiaires (chiffré pour l'effectif déclaré)"),
      titulaires !== null
        ? puce(`Pour ${eff(p)} salariés, la table de l'article R. 2314-1 (extraite par le module comité) donne ${titulaires} titulaires — et autant de suppléants : ${ex(String(titulaires * 2) + " élus")}, plus le référent harcèlement désigné par le comité, soit ${ex(String(benef) + " personnes à former")}.`)
        : puce("Le nombre d'élus se lit dans la table de l'article R. 2314-1 : renseignez l'effectif pour qu'il se calcule — la formation vise tous les membres de la délégation du personnel et le référent du comité."),
      puce(`Répartition premiers mandats / renouvellements : ${ex(benef !== null ? String(Math.ceil(benef * 0.6)) + " premiers mandats (5 jours) et " + String(benef - Math.ceil(benef * 0.6)) + " renouvellements (3 jours, 5 pour les membres de la CSSCT à partir de trois cents salariés)" : "à établir élu par élu")}.`),
      h("3. Programmation (exemple daté)"),
      puce(`Choix de l'organisme : ${ex("organisme agréé retenu après consultation de trois offres, décision le " + plusJours(p, 20))}.`),
      puce(`Session 1 — premiers mandats, cinq jours : ${ex("du " + plusJours(p, 45) + " au " + plusJours(p, 49))}.`),
      puce(`Session 2 — renouvellements, trois jours : ${ex("du " + plusJours(p, 75) + " au " + plusJours(p, 77))}.`),
      n !== null && n >= 300 ? puce(`Session 3 — membres de la CSSCT en renouvellement, cinq jours (entreprise d'au moins trois cents salariés) : ${ex("du " + plusJours(p, 100) + " au " + plusJours(p, 104))}.`) : puce("Session CSSCT : sans objet sous trois cents salariés — la durée de cinq jours au renouvellement ne vise que les membres de la CSSCT des entreprises d'au moins trois cents salariés."),
      puce(`Convocations envoyées aux élus et au référent, ordre du jour du comité mentionnant la programmation : le ${ex(plusJours(p, 25))}.`),
      h("4. Budget (exemple chiffré — coûts indicatifs à remplacer par vos devis)"),
      puce(cout !== null
        ? `Coût pédagogique : ${ex(String(benef) + " personnes × 5 jours × 400 € = " + cout.toLocaleString("fr-FR") + " €")} — hypothèse haute (tous en premier mandat).`
        : `Coût pédagogique : ${ex("nombre de bénéficiaires × durée × prix journée de l'organisme")}.`),
      puce(`Frais annexes : ${ex("déplacements et repas, 120 € par personne et par session")}.`),
      puce(`Maintien de salaire pendant la formation : ${ex("temps payé comme temps de travail, sans imputation sur les heures de délégation (L. 2315-16) — à provisionner en masse salariale, pas en budget formation")}.`),
      puce("Prise en charge : le financement de la formation santé-sécurité incombe à l'employeur (L. 2315-18) ; les modalités relèvent d'un décret en Conseil d'État, non vérifié ici — faites confirmer le circuit de facturation avant engagement."),
      h("5. Traces à conserver"),
      puce(`Convocations, attestations de présence et attestations de fin de formation, par élu : ${ex("archivées au dossier du comité et au SIRH")}.`),
      puce(`Mention au procès-verbal du comité de la programmation et de sa réalisation : ${ex("réunions des " + plusJours(p, 25) + " et " + plusJours(p, 110))}.`),
      ...aPers(["La liste nominative réelle des élus (titulaires ET suppléants) et du référent du comité",
        "Le partage premiers mandats / renouvellements, qui commande les durées",
        "L'organisme retenu et le prix réel de la journée (l'exemple retient 400 €, à remplacer par vos devis)",
        "Les dates de sessions, compatibles avec l'activité"]),
      noteFin("la formation des élus, ses conditions et le contentieux de la prise en charge s'auditent dans le module « comité social et économique ».")],
  }; },

  "SOC-INS-REUNIONS-SST": p => {
    const an = Number(jour0(p).slice(0, 4));
    return {
    titre: "Calendrier annuel des réunions santé-sécurité du comité et courriers d'information",
    lignes: [...entete(p, "quatre réunions annuelles au moins portant sur la santé, la sécurité et les conditions de travail (L. 2315-27)"),
      h("1. La règle, lue à la source"),
      puce("Au moins quatre réunions du comité portent annuellement, en tout ou partie, sur ses attributions en matière de santé, sécurité et conditions de travail — plus fréquemment en cas de besoin, notamment dans les branches d'activité présentant des risques particuliers."),
      puce("Le comité est en outre réuni à la suite de tout accident ayant entraîné ou ayant pu entraîner des conséquences graves, en cas d'événement grave lié à l'activité ayant porté ou pu porter atteinte à la santé publique ou à l'environnement, ou à la demande motivée de deux de ses membres représentants du personnel sur ces sujets."),
      puce("Lorsque l'employeur est défaillant, et à la demande d'au moins la moitié des membres du comité, celui-ci peut être convoqué par l'agent de contrôle de l'inspection du travail et siéger sous sa présidence."),
      puce("L'employeur INFORME ANNUELLEMENT l'agent de contrôle de l'inspection du travail, le médecin du travail et l'agent des services de prévention des organismes de sécurité sociale du calendrier retenu pour ces réunions, et leur CONFIRME PAR ÉCRIT chaque réunion au moins quinze jours à l'avance."),
      puce("Ces quatre réunions ne s'ajoutent pas aux réunions du comité : ce sont des réunions du comité dont l'ordre du jour porte, en tout ou partie, sur la santé et la sécurité."),
      h("2. Calendrier annuel " + an + " (exemple daté)"),
      puce(`Réunion 1 — ${ex(plusJours(p, 20))} : bilan annuel de la situation générale de santé-sécurité et programme annuel de prévention ; suites du document unique.`),
      puce(`Réunion 2 — ${ex(plusJours(p, 110))} : inspections trimestrielles et suites, accidents et presque-accidents du trimestre, plan d'actions.`),
      puce(`Réunion 3 — ${ex(plusJours(p, 200))} : rapport annuel du médecin du travail et fiche d'entreprise, suivi des postes à risques particuliers.`),
      puce(`Réunion 4 — ${ex(plusJours(p, 290))} : bilan des actions de l'année, priorités de l'année suivante, révision du document unique.`),
      puce(`Réunions supplémentaires prévisibles : ${ex("une réunion après tout accident grave, sous 48 heures ; réunion exceptionnelle sur demande motivée de deux élus")}.`),
      h("3. Courrier annuel d'information (trame)"),
      par(`« À l'agent de contrôle de l'inspection du travail — unité de contrôle ${ex("n° 3")} ; au médecin du travail, ${ex("service AST Prévention")} ; à l'agent des services de prévention de ${ex("la CARSAT")}. Madame, Monsieur, en application de l'article L. 2315-27 du code du travail, ${nomE(p)} (${eff(p)} salariés) vous communique le calendrier des réunions du comité social et économique consacrées, en tout ou partie, aux sujets relevant de la santé, de la sécurité et des conditions de travail pour l'année ${ex(String(an))} : ${ex(plusJours(p, 20) + ", " + plusJours(p, 110) + ", " + plusJours(p, 200) + " et " + plusJours(p, 290))}. Chacune de ces réunions vous sera confirmée par écrit au moins quinze jours à l'avance. Vous êtes invités à y assister. ${ex("Camille MARTIN, directrice des ressources humaines")}, le ${ex(plusJours(p, 5))}. »`),
      h("4. Courrier de confirmation à J-15 (trame)"),
      par(`« Madame, Monsieur, conformément à l'article L. 2315-27, nous vous confirmons la tenue de la réunion du comité social et économique consacrée aux sujets de santé, de sécurité et de conditions de travail, le ${ex(plusJours(p, 20))} à ${ex("14 heures")}, ${ex("salle du conseil, siège de Villeneuve-Nord")}. Ordre du jour joint. ${ex("Camille MARTIN")}, le ${ex(plusJours(p, 5))}. »`),
      h("5. Tenue de la preuve"),
      puce(`Registre des envois : ${ex("courriels avec accusé de réception, archivés au dossier du comité")} — l'information annuelle et chaque confirmation à J-15 doivent pouvoir être produites.`),
      puce(`Ordres du jour et procès-verbaux mentionnant explicitement les points santé-sécurité : ${ex("mention « point santé, sécurité et conditions de travail » en tête d'ordre du jour")} — c'est ce qui prouve que quatre réunions y ont porté.`),
      ...aPers(["Les quatre dates réelles, calées sur le rythme de vos réunions",
        "Les destinataires exacts (unité de contrôle, service de prévention et de santé au travail, organisme de sécurité sociale compétent)",
        "Les ordres du jour et le circuit d'archivage des envois"]),
      noteFin("le nombre total de réunions dues, les délais de consultation et les ordres du jour s'auditent dans le module « comité social et économique » (contrôles CSE-CTL-CON-05 et CSE-CTL-CON-06).")],
  }; },

  "SOC-INS-GROUPE": p => ({
    titre: "Courrier à l'entreprise dominante : constitution du comité de groupe",
    lignes: [...entete(p, "constitution du comité de groupe (L. 2331-1)"),
      par(`À l'attention de la direction de ${ex("HOLDING RTH PARTICIPATIONS")}, entreprise dominante du groupe.`),
      par(`Madame, Monsieur,`),
      par(`${nomE(p)} appartient au périmètre du groupe formé par votre société et les entreprises qu'elle contrôle. L'article L. 2331-1 du code du travail impose la constitution d'un comité de groupe au sein du groupe formé par l'entreprise dominante, dont le siège social est situé sur le territoire français, et les entreprises qu'elle contrôle au sens des articles L. 233-1, L. 233-3 (I et II) et L. 233-16 du code de commerce — le contrôle s'étendant, sous conditions, à la détention d'au moins 10 % du capital lorsque la permanence et l'importance des relations établissent l'appartenance à un même ensemble économique.`),
      par(`À notre connaissance, aucun comité de groupe n'est constitué. Nous vous demandons soit d'engager sa constitution — désignation des entreprises du périmètre, répartition des sièges, première réunion —, soit de nous confirmer, motifs à l'appui, que le périmètre n'y entre pas.`),
      par(`Nous restons à votre disposition pour communiquer les effectifs (${eff(p)} salariés pour notre société au ${jour0(p)}) et les éléments utiles.`),
      champ(`Signataire : ${ex("Dominique BERNARD, directeur général")} — copie : ${ex("directions des filiales du périmètre")} — le ${ex(plusJours(p, 7))}`),
      ...aPers(["Le nom réel de l'entreprise dominante et la liste des sociétés du périmètre",
        "Le signataire et les destinataires en copie",
        "Les effectifs à jour de chaque société"]),
      noteFin("le fonctionnement du comité de groupe une fois constitué (composition, réunions, information) relève des articles L. 2332-1 et suivants — non vérifiés ici : faites-les vérifier avant de rédiger le règlement de l'instance.")],
  }),

  "SOC-INS-REF-HARCELEMENT": p => ({
    titre: "Note de désignation du référent harcèlement sexuel",
    lignes: [...entete(p, "désignation du référent chargé de la lutte contre le harcèlement sexuel et les agissements sexistes (L. 1153-5-1)"),
      h("1. Désignation"),
      par(`L'effectif de ${nomE(p)} (${eff(p)} salariés) atteint deux cent cinquante salariés : un référent chargé d'orienter, d'informer et d'accompagner les salariés en matière de lutte contre le harcèlement sexuel et les agissements sexistes est désigné (L. 1153-5-1).`),
      par(`Est désignée : ${ex("Camille MARTIN, responsable des ressources humaines")} — coordonnées : ${ex("poste 4312, referent-harcelement@societe-exemple.fr, bureau 2.14")}. Suppléance en son absence : ${ex("Sacha LEROY, juriste social")}.`),
      h("2. Missions (telles que la loi les nomme)"),
      puce("Orienter les salariés : vers qui se tourner, en interne et en externe."),
      puce("Informer : textes applicables, actions ouvertes, coordonnées des autorités et services compétents."),
      puce("Accompagner : recueillir la parole, orienter vers la procédure de signalement, suivre les suites."),
      h("3. Diffusion et articulation"),
      puce(`Diffusion de la présente note et des coordonnées à l'ensemble du personnel : ${ex("affichage aux emplacements habituels, intranet, livret d'accueil")} — le ${ex(plusJours(p, 3))}.`),
      puce("Articulation avec le référent désigné par le comité social et économique parmi ses membres, et avec l'information harcèlement affichée (voir le modèle d'affiche du présent plan)."),
      puce(`Formation du référent : ${ex("une journée dédiée, programmée le " + plusJours(p, 45))}.`),
      ...aPers(["Le nom, la fonction et les coordonnées réelles du référent (et de son suppléant)",
        "Les canaux de diffusion effectifs et leur date",
        "La date de formation du référent"]),
      noteFin("les référents, l'information et la réaction au signalement s'auditent dans le module « santé, sécurité et conditions de travail ».")],
  }),

  /* ────────────────────────────────────── documents obligatoires ─────── */

  "SOC-DOC-RI": p => ({
    titre: "Plan complet de règlement intérieur, clause par clause",
    lignes: [...entete(p, "établissement du règlement intérieur (L. 1311-2, L. 1321-1 et suivants)"),
      h("Préambule et champ d'application"),
      par(`Le présent règlement s'applique à l'ensemble des salariés de ${nomE(p)}, en quelque lieu qu'ils travaillent, ainsi qu'aux intérimaires et stagiaires pour les règles de santé, sécurité et discipline générale. Il est rédigé en français (L. 1321-6) ; des dispositions spéciales peuvent viser une catégorie de personnel ou une division (L. 1311-2, dernier alinéa) — ${ex("titre IV propre aux personnels roulants")}.`),
      h("Titre I — Santé et sécurité (L. 1321-1, 1°)"),
      puce(`Mesures d'application de la réglementation santé-sécurité dans l'entreprise, dont les instructions données aux salariés (renvoi de L. 1321-1 à L. 4122-1) : ${ex("port des équipements de protection fournis, respect du plan de circulation, interdiction de neutraliser un dispositif de sécurité, obligation de signaler toute défaillance")}.`),
      puce(`Consignes propres à l'activité (${secteurProfil(p).nom}) : ${ex(secteurProfil(p).unites[0][2])}.`),
      puce("Visites médicales et suivi de l'état de santé : obligation de s'y présenter."),
      h("Titre II — Participation au rétablissement de conditions de travail protectrices (L. 1321-1, 2°)"),
      par("Conditions dans lesquelles les salariés peuvent être appelés à participer, à la demande de l'employeur, au rétablissement de conditions de travail protectrices de la santé et de la sécurité, dès lors qu'elles apparaîtraient compromises."),
      h("Titre III — Discipline (L. 1321-1, 3°)"),
      puce("Règles générales et permanentes de discipline : horaires, accès aux locaux, usage du matériel et des outils numériques, absences et justification."),
      puce(`Nature et échelle des sanctions : ${ex("avertissement ; mise à pied disciplinaire de trois jours au plus ; mutation disciplinaire ; rétrogradation ; licenciement pour faute")}. L'échelle est limitative : aucune sanction non prévue ne peut être prononcée ; aucune amende ni sanction pécuniaire.`),
      h("Titre IV — Droits de la défense (L. 1321-2, 1°)"),
      par("Rappel des dispositions relatives aux droits de la défense des salariés (articles L. 1332-1 à L. 1332-3 : information écrite des griefs, entretien préalable pour toute sanction ayant une incidence sur la présence, la fonction, la carrière ou la rémunération, notification motivée) ou des garanties de la convention collective applicable — " + `${ccn(p)} : à compléter selon la convention.`),
      h("Titre V — Harcèlements et agissements sexistes (L. 1321-2, 2°)"),
      par("Rappel des dispositions du code du travail relatives aux harcèlements moral et sexuel et aux agissements sexistes — reproduire les articles en vigueur, et renvoyer à l'affiche d'information et aux référents désignés."),
      h("Titre VI — Protection des lanceurs d'alerte (L. 1321-2, 3°)"),
      par("Mention de l'existence du dispositif de protection des lanceurs d'alerte prévu au chapitre II de la loi n° 2016-1691 du 9 décembre 2016, et de la procédure interne de recueil des signalements — " + ex("adresse dédiée alerte@societe-exemple.fr") + "."),
      h("Clause facultative — Neutralité (L. 1321-2-1)"),
      par("Le règlement peut contenir des dispositions inscrivant le principe de neutralité et restreignant la manifestation des convictions des salariés, si ces restrictions sont justifiées par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, et proportionnées au but recherché. N'insérer la clause que si ce double test est documenté."),
      h("Limites impératives (L. 1321-3)"),
      puce("Aucune disposition contraire aux lois, règlements, conventions et accords applicables ;"),
      puce("aucune restriction aux droits des personnes et aux libertés individuelles et collectives qui ne serait pas justifiée par la nature de la tâche ni proportionnée au but recherché ;"),
      puce("aucune disposition discriminatoire, à capacité professionnelle égale."),
      h("Formalités et vie du texte (L. 1321-4, L. 1321-5)"),
      puce(`Avis du comité social et économique : réunion du ${ex(plusJours(p, 30))} — l'avis accompagne le texte.`),
      puce(`Transmission à l'inspection du travail (deux exemplaires, avec l'avis) et dépôt au greffe du conseil de prud'hommes de ${ex("Villeneuve-Nord")} : le ${ex(plusJours(p, 37))}.`),
      puce(`Publicité auprès des salariés par tout moyen : le ${ex(plusJours(p, 37))} — entrée en vigueur : le ${ex(plusJours(p, 68))}, la date devant être postérieure d'un mois à l'accomplissement des formalités.`),
      puce("Notes de service portant obligations générales et permanentes dans ces matières : adjonctions au règlement, soumises aux mêmes formalités — sauf urgence santé-sécurité, à application immédiate avec communication simultanée au secrétaire du comité et à l'inspection (L. 1321-5)."),
      ...aPers(["Les consignes santé-sécurité propres à vos locaux et métiers",
        "L'échelle des sanctions retenue (l'exemple est une échelle classique — la durée maximale de mise à pied doit être chiffrée)",
        "Les garanties disciplinaires de la convention " + ccn(p) + " (à compléter selon la convention)",
        "L'adresse du dispositif d'alerte interne et les référents",
        "Les dates des formalités et le greffe territorialement compétent"]),
      noteFin("faites relire le projet avant consultation du comité : une clause illicite est inopposable et peut être retirée à tout moment par le juge ou l'inspection.")],
  }),

  "SOC-DOC-DUERP": p => {
    const s = secteurProfil(p);
    return {
    titre: "Document unique (DUERP) : structure intégrale et exemple chiffré",
    lignes: [...entete(p, "établissement du document unique d'évaluation des risques professionnels (R. 4121-1)"),
      h("1. Identification"),
      puce(`Entreprise : ${nomE(p)} — effectif : ${eff(p)} — activité : ${s.nom}.`),
      puce(`Date d'établissement : ${ex(plusJours(p, 30))} — responsable de l'évaluation : ${ex("Dominique BERNARD, responsable QSE")} — avec l'appui du service de prévention et de santé au travail ${ex("AST Prévention")}.`),
      h("2. Unités de travail et inventaire des risques (R. 4121-1 : un inventaire par unité, ambiances thermiques comprises)"),
      ...s.unites.flatMap(([u, r, m], i) => [
        puce(`Unité ${i + 1} — ${u}`),
        puce(`· Risques identifiés : ${ex(r)}`),
        puce(`· Mesures existantes : ${ex(m)}`),
        puce(`· Cotation (gravité × fréquence) : ${ex(i === 0 ? "élevée — priorité 1" : i === 1 ? "moyenne — priorité 2" : "modérée — priorité 3")} ; actions à engager : ${ex(i === 0 ? "programme dédié, échéance " + plusJours(p, 120) : "voir plan d'actions")}`),
      ]),
      h("3. Suites données"),
      par(`À partir de cinquante salariés, les résultats débouchent sur un programme annuel de prévention des risques professionnels et d'amélioration des conditions de travail ; en deçà, sur une liste d'actions consignée dans le document — pour ${eff(p)} salariés : ${ex("programme annuel présenté au comité avec la consultation politique sociale")}.`),
      h("4. Vie du document (R. 4121-2, R. 4121-4)"),
      puce("Mise à jour : au moins annuelle à partir de onze salariés ; à chaque aménagement important modifiant les conditions de santé, de sécurité ou de travail ; à chaque information supplémentaire intéressant l'évaluation d'un risque."),
      puce(`Prochaine mise à jour annuelle : au plus tard le ${ex(plusJours(p, 395))}.`),
      puce("Conservation du document et de ses versions successives pendant quarante ans, tenus à la disposition des travailleurs, des anciens travailleurs, du comité et des services compétents (R. 4121-4)."),
      puce(`Modalités d'accès portées à la connaissance du personnel : ${ex("intranet QSE et classeur au bureau du responsable, mentionnés au livret d'accueil")}.`),
      ...aPers(["Le découpage réel en unités de travail (l'exemple découpe une activité " + s.nom + " en " + s.unites.length + " unités)",
        "Les risques, cotations et mesures propres à chaque unité — l'évaluation ne se délègue pas à un modèle",
        "Le nom du responsable et du service de prévention",
        "Les échéances du plan d'actions"]),
      noteFin("les huit contrôles du document unique (existence, inventaire, mises à jour, suites, conservation, consultation du comité, transmission) se passent dans le module « santé, sécurité et conditions de travail ».")],
  }; },

  "SOC-DOC-BDESE": p => {
    const n = effN(p);
    const grand = n !== null && n >= 300;
    const c = grand ? DM.bdese.auMoins300 : DM.bdese.moins300;
    const lignes = [...entete(p, "constitution de la base de données économiques, sociales et environnementales"),
      h("1. Cadrage"),
      puce(`Support : ${ex("espace intranet dédié, accès nominatifs")} — droits d'accès : ${ex("membres du comité et délégués syndicaux, lecture seule, confidentialité marquée rubrique par rubrique")}.`),
      puce(`Responsable de l'alimentation : ${ex("Camille MARTIN, direction financière et DRH conjointement")} — mise à jour : ${ex("trimestrielle, et avant chaque consultation récurrente")}.`),
      puce(`Première mise à disposition notifiée aux élus le ${ex(plusJours(p, 45))}.`),
      h(`2. Structure intégrale — régime supplétif ${c.article} (${c.seuil}), version ${c.version}`),
      par(n === null
        ? "L'effectif n'étant pas renseigné, la structure ci-dessous est celle des entreprises d'au moins trois cents salariés — la plus complète ; en deçà, certaines rubriques s'allègent (R. 2312-8)."
        : `Pour ${eff(p)} salariés, le contenu supplétif est celui de ${c.article} : dix rubriques, détaillées ci-dessous section par section. Un accord d'entreprise peut en adapter l'organisation sans descendre sous le plancher légal.`)];
    for (const r of c.rubriques) {
      lignes.push(h(`Rubrique ${r.n} — ${r.titre}`));
      for (const sec of r.sections) {
        if (sec.titre) lignes.push(puce((sec.lettre ? sec.lettre + " — " : "") + sec.titre));
        for (const su of sec.sujets) lignes.push(puce("· " + su));
      }
    }
    lignes.push(h("3. Le plancher d'ordre public (" + DM.bdese.plancherSource + ")"),
      par("Quel que soit l'accord, la base comporte au moins les thèmes suivants : " + DM.bdese.plancher.join(" ; ") + "."),
      h("4. Exemple de première alimentation (fictif)"),
      puce(`Rubrique 1 (investissement social) : ${ex("effectif au 31 décembre par type de contrat, par âge et par ancienneté — extraction paie de " + jour0(p).slice(0, 4))}.`),
      puce(`Rubrique égalité professionnelle : ${ex("situation comparée femmes-hommes par catégorie — base des entretiens et de l'index")}.`),
      puce(`Rubriques financières : ${ex("liasse fiscale du dernier exercice clos, capitaux propres, endettement")}.`),
      ...aPers(["Le support réel et la liste nominative des accès",
        "Le contenu de chaque sujet : la structure ci-dessus est la liste légale intégrale, les données sont les vôtres",
        "Ce qu'un accord BDESE a pu adapter (organisation, périodicité, confidentialité) — sans descendre sous le plancher"]),
      noteFin("le régime (accord ou supplétif), l'exigibilité rubrique par rubrique et les contrôles se passent dans le module « base de données (BDESE) » (audit-bdese.html), dont le présent découpage est issu."));
    return { titre: "BDESE : ossature intégrale pour l'effectif déclaré", lignes };
  },

  "SOC-DOC-INDEX": p => ({
    titre: "Index de l'égalité professionnelle : feuille de route et exemple chiffré",
    lignes: [...entete(p, "calcul et publication annuels des indicateurs d'écarts de rémunération (L. 1142-8)"),
      h("1. Ce que la loi impose (lu à la source)"),
      par("Dans les entreprises d'au moins cinquante salariés, l'employeur publie chaque année l'ensemble des indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer, selon des modalités et une méthodologie définies par décret ; les indicateurs sont aussi rendus publics sur le site du ministère chargé du travail (L. 1142-8)."),
      par("Les intitulés et barèmes précis des indicateurs relèvent du décret (D. 1142-2), que le relais n'a pas confirmé — consigné à part : reprenez-les du décret en vigueur ou du simulateur officiel avant calcul."),
      h("2. Feuille de route (exemple daté)"),
      puce(`Période de référence retenue : ${ex("l'année civile " + (Number(jour0(p).slice(0, 4)) - 1))}.`),
      puce(`Constitution de la base de calcul (rémunérations par sexe, âge, catégorie ; augmentations ; promotions ; retours de congé maternité ; plus hautes rémunérations) : extraction paie le ${ex(plusJours(p, 15))}, par ${ex("Camille MARTIN, responsable paie")}.`),
      puce(`Calcul des indicateurs sur l'outil officiel et revue par la direction : le ${ex(plusJours(p, 30))}.`),
      puce(`Note globale obtenue : ${ex("84 points sur 100")}.`),
      puce(`Publication sur le site de l'entreprise et télédéclaration : le ${ex(plusJours(p, 40))} — communication au comité avec les données par la BDESE.`),
      h("3. Si la note est sous les seuils réglementaires (exemple)"),
      puce(`Mesures de correction et objectifs de progression : ${ex("enveloppe de rattrapage salarial ciblée de 0,2 % de la masse salariale ; revue des critères de promotion ; garantie d'augmentation au retour de congé maternité")}.`),
      puce("Publication de ces mesures et objectifs dans les conditions réglementaires — à vérifier au décret."),
      ...aPers(["La période de référence et la note réellement obtenue",
        "Les intitulés et barèmes des indicateurs, repris du décret en vigueur (non confirmés au relais)",
        "Les mesures de correction si la note l'exige, et leur budget"]),
      noteFin("l'exposition à la pénalité en cas de non-publication se mesure dans le module « négociation obligatoire (NAO) », contrôle égalité.")],
  }),

  "SOC-DOC-OETH": p => {
    const n = effN(p);
    const cible = n !== null ? Math.floor(n * 0.06) : null;
    return {
    titre: "Obligation d'emploi des travailleurs handicapés : état chiffré et déclaration",
    lignes: [...entete(p, "régularisation de l'obligation d'emploi (L. 5212-1, L. 5212-2, L. 5212-5)"),
      h("1. L'assiette, chiffrée pour l'effectif déclaré"),
      puce(`Effectif d'assujettissement : ${eff(p)} salariés — l'obligation d'emploi s'applique à tout employeur d'au moins vingt salariés (L. 5212-1).`),
      puce(cible !== null
        ? `Proportion minimale : 6 % de l'effectif total (L. 5212-2), soit ${cible} bénéficiaires pour ${eff(p)} salariés.`
        : "Proportion minimale : 6 % de l'effectif total (L. 5212-2) — renseignez l'effectif pour chiffrer la cible."),
      puce(`Bénéficiaires actuellement décomptés : ${ex(cible !== null ? String(Math.max(0, Math.round(cible * 0.6))) : "12")} — écart à couvrir : ${ex(cible !== null ? String(cible - Math.max(0, Math.round(cible * 0.6))) : "8")}.`),
      h("2. La déclaration (L. 5212-5)"),
      puce("La situation se déclare au moyen de la déclaration sociale nominative ; à défaut de toute déclaration, l'employeur est réputé ne pas satisfaire à l'obligation (L. 5212-5)."),
      puce(`Déclaration annuelle établie par ${ex("le service paie, avec l'expert-comptable")} — échéance portée au calendrier DSN : ${ex(jour0(p).slice(0, 4) + "-05-05")} (à caler sur l'échéance réglementaire en vigueur).`),
      h("3. Les voies de couverture de l'écart (exemple de plan)"),
      puce(`Recrutements et maintiens dans l'emploi : ${ex("plan de recrutement de " + (cible !== null ? Math.max(1, Math.round((cible) * 0.1)) : 3) + " bénéficiaires sur deux ans, partenariat Cap emploi")}.`),
      puce(`Accueil de stagiaires et mises en situation professionnelle : ${ex("quatre stagiaires par an")}.`),
      puce(`Sous-traitance au secteur adapté et protégé : ${ex("contrats EA/ESAT — entretien des espaces et numérisation")}.`),
      puce("À défaut : contribution annuelle — son barème relève de textes non vérifiés ici, faites-le chiffrer par l'expert paie ; un accord agréé peut aussi couvrir l'obligation."),
      ...aPers(["Le décompte réel des bénéficiaires présents (attestations à jour)",
        "L'échéance DSN exacte de l'année en cours",
        "Le plan de couverture retenu et son budget — l'exemple mélange les voies possibles"]),
      noteFin("le calcul fin de la contribution et les déductions relèvent de textes réglementaires non servis par le relais : rien n'est affirmé ici sur leur barème.")],
  }; },

  /* ─────────────────────────────── affichages et informations ────────── */

  "SOC-AFF-HARCELEMENT": p => ({
    titre: "Affiche complète : harcèlement moral et sexuel",
    lignes: [...entete(p, "information obligatoire des salariés et des candidats (L. 1152-4, L. 1153-5)"),
      h("Texte de l'affiche — à reproduire tel quel après personnalisation"),
      par(`« Dans l'entreprise ${nomE(p)}, aucun salarié ne doit subir de harcèlement moral ni de harcèlement sexuel. L'employeur prend toutes dispositions nécessaires en vue de prévenir ces agissements, d'y mettre un terme et de les sanctionner.`),
      par("Sont portés à votre connaissance, conformément aux articles L. 1152-4 et L. 1153-5 du code du travail : le texte de l'article 222-33-2 du code pénal (harcèlement moral) et celui de l'article 222-33 du code pénal (harcèlement sexuel) — [reproduire ici les deux articles dans leur rédaction en vigueur : code pénal, hors du champ du relais de cette application] — ainsi que les actions contentieuses civiles et pénales ouvertes en matière de harcèlement sexuel et les coordonnées des autorités et services compétents :"),
      puce(`Référent harcèlement de l'entreprise : ${ex("Camille MARTIN, poste 4312, referent-harcelement@societe-exemple.fr")}`),
      puce(`Référent du comité social et économique : ${ex("Sacha LEROY, sacha.leroy@societe-exemple.fr")}`),
      puce(`Médecin du travail — service de prévention : ${ex("AST Prévention, 12 rue des Acacias, 01 23 45 67 89")}`),
      puce(`Inspection du travail : ${ex("unité de contrôle territorialement compétente, 01 23 45 67 90")}`),
      puce(`Défenseur des droits : ${ex("formulaire en ligne et délégué départemental — coordonnées à reprendre du site officiel")}`),
      par(`La liste des services figurant sur cette information est celle définie par décret (renvoi de L. 1153-5) : vérifiez-la avant affichage. »`),
      h("Mise en place"),
      puce(`Affichage dans les lieux de travail ET, pour le harcèlement sexuel, dans les locaux ou à la porte des locaux où se fait l'embauche : ${ex("panneaux des trois sites, salle de pause, espace candidats de l'accueil")}.`),
      puce(`Diffusion complémentaire par tout moyen : ${ex("intranet et livret d'accueil")} — datée du ${ex(plusJours(p, 3))}.`),
      ...aPers(["Le texte en vigueur des articles 222-33 et 222-33-2 du code pénal (à reproduire — hors du champ du relais)",
        "Les noms et coordonnées réels des référents, du service de prévention, de l'inspection",
        "La liste des services fixée par décret, à jour",
        "Les emplacements d'affichage effectifs et la date"]),
      noteFin("la prévention, les référents et la réaction au signalement s'auditent dans le module « santé, sécurité et conditions de travail ».")],
  }),

  "SOC-AFF-EGALITE": p => ({
    titre: "Affiche complète : interdiction des discriminations",
    lignes: [...entete(p, "information sur l'interdiction des discriminations (L. 1142-6)"),
      h("Texte de l'affiche"),
      par(`« Dans l'entreprise ${nomE(p)} comme dans le recrutement, toute discrimination est interdite. Conformément à l'article L. 1142-6 du code du travail, le texte des articles 225-1 à 225-4 du code pénal est porté à la connaissance des personnes ayant accès aux lieux de travail et des candidats à l'embauche : [reproduire ici les articles 225-1 à 225-4 du code pénal dans leur rédaction en vigueur — code pénal, hors du champ du relais de cette application]. »`),
      h("Mise en place"),
      puce(`Emplacements : lieux de travail et locaux — ou porte des locaux — où se fait l'embauche : ${ex("accueil du siège, salles d'entretien, panneaux des sites")}.`),
      puce(`Support : ${ex("affiche A3 et page intranet recrutement")} — mise en place datée du ${ex(plusJours(p, 3))}, par ${ex("les services généraux")}.`),
      puce(`Rappel dans les offres et procédures de recrutement : ${ex("mention type au bas des annonces")}.`),
      ...aPers(["Le texte en vigueur des articles 225-1 à 225-4 du code pénal (à reproduire)",
        "Les emplacements réels d'affichage, côté salariés et côté candidats",
        "La date de mise en place et le responsable"])],
  }),

  "SOC-AFF-COORDONNEES": p => ({
    titre: "Affiche complète : coordonnées utiles (D. 4711-1)",
    lignes: [...entete(p, "affichage des coordonnées obligatoires dans des locaux normalement accessibles aux travailleurs"),
      h("Texte de l'affiche — les trois mentions de D. 4711-1"),
      puce(`1° Médecin du travail / service de prévention et de santé au travail compétent : ${ex("AST Prévention, 12 rue des Acacias — 01 23 45 67 89 — accueil du lundi au vendredi 8 h - 17 h")}`),
      puce(`2° Services de secours d'urgence : SAMU 15 · Pompiers 18 · Numéro d'urgence européen 112 · ${ex("centre antipoison régional : 01 23 45 67 91")}`),
      puce(`3° Inspection du travail compétente, avec le nom de l'inspecteur : ${ex("unité de contrôle 3, 8 boulevard de la République — 01 23 45 67 90 — inspectrice : Mme Andrea COSTA")}`),
      h("Mise en place"),
      puce(`Emplacements (locaux normalement accessibles) : ${ex("hall d'accueil, salle de pause, vestiaires, quai — un exemplaire par site")}.`),
      puce(`Mise à jour : à chaque changement d'interlocuteur — vérification portée à l'agenda ${ex("chaque 1er septembre")} ; affichage daté du ${ex(plusJours(p, 1))}.`),
      ...aPers(["Les coordonnées réelles du service de prévention et de l'unité de contrôle (le nom de l'inspecteur change : vérifiez-le)",
        "Les emplacements par site",
        "La routine de mise à jour"])],
  }),

  "SOC-AFF-CONSIGNE-INCENDIE": p => ({
    titre: "Consigne de sécurité incendie complète (R. 4227-37)",
    lignes: [...entete(p, "établissement et affichage de la consigne de sécurité incendie"),
      h("Texte de la consigne — à afficher de manière très apparente"),
      puce(`Matériel d'extinction et de secours — emplacements : ${ex("extincteurs à chaque issue et tous les 15 mètres, RIA au quai, défibrillateur à l'accueil")}.`),
      puce(`Personnes chargées de diriger l'évacuation : ${ex("guides-files : Camille MARTIN (bâtiment A), Sacha LEROY (bâtiment B) ; serre-files : Dominique BERNARD, Andrea COSTA")}.`),
      puce(`Point de rassemblement : ${ex("parking visiteurs, angle nord")} — appel nominatif par ${ex("les guides-files, listes d'émargement du jour")}.`),
      puce(`Alerte : toute personne constatant un début d'incendie donne l'alarme (déclencheurs manuels ${ex("aux issues")}) et appelle les secours : 18 ou 112 — personne chargée de l'appel : ${ex("l'accueil, poste 9")}.`),
      puce(`Consignes particulières : ${ex("coupure des énergies par le responsable de maintenance ; mise en sécurité des quais ; interdiction d'utiliser les monte-charges")}.`),
      puce(`Accueil des secours : ${ex("un serre-file au portail, plans des locaux dans le coffret POI")}.`),
      h("Essais et exercices"),
      puce(`Exercices d'évacuation : ${ex("semestriels — prochains le " + plusJours(p, 60) + " et le " + plusJours(p, 240))} — comptes rendus consignés au registre de sécurité.`),
      puce(`Vérification du matériel : ${ex("annuelle, par l'organisme Vérif-Incendie, dernier passage le " + plusJours(p, -90))} — rapports au registre.`),
      par("Champ d'application : la consigne formalisée est due dans les établissements du champ de R. 4227-34 (plus de cinquante personnes réunies, ou matières inflammables) ; dans les autres, des instructions d'évacuation sont établies (R. 4227-37, dernier alinéa)."),
      ...aPers(["Les noms des guides-files et serre-files, par bâtiment et par équipe",
        "Les emplacements réels du matériel et du point de rassemblement",
        "Le calendrier des exercices et le prestataire de vérification"])],
  }),

  "SOC-AFF-HORAIRES": p => ({
    titre: "Affiche complète : horaire collectif de travail (L. 3171-1)",
    lignes: [...entete(p, "affichage des heures de début et de fin du travail et des repos"),
      h("Texte de l'affiche"),
      par(`« Horaire collectif applicable au personnel de ${nomE(p)} soumis à l'horaire collectif, affiché en application de l'article L. 3171-1 du code du travail (heures auxquelles commence et finit le travail, heures et durée des repos) :`),
      puce(ex("Du lundi au jeudi : 8 h 30 – 12 h 15 et 13 h 45 – 17 h 30")),
      puce(ex("Le vendredi : 8 h 30 – 12 h 15 et 13 h 45 – 16 h 30")),
      puce(ex("Repos : pause méridienne de 1 h 30 ; repos hebdomadaire samedi et dimanche")),
      par(`Affiché le ${ex(plusJours(p, 1))} — ${ex("Camille MARTIN, DRH")}. »`),
      h("Salariés hors horaire collectif"),
      puce(`Horaires individualisés ou aménagés sur l'année : l'affichage comprend la répartition de la durée du travail dans le cadre de cette organisation (L. 3171-1, al. 2) — ${ex("planning cyclique des équipes affiché au quai")}.`),
      puce(`Personnels itinérants, forfaits, roulants : décompte individuel organisé — ${ex("relevés déclaratifs hebdomadaires validés par le manager ; chronotachygraphe pour les conducteurs")}${q(p.secteur) ? ", régime propre au secteur " + q(p.secteur) + " à compléter selon la convention " + ccn(p) : ""}.`),
      puce("Astreintes : la programmation individuelle des périodes d'astreinte est portée à la connaissance de chaque salarié dans les conditions prévues (L. 3171-1, al. 3)."),
      ...aPers(["Les horaires réels par site et par service",
        "La répartition annuelle si le temps de travail est aménagé",
        "Le mode de décompte des salariés hors horaire collectif (et le régime conventionnel des roulants, à compléter selon la convention)"])],
  }),

  "SOC-AFF-DECOMPTE": p => {
    const s = secteurProfil(p);
    const n = effN(p);
    const hors = n !== null ? Math.max(1, Math.round(n * 0.35)) : 40;
    return {
    titre: "Décompte du temps de travail hors horaire collectif : documents et procédure",
    lignes: [...entete(p, "documents de décompte de la durée du travail et des repos compensateurs (L. 3171-2, L. 3171-3)"),
      h("1. Les deux obligations, lues à la source"),
      puce("Lorsque tous les salariés occupés dans un service ou un atelier ne travaillent pas selon le même horaire collectif, l'employeur établit les documents nécessaires au décompte de la durée de travail, des repos compensateurs acquis et de leur prise effective, pour chacun des salariés concernés. Le comité social et économique peut consulter ces documents (L. 3171-2)."),
      puce("L'employeur tient à la disposition de l'agent de contrôle de l'inspection du travail les documents permettant de comptabiliser le temps de travail accompli par chaque salarié ; la nature de ces documents et la durée pendant laquelle ils sont tenus à disposition sont déterminées par voie réglementaire (L. 3171-3)."),
      puce("À noter : L. 3171-3 renvoie à un texte réglementaire pour la nature des documents et la durée de conservation — ce texte n'a pas été vérifié ici, rien n'en est affirmé : faites confirmer la durée par votre conseil."),
      h("2. Cartographie des populations hors horaire collectif (exemple pour une activité " + s.nom + ")"),
      puce(`${ex(s.unites[0][0])} — mode de décompte : ${ex("relevé individuel hebdomadaire validé par le responsable ; chronotachygraphe le cas échéant")} — effectif : ${ex("28 salariés")}.`),
      puce(`Équipes successives / horaires postés : ${ex("planning cyclique nominatif, horodatage des prises de poste")} — effectif : ${ex("15 salariés")}.`),
      puce(`Horaires individualisés (badgeage) : ${ex("compteur individuel de crédit-débit, remis chaque mois au salarié")} — effectif : ${ex("22 salariés")}.`),
      puce(`Forfaits en jours : ${ex("décompte du nombre de jours travaillés, contrôle de la charge et des repos — document mensuel signé")} — effectif : ${ex("9 salariés")}.`),
      puce(`Total hors horaire collectif dans l'exemple : ${ex(String(hors) + " salariés sur " + eff(p))}.`),
      h("3. Le document individuel type (contenu)"),
      puce("Identité du salarié, service, période couverte, mode d'organisation applicable ;"),
      puce("heures de travail accomplies jour par jour, et total hebdomadaire ;"),
      puce("heures supplémentaires accomplies et leur traitement (paiement ou repos compensateur de remplacement) ;"),
      puce("repos compensateurs ACQUIS sur la période et repos EFFECTIVEMENT PRIS, avec les dates — L. 3171-2 exige les deux ;"),
      puce("visa du salarié et du responsable, date d'établissement."),
      h("4. Exemple rempli (fictif)"),
      par(ex("DURAND Paul — exploitation — semaine du " + plusJours(p, -14) + " au " + plusJours(p, -8) + " : lundi 8 h 15, mardi 9 h, mercredi 7 h 45, jeudi 9 h 30, vendredi 8 h — total 42 h 30, dont 7 h 30 supplémentaires ; contrepartie : 3 h payées, 4 h 30 en repos compensateur de remplacement. Repos acquis au compteur : 21 h 15. Repos pris sur la période : 7 h le " + plusJours(p, -10) + ". Visas : le salarié, le responsable d'exploitation.")),
      h("5. Conservation et mise à disposition"),
      puce(`Support : ${ex("module temps du SIRH, extraction PDF mensuelle horodatée et archivée")}.`),
      puce(`Tenue à la disposition de l'agent de contrôle de l'inspection du travail (L. 3171-3) : ${ex("extraction disponible sous 24 heures, procédure écrite communiquée à l'encadrement")} — durée de conservation à confirmer sur le texte réglementaire applicable.`),
      puce(`Consultation par le comité (L. 3171-2) : ${ex("modalités portées au règlement intérieur du comité — consultation sur place, sur demande, en présence du responsable RH")}.`),
      puce(`Remise au salarié : ${ex("récapitulatif mensuel joint au bulletin de paie")} — non exigé par les articles lus ici, mais c'est la meilleure preuve d'un décompte contradictoire.`),
      h("6. Pourquoi ce point se traite avant le contentieux"),
      par("En litige d'heures supplémentaires, le salarié présente des éléments suffisamment précis, et c'est à l'employeur de produire ses propres éléments de décompte. Sans documents, il n'a rien à opposer : l'obligation documentaire de L. 3171-2 et L. 3171-3 est aussi sa première protection."),
      ...aPers(["La cartographie réelle de vos populations et de leurs modes d'organisation",
        "Le support de décompte retenu et son paramétrage (repos acquis ET pris)",
        "La durée de conservation, à caler sur le texte réglementaire en vigueur",
        "Les modalités de consultation par le comité et de remise au salarié"])],
  }; },

  "SOC-AFF-EGA-REMU": p => ({
    titre: "Affiche complète : égalité de rémunération entre les femmes et les hommes (R. 3221-2)",
    lignes: [...entete(p, "information sur les textes d'égalité de rémunération (R. 3221-2)"),
      h("1. Ce que le texte impose, lu à la source"),
      par("Les dispositions des articles L. 3221-1 à L. 3221-7 du code du travail sont portées, par tout moyen, à la connaissance des personnes ayant accès aux lieux de travail, ainsi qu'aux candidats à l'embauche. Il en est de même pour les dispositions réglementaires prises pour l'application de ces articles (R. 3221-2)."),
      par("Deux publics, donc : les personnes ayant accès aux lieux de travail — salariés, intérimaires, prestataires — ET les candidats à l'embauche. Une affiche en salle de pause ne couvre pas le second."),
      h("2. Texte de l'affiche"),
      par(`« ${nomE(p)} — Égalité de rémunération entre les femmes et les hommes.`),
      par("Conformément à l'article R. 3221-2 du code du travail, sont portées à votre connaissance les dispositions des articles L. 3221-1 à L. 3221-7 du code du travail relatives à l'égalité de rémunération entre les femmes et les hommes, ainsi que les dispositions réglementaires prises pour leur application : [reproduire ici le texte en vigueur des articles L. 3221-1 à L. 3221-7 — sept articles, à reprendre intégralement de la version en vigueur à la date d'affichage]."),
      par(`Pour toute question ou réclamation sur ce sujet : ${ex("Camille MARTIN, DRH — poste 4312")} ; référent égalité du comité social et économique : ${ex("Sacha LEROY")} ; inspection du travail : ${ex("unité de contrôle 3, 01 23 45 67 90")}. Affiché le ${ex(plusJours(p, 2))}. »`),
      h("3. Mise en place, côté salariés et côté candidats (exemple)"),
      puce(`Lieux de travail : ${ex("panneau d'affichage de chaque site (3), salle de pause, vestiaires")}.`),
      puce(`Candidats à l'embauche : ${ex("affichage à l'accueil et dans les salles d'entretien ; page « nos engagements » du site carrières ; mention et lien dans chaque offre d'emploi et dans l'accusé de réception des candidatures")}.`),
      puce(`Support numérique : ${ex("intranet RH, rubrique « vos droits », et remise avec le livret d'accueil")} — « par tout moyen » autorise le numérique, à condition que l'accès soit effectif pour tous.`),
      h("4. Articulation avec les autres informations obligatoires"),
      puce("Ne pas confondre avec l'information sur les discriminations (L. 1142-6, articles 225-1 à 225-4 du code pénal) ni avec la publication de l'index (L. 1142-8) : trois obligations distinctes, trois supports — le présent modèle ne couvre que R. 3221-2."),
      puce(`Regroupement pratique : ${ex("un panneau « égalité et non-discrimination » réunissant les trois informations, chacune identifiée par son fondement")}.`),
      h("5. Mise à jour"),
      puce(`Vérification annuelle de la version des articles reproduits : ${ex("chaque 1er septembre, responsable : Camille MARTIN")} — un texte périmé ne remplit pas l'obligation.`),
      ...aPers(["Le texte en vigueur des articles L. 3221-1 à L. 3221-7 et de leurs textes d'application (à reproduire intégralement)",
        "Les emplacements réels côté salariés ET côté candidats",
        "Les interlocuteurs mentionnés et la date d'affichage"])],
  }),

  "SOC-AFF-CONVENTION": p => ({
    titre: "Avis complet : convention collective applicable (R. 2262-1)",
    lignes: [...entete(p, "information des salariés sur les textes conventionnels applicables"),
      h("Texte de l'avis"),
      par(`« La convention collective applicable au personnel de ${nomE(p)} est : ${ccn(p)}${q(p.conventionCollective) ? "" : " [à compléter]"} — ainsi que les accords d'entreprise en vigueur : ${ex("accord de méthode du " + plusJours(p, -300) + ", accord télétravail du " + plusJours(p, -500))}.`),
      par(`Conformément à l'article R. 2262-1 du code du travail : chaque salarié est informé des conventions et accords applicables au moment de l'embauche ; un exemplaire à jour de ces textes est tenu à votre disposition sur le lieu de travail : ${ex("bureau RH, bâtiment A, et classeur de chaque site")} ; un exemplaire à jour figure sur l'intranet : ${ex("rubrique RH > textes applicables")}.`),
      par(`Avis affiché le ${ex(plusJours(p, 2))} — ${ex("Camille MARTIN, DRH")}. »`),
      h("Vérifications associées"),
      puce("La convention se détermine par l'activité réelle de l'entreprise — le code APE n'est qu'un indice : confirmez l'identification avant affichage."),
      puce("La convention est mentionnée sur le bulletin de paie : faites vérifier la mention par la paie."),
      puce(`L'information d'embauche (renvoi de R. 2262-1 aux articles R. 1221-34 et R. 1221-35) est intégrée au parcours d'accueil : ${ex("remise contre émargement avec le livret d'accueil")}.`),
      ...aPers(["L'intitulé exact (et l'IDCC) de la convention réellement applicable",
        "La liste de vos accords d'entreprise en vigueur",
        "Les lieux réels de consultation et l'adresse intranet"])],
  }),

  "SOC-AFF-FUMER": p => ({
    titre: "Signalisation complète : interdiction de fumer et de vapoter",
    lignes: [...entete(p, "signalisation dans les locaux (code de la santé publique — hors du champ du relais : à vérifier sur les textes en vigueur)"),
      h("Texte de la signalisation"),
      par(`« Il est interdit de fumer dans les lieux de travail fermés et couverts de ${nomE(p)}. Il est interdit de vapoter dans les locaux recevant des postes de travail, fermés et couverts, à usage collectif. Cette signalisation est apposée en application du code de la santé publique — reportez-vous aux textes en vigueur, non servis par le relais de cette application. »`),
      h("Plan d'implantation (exemple)"),
      puce(`Entrées des bâtiments et halls : ${ex("6 panneaux normalisés")}.`),
      puce(`Salles de réunion, de pause, vestiaires, sanitaires : ${ex("12 panneaux")}.`),
      puce(`Véhicules de service et d'entreprise : ${ex("autocollants sur les 40 véhicules de la flotte")}.`),
      puce(`Emplacement fumeurs extérieur éventuel : ${ex("abri côté parking, à plus de dix mètres des entrées — implantation à valider")}.`),
      h("Mise en œuvre"),
      puce(`Pose datée du ${ex(plusJours(p, 5))} par ${ex("les services généraux")} ; rappel de la règle dans le règlement intérieur et le livret d'accueil.`),
      ...aPers(["Le nombre et l'implantation réels des panneaux",
        "Le sort des véhicules et des locaux particuliers",
        "La vérification des textes du code de la santé publique en vigueur (sanctions comprises)"])],
  }),

  /* ──────────────────────────────────────────────── registres ────────── */

  "SOC-REG-PERSONNEL": p => ({
    titre: "Registre unique du personnel : colonnes exactes et exemple de ligne",
    lignes: [...entete(p, "tenue du registre unique du personnel, par établissement (L. 1221-13, D. 1221-23)"),
      h("1. Les règles de tenue (L. 1221-13)"),
      puce("Un registre par établissement où sont employés des salariés ; les noms et prénoms de tous les salariés, inscrits dans l'ordre des embauches, au moment de l'embauche, de façon indélébile."),
      puce("Les stagiaires et volontaires en service civique figurent, dans leur ordre d'arrivée, dans une partie spécifique."),
      h("2. Les colonnes exactes (D. 1221-23)"),
      puce("Nom et prénoms — puis, pour chaque salarié :"),
      puce("1° nationalité · 2° date de naissance · 3° sexe · 4° emploi · 5° qualification · 6° dates d'entrée et de sortie de l'établissement ;"),
      puce("7° lorsqu'une autorisation d'embauche ou de licenciement est requise : la date de l'autorisation ou de la demande ;"),
      puce("8° pour les travailleurs étrangers assujettis à un titre autorisant l'exercice d'une activité salariée : le type et le numéro d'ordre du titre ;"),
      puce("suite de D. 1221-23 : les mentions propres aux contrats particuliers portées par l'article (contrats à durée déterminée, travail à temps partiel, mise à disposition par un groupement d'employeurs ou une entreprise de travail temporaire…) — reprendre l'énumération de l'article, reproduite dans le dépôt de textes de ce module."),
      h("3. Exemple de ligne (fictif)"),
      par(ex("MARTIN Camille — française — née le 12/03/1991 — F — conductrice routière — coefficient et emploi selon la classification applicable (à compléter selon la convention " + ccn(p) + ") — entrée le " + plusJours(p, -400) + " — CDI")),
      par(ex("OKAFOR Ngozi — nigériane — née le 04/07/1996 — F — préparatrice de commandes — entrée le " + plusJours(p, -60) + " — CDD jusqu'au " + plusJours(p, 120) + " — titre de séjour salarié n° 751234567")),
      h("4. Support et accès"),
      puce(`Support : ${ex("registre numérique tenu sous le SIRH, garanties d'indélébilité et d'horodatage")} — un support numérique suppose l'information préalable des instances : documentez-la.`),
      puce("Tenu à la disposition de l'inspection du travail et des membres du comité ; conservation des mentions à documenter avec votre conseil (durées fixées par des textes non vérifiés ici)."),
      ...aPers(["Le support retenu (papier ou numérique) et la preuve de l'information des instances",
        "Les lignes réelles, par établissement et dans l'ordre des embauches",
        "Les mentions des contrats particuliers, reprises de l'énumération complète de D. 1221-23"])],
  }),

  "SOC-REG-SECURITE": p => ({
    titre: "Registre de sécurité : sommaire complet et exemple tenu",
    lignes: [...entete(p, "conservation des vérifications, contrôles et observations (L. 4711-1, L. 4711-2, L. 4711-5)"),
      h("1. Ce que le registre rassemble"),
      puce("Les attestations, consignes, résultats et rapports des vérifications et contrôles mis à la charge de l'employeur au titre de la santé et de la sécurité (L. 4711-1) ;"),
      puce("les observations et mises en demeure de l'inspection du travail en matière de santé-sécurité, de médecine du travail et de prévention (L. 4711-2) ;"),
      puce("le tout pouvant être réuni en un registre unique dès lors que cela facilite la conservation et la consultation (L. 4711-5)."),
      h("2. Sommaire type, avec exemple d'état"),
      puce(`Installations électriques — vérification annuelle : dernier rapport ${ex("Bureau Contrôle Plus, le " + plusJours(p, -120) + ", trois observations levées le " + plusJours(p, -60))}.`),
      puce(`Moyens d'extinction et alarme incendie : ${ex("vérifiés le " + plusJours(p, -90) + " — conformes")}.`),
      puce(`Équipements de travail et de levage (${ex("ponts, chariots, hayons")}) : vérifications générales périodiques ${ex("semestrielles, dernière le " + plusJours(p, -45))}.`),
      puce(`Aération, assainissement, ambiances : ${ex("contrôle du " + plusJours(p, -200))}.`),
      puce(`Portes et portails automatiques, ascenseurs et monte-charges : ${ex("contrat de maintenance Ascent, visites trimestrielles")}.`),
      puce(`Observations et mises en demeure de l'inspection : ${ex("courrier du " + plusJours(p, -300) + " — plan de mise en conformité soldé")}.`),
      h("3. Tenue"),
      puce(`Responsable du registre : ${ex("Dominique BERNARD, responsable maintenance")} — vérifications manquantes programmées : ${ex("aération bâtiment B, le " + plusJours(p, 30))}.`),
      puce("Consultation : inspection du travail, service de prévention, comité — sur demande."),
      ...aPers(["L'inventaire réel des installations et équipements soumis à vérification",
        "Les organismes, dates et rapports effectifs",
        "Le responsable de la tenue et le calendrier des prochaines échéances"])],
  }),

  "SOC-REG-DGI": p => ({
    titre: "Registre des alertes danger grave et imminent : page de garde et exemple d'avis",
    lignes: [...entete(p, "ouverture du registre spécial des alertes (D. 4132-1)"),
      h("1. Page de garde"),
      par(`« Registre spécial des alertes en cas de danger grave et imminent — ${nomE(p)}. Ouvert le ${ex(plusJours(p, 1))}. Pages numérotées de 1 à ${ex("100")}, authentifiées par le tampon du comité social et économique (D. 4132-1). Tenu à la disposition des représentants du personnel — lieu de consultation : ${ex("secrétariat de direction, bâtiment A")}. »`),
      h("2. Les mentions de chaque avis (D. 4132-1)"),
      puce("L'avis du représentant du personnel est consigné sur le registre, daté et signé ; il indique :"),
      puce("1° les postes de travail concernés par la cause du danger constaté ;"),
      puce("2° la nature et la cause de ce danger ;"),
      puce("3° le nom des travailleurs exposés."),
      h("3. Exemple d'avis consigné (fictif)"),
      par(ex("Avis n° 1 — le " + plusJours(p, 90) + ", 10 h 40 — Sacha LEROY, membre du CSE. Postes concernés : quai de chargement, portique n° 2. Nature et cause du danger : élingue effilochée sur le palonnier, risque de chute de charge. Travailleurs exposés : N. OKAFOR, P. DURAND. Signature.")),
      par(ex("Suites portées en regard : arrêt d'utilisation immédiat, remplacement de l'élingue le jour même, vérification du parc d'accessoires de levage le " + plusJours(p, 97) + " — enquête conjointe employeur/CSE.")),
      h("4. Information des élus"),
      puce(`Communication de l'existence du registre et de son mode d'emploi aux membres du comité : réunion du ${ex(plusJours(p, 15))}, mention au procès-verbal.`),
      ...aPers(["Le nombre de pages et le lieu réel de consultation",
        "Le tampon du comité (authentification des pages)",
        "La procédure interne de suites (qui intervient, qui enquête, qui clôt)"])],
  }),

  /* ────────────────────────────────────────────── négociations ───────── */

  "SOC-NEG-NAO": p => ({
    titre: "Feuille de route complète : remise au calendrier des négociations obligatoires",
    lignes: [...entete(p, "engagement des négociations obligatoires d'entreprise"),
      h("1. État des lieux (exemple)"),
      puce(`Sections syndicales constituées : ${ex("deux organisations représentatives (délégués : A. COSTA, P. DURAND)")}.`),
      puce(`Accord de méthode : ${ex("aucun — le régime supplétif s'applique donc : rémunération et égalité chaque année, gestion des emplois et salariés expérimentés tous les trois ans à partir de trois cents salariés")}.`),
      puce(`Dernières négociations engagées : rémunération ${ex("jamais")} ; égalité ${ex("il y a 26 mois")} — deux retards à traiter en priorité.`),
      h("2. Calendrier de rattrapage (exemple daté)"),
      puce(`Convocation des délégués syndicaux à une première réunion commune : envoyée le ${ex(plusJours(p, 5))} pour le ${ex(plusJours(p, 19))}.`),
      puce(`Première réunion (${ex(plusJours(p, 19))}) : fixer le lieu et le calendrier des réunions, la liste des informations remises aux négociateurs et la date de cette remise — l'exemple retient ${ex("quatre réunions par thème, informations remises dix jours avant chacune, à partir des données de la BDESE")}.`),
      puce(`Négociation rémunération : réunions des ${ex(plusJours(p, 33) + ", " + plusJours(p, 47) + " et " + plusJours(p, 61))} — issue formalisée au plus tard le ${ex(plusJours(p, 75))} : accord déposé, ou procès-verbal de désaccord consignant les dernières propositions des parties et les mesures que l'employeur entend appliquer, déposé.`),
      puce(`Négociation égalité professionnelle et qualité de vie : engagement le ${ex(plusJours(p, 90))}, appuyée sur le diagnostic comparé de la BDESE et l'index publié.`),
      puce(`Envisager un accord de méthode fixant thèmes, périodicités (quatre ans au plus), calendrier, informations et suivi — trame complète dans le générateur de documents (modèle « accord-methode »).`),
      h("3. Conduite loyale (exemple d'engagements internes)"),
      puce(`Réponse motivée à chaque proposition syndicale sous ${ex("quinze jours")} ; aucune décision unilatérale dans les matières en cours de négociation, sauf urgence justifiée et documentée.`),
      puce(`Négociateurs pour la direction : ${ex("Dominique BERNARD (DG), Camille MARTIN (DRH)")} — mandat cadré le ${ex(plusJours(p, 5))}.`),
      ...aPers(["L'état réel de vos sections syndicales et de vos dernières négociations",
        "Le calendrier, le nombre de réunions et les informations réellement remises",
        "Les négociateurs et leur mandat",
        "L'issue de chaque négociation (accord ou procès-verbal de désaccord) et son dépôt"]),
      noteFin("les périodicités exactes qui s'imposent à vous (accord de méthode ou supplétif), les délais de la demande syndicale et l'exposition aux pénalités se calculent dans le module « négociation obligatoire (NAO) » — c'est lui qui fait foi pour les échéances.")],
  }),

  "SOC-NEG-EGALITE": p => ({
    titre: "Plan d'action égalité professionnelle : squelette complet chiffré",
    lignes: [...entete(p, "couverture égalité professionnelle : accord négocié ou, à défaut, plan d'action annuel déposé"),
      h("1. Diagnostic préalable (exemple)"),
      puce(`Situation comparée femmes-hommes établie depuis la BDESE (rubrique égalité professionnelle) le ${ex(plusJours(p, 10))} : ${ex("38 % de femmes dans l'effectif, 21 % dans l'encadrement ; écart de rémunération moyenne de 6,2 % à catégorie équivalente ; index publié : 84/100")}.`),
      h("2. Domaines d'action et objectifs (exemple chiffré — les domaines réglementaires exacts sont à reprendre des textes d'application, non vérifiés ici)"),
      puce(`Embauche : ${ex("porter à 30 % la part de femmes dans les recrutements de conducteurs d'ici deux ans — indicateur : embauches par sexe et par métier")}.`),
      puce(`Promotion et déroulement de carrière : ${ex("revue annuelle des viviers ; 40 % de femmes dans les promotions cadres — indicateur : promotions par sexe")}.`),
      puce(`Rémunération effective : ${ex("enveloppe de rattrapage de 0,2 % de la masse salariale sur trois ans — indicateur : écart résiduel par catégorie")}.`),
      puce(`Articulation vie professionnelle / vie personnelle : ${ex("entretien systématique au retour des congés familiaux ; charte des réunions (9 h 30 - 17 h)")}.`),
      h("3. Coût et suivi"),
      puce(`Coût évalué des actions : ${ex("115 000 € sur l'exercice")} — suivi ${ex("semestriel")} présenté au comité avec les données de la base.`),
      h("4. Adoption et dépôt"),
      puce(`Voie négociée d'abord : proposition d'ouverture aux délégués syndicaux le ${ex(plusJours(p, 15))}. À défaut d'accord à l'issue de la négociation : plan d'action annuel arrêté par l'employeur, après consultation du comité, et déposé auprès de l'autorité administrative le ${ex(plusJours(p, 90))}.`),
      puce("Une période sans accord ni plan déposé est une période d'exposition à la pénalité : ne laissez pas de trou entre deux couvertures."),
      ...aPers(["Le diagnostic réel tiré de votre BDESE et de votre index",
        "Les domaines d'action retenus (leur liste réglementaire exacte est à reprendre des textes d'application) et les objectifs chiffrés",
        "Le coût, le calendrier de suivi et la date de dépôt"]),
      noteFin("la couverture, l'index et l'exposition à la pénalité s'auditent dans le module « négociation obligatoire (NAO) ».")],
  }),

  "SOC-NEG-PSE": p => ({
    titre: "Licenciement économique : check-list complète avant toute notification",
    lignes: [...entete(p, "sécurisation d'un projet de licenciement pour motif économique"),
      h("1. Qualifier le motif — avant tout acte"),
      puce(`Rattacher le projet à l'un des motifs économiques et constituer le dossier de preuve : ${ex("baisse des commandes sur quatre trimestres consécutifs, comptes et carnet de commandes à l'appui")} — la qualification s'éprouve dans le module « licenciement économique », qui confronte le dossier aux textes et à la jurisprudence dépouillée.`),
      h("2. Dimensionner la procédure (exemple)"),
      puce(`Nombre de licenciements envisagés : ${ex("18")} sur ${eff(p)} salariés, sur ${ex("30 jours")} — ce dimensionnement commande la procédure applicable (information-consultation, plan de sauvegarde le cas échéant) : vérifiez les seuils dans le module « plan de sauvegarde ».`),
      puce(`Catégories professionnelles concernées et critères d'ordre : ${ex("grille pondérée — charges de famille, ancienneté, situation sociale, qualités professionnelles — validée avant toute liste nominative")}.`),
      h("3. Dérouler dans l'ordre (exemple de séquence)"),
      puce(`Constitution du dossier économique et du projet : ${ex(plusJours(p, 10))}.`),
      puce(`Information-consultation du comité social et économique : première réunion ${ex(plusJours(p, 24))} — remise du dossier complet avec la convocation.`),
      puce(`Le cas échéant, élaboration du plan de sauvegarde (mesures de reclassement, formation, accompagnement) et échanges avec l'administration : ${ex("à partir du " + plusJours(p, 24))}.`),
      puce(`Recherche individuelle et loyale de reclassement, propositions écrites et précises : ${ex("avant toute notification")}.`),
      puce(`Notifications : seulement une fois la consultation achevée et les délais purgés — dates calculées par les modules dédiés.`),
      h("4. Ce qui fait échouer les procédures (rappel de méthode)"),
      puce("Motif insuffisamment documenté ; consultation escamotée ; critères d'ordre non appliqués ou non documentés ; reclassement de pure forme ; calendrier tenu à rebours. Chaque point se contrôle dans les modules avant d'agir."),
      ...aPers(["Le motif réel et son dossier de preuve",
        "Le nombre de ruptures, la période et les catégories concernées",
        "La grille de critères d'ordre et sa pondération",
        "Le calendrier complet, recalé sur les délais que les modules calculent"]),
      noteFin("les seuils, délais et contrôles complets sont dans les modules « licenciement économique » (audit.html) et « plan de sauvegarde » (audit-pse.html) — ne notifiez rien avant de les avoir passés.")],
  }),

  /* ────────────────────────────────────────────── santé-sécurité ─────── */

  "SOC-SST-SPST": p => ({
    titre: "Courrier complet d'adhésion au service de prévention et de santé au travail",
    lignes: [...entete(p, "adhésion à un service de prévention et de santé au travail (L. 4622-1)"),
      par(`À : ${ex("AST Prévention, service interentreprises — 12 rue des Acacias")}`),
      par("Madame, Monsieur,"),
      par(`En application de l'article L. 4622-1 du code du travail, ${nomE(p)} sollicite son adhésion à votre service. Vous trouverez ci-dessous les éléments d'identification ; nous vous demandons l'ouverture du dossier, la déclaration de nos effectifs et risques, et la programmation des visites en attente.`),
      puce(`Identification : ${nomE(p)} — SIRET ${ex("123 456 789 00012")} — activité : ${secteurProfil(p).nom}${q(p.conventionCollective) ? " — convention : " + q(p.conventionCollective) : ""}.`),
      puce(`Effectif : ${eff(p)} salariés, répartis sur ${ex("trois sites")} — liste nominative et postes en annexe.`),
      puce(`Postes présentant des risques particuliers (suivi renforcé à valider avec votre équipe) : ${ex("conducteurs poids lourds, caristes, techniciens de maintenance habilités électriques")}.`),
      puce(`Visites à programmer en priorité : ${ex("12 embauches des six derniers mois sans visite, et le suivi périodique en retard listé en annexe")}.`),
      puce(`Interlocuteur : ${ex("Camille MARTIN, DRH — 01 23 45 67 88")}.`),
      par(`Nous vous remercions de nous adresser le contrat d'adhésion, le montant de la cotisation et le calendrier proposé. Fait le ${ex(plusJours(p, 2))} — ${ex("Dominique BERNARD, directeur général")}.`),
      ...aPers(["Le service compétent pour votre secteur géographique et professionnel",
        "Le SIRET, les sites et la liste réelle du personnel et des postes",
        "La liste des postes à risques (elle se valide avec le médecin du travail)",
        "Les visites en retard, jointes en annexe"])],
  }),

  "SOC-SST-VIP": p => ({
    titre: "Remise à niveau du suivi médical : courrier et tableau de rattrapage",
    lignes: [...entete(p, "visites d'information et de prévention et suivi de l'état de santé (R. 4624-10)"),
      h("1. Courrier au service de prévention"),
      par(`« Au service ${ex("AST Prévention")} — en application de l'article R. 4624-10 du code du travail (visite d'information et de prévention dans un délai qui n'excède pas trois mois à compter de la prise effective du poste), nous vous demandons l'état complet des visites de nos salariés et la programmation des visites listées ci-dessous. Merci de nous signaler les postes que vous classez en suivi individuel renforcé. »`),
      h("2. Tableau de rattrapage (exemple fictif)"),
      puce(ex("OKAFOR Ngozi — préparatrice de commandes — embauchée le " + plusJours(p, -60) + " — visite due au plus tard le " + plusJours(p, 30) + " — demandée")),
      puce(ex("DURAND Paul — conducteur SPL — embauché le " + plusJours(p, -120) + " — visite dépassée — programmée le " + plusJours(p, 10))),
      puce(ex("COSTA Andrea — technicienne de maintenance — suivi périodique échu depuis le " + plusJours(p, -90) + " — reprogrammé le " + plusJours(p, 21))),
      h("3. Verrouiller le flux pour l'avenir"),
      puce(`Déclenchement automatique de la demande de visite à chaque embauche : ${ex("case bloquante dans le SIRH à la validation du contrat")}.`),
      puce(`Revue trimestrielle du tableau des échéances avec le service : ${ex("chaque premier lundi de trimestre, responsable : Camille MARTIN")}.`),
      puce("Postes à risques : visite avant affectation et périodicité renforcée selon la classification du médecin du travail — faites établir la liste par écrit."),
      ...aPers(["L'état réel des visites, rapproché du registre du personnel",
        "Les noms, postes et dates du tableau de rattrapage",
        "La procédure d'embauche modifiée et son responsable"])],
  }),

  "SOC-SST-POSTES-RISQUES": p => {
    const s = secteurProfil(p);
    const n = effN(p);
    const concernes = n !== null ? Math.max(1, Math.round(n * 0.12)) : 15;
    return {
    titre: "Liste des postes à risques particuliers et suivi individuel renforcé",
    lignes: [...entete(p, "postes à risques particuliers et suivi individuel renforcé (R. 4624-22, R. 4624-23)"),
      h("1. Les catégories légales, lues à la source (R. 4624-23, I)"),
      par("Les postes présentant des risques particuliers mentionnés au premier alinéa de l'article L. 4624-2 sont ceux exposant les travailleurs :"),
      puce("1° à l'amiante ; 2° au plomb ; 3° aux agents cancérogènes, mutagènes ou toxiques pour la reproduction mentionnés à l'article R. 4412-60 ;"),
      puce("4° aux agents biologiques des groupes 3 et 4 mentionnés à l'article R. 4421-3 ; 5° aux rayonnements ionisants ; 6° au risque hyperbare ;"),
      puce("7° au risque de chute de hauteur lors des opérations de montage et de démontage d'échafaudages."),
      puce("Présente également des risques particuliers tout poste dont l'affectation est conditionnée à un examen d'aptitude spécifique prévu par le code du travail (R. 4624-23, II)."),
      puce("Tout travailleur affecté à l'un de ces postes bénéficie d'un suivi individuel renforcé de son état de santé (R. 4624-22)."),
      h("2. Les compléments décidés par l'employeur : un formalisme strict (R. 4624-23, III)"),
      puce("L'employeur peut compléter la liste s'il le juge nécessaire — mais alors : après avis du ou des médecins concernés ET du comité social et économique s'il existe ; en cohérence avec l'évaluation des risques (L. 4121-3) et, le cas échéant, la fiche d'entreprise (R. 4624-46)."),
      puce("La liste est transmise au service de prévention et de santé au travail, tenue à disposition de l'administration du travail et des services de prévention des organismes de sécurité sociale, et MISE À JOUR TOUS LES ANS."),
      puce("L'employeur MOTIVE PAR ÉCRIT l'inscription de tout poste sur cette liste."),
      h("3. Liste des postes de " + nomE(p) + " (exemple pour une activité " + s.nom + ")"),
      puce(`Poste : ${ex(s.unites[1] ? s.unites[1][0] : "Atelier")} — catégorie : ${ex("risque de chute de hauteur lors du montage-démontage d'échafaudages (R. 4624-23, I, 7°)")} — effectif concerné : ${ex("6 salariés")} — motivation : ${ex("interventions programmées sur échafaudages, cotées priorité 1 au document unique")}.`),
      puce(`Poste : ${ex("Atelier peinture / produits")} — catégorie : ${ex("agents CMR de R. 4412-60 (I, 3°)")} — effectif : ${ex("4 salariés")} — motivation : ${ex("fiches de données de sécurité des produits utilisés, mesurages d'exposition du " + plusJours(p, -180))}.`),
      puce(`Poste : ${ex("Maintenance électrique haute tension")} — catégorie : ${ex("poste conditionné à un examen d'aptitude spécifique (II)")} — effectif : ${ex("3 salariés")}.`),
      puce(`Poste complété par l'employeur (III) : ${ex("cariste en zone de coactivité intense")} — motivation écrite : ${ex("densité de circulation et coactivité relevées au document unique ; avis favorable du médecin du travail du " + plusJours(p, -30) + " ; avis du comité recueilli en réunion du " + plusJours(p, -20))}.`),
      puce(`Total exposé dans l'exemple : ${ex(String(concernes) + " salariés sur " + eff(p))}.`),
      h("4. Le suivi renforcé, en pratique (exemple daté)"),
      puce(`Examen médical d'aptitude AVANT affectation pour tout nouveau salarié d'un poste listé : ${ex("blocage de l'affectation dans le SIRH tant que l'avis n'est pas rendu")}.`),
      puce(`Périodicité renforcée fixée par le médecin du travail : ${ex("visite intermédiaire à mi-période, périodicité individualisée notifiée par le service")} — l'exemple retient ${ex("un examen tous les deux ans, visite intermédiaire l'année médiane")}.`),
      puce(`Rattrapage des salariés déjà en poste sans suivi : ${ex("liste de 5 salariés transmise au service le " + plusJours(p, 7) + ", examens programmés avant le " + plusJours(p, 60))}.`),
      h("5. Vie de la liste"),
      puce(`Transmission au service de prévention et de santé au travail : le ${ex(plusJours(p, 10))} — accusé conservé.`),
      puce(`Mise à jour annuelle : portée à l'agenda le ${ex(plusJours(p, 365))} ; révision à chaque création de poste ou changement de procédé.`),
      puce(`Articulation avec le document unique et la fiche d'entreprise : ${ex("les unités de travail cotées priorité 1 sont revues à chaque mise à jour du DUERP")}.`),
      ...aPers(["Les postes réels et les catégories dont ils relèvent — l'évaluation ne se délègue pas à un modèle",
        "La motivation écrite de chaque poste ajouté au titre du III, et les avis recueillis",
        "Les effectifs exposés et l'état réel du suivi médical",
        "La date de transmission au service et l'échéance de mise à jour annuelle"])],
  }; },

  "SOC-SST-FORMATION-SECU": p => {
    const s = secteurProfil(p);
    return {
    titre: "Fiche d'accueil sécurité complète, par poste",
    lignes: [...entete(p, "formation pratique et appropriée à la sécurité (L. 4141-2)"),
      h("1. Qui est formé (L. 4141-2)"),
      puce("Les travailleurs embauchés ; ceux qui changent de poste ou de technique ; les salariés temporaires (hors travaux urgents avec qualification déjà acquise) ; et, à la demande du médecin du travail, ceux qui reprennent après un arrêt — la formation est répétée périodiquement."),
      h("2. Contenu du parcours (exemple pour une activité " + s.nom + ")"),
      puce(`Accueil général : circulation dans l'établissement (${ex("plan remis, zones piétons/engins")}), conduite en cas d'accident ou de sinistre (${ex("consigne incendie, sauveteurs secouristes affichés")}), droit de retrait et registre des alertes.`),
      puce(`Risques du poste et mesures : ${ex(s.unites[0][1] + " — " + s.unites[0][2])}.`),
      puce(`Équipements de protection remis : ${ex("chaussures, gants, gilet — contre émargement")}.`),
      puce(`Démonstration au poste et période d'accompagnement : ${ex("une journée en binôme avec un tuteur désigné")}.`),
      h("3. Fiche à émarger (exemple rempli)"),
      par(ex("Salariée : OKAFOR Ngozi — poste : préparatrice de commandes — date : " + plusJours(p, 1) + " — formateur : Dominique BERNARD — durée : 3 h 30 — supports remis : livret sécurité v4, plan de circulation — émargements : la salariée, le formateur")),
      par(`Renouvellement : ${ex("à chaque changement de poste, et rappel collectif annuel en " + (Number(jour0(p).slice(0, 4)) + 1))} — les fiches sont conservées par ${ex("le service RH")} : une formation non prouvée n'existe pas au contentieux.`),
      ...aPers(["Le contenu par poste réel (l'exemple couvre le premier poste type de votre secteur)",
        "Les tuteurs et formateurs désignés",
        "Le circuit d'archivage des fiches émargées"]),
      noteFin("les obligations de formation renforcée propres à certains métiers (par exemple les personnels roulants) relèvent de textes et de conventions non vérifiés ici — à compléter selon la convention " + ccn(p) + ".")],
  }; },

  /* ─────────────────────────────────────── formation, entretiens ─────── */

  "SOC-FOR-ENTRETIENS": p => ({
    titre: "Entretien de parcours professionnel : trame complète et campagne de rattrapage",
    lignes: [...entete(p, "entretiens de parcours professionnel (L. 6315-1)"),
      h("1. Les échéances (L. 6315-1, rédaction en vigueur)"),
      puce("Un entretien au cours de la première année suivant l'embauche, puis tous les quatre ans (un accord collectif peut fixer une autre périodicité, sans excéder quatre ans)."),
      puce("Proposé systématiquement au retour des absences longues (maternité, adoption, congé parental, proche aidant, sabbatique, mobilité volontaire sécurisée, temps partiel parental, arrêt longue maladie, mandat syndical) si aucun entretien n'a eu lieu dans les douze mois précédant la reprise."),
      puce("Tous les huit ans : état des lieux récapitulatif (le premier possible sept ans après le premier entretien) — document écrit, copie remise ; dans les entreprises d'au moins cinquante salariés, une carence (entretiens non tenus et aucune formation non obligatoire) déclenche l'abondement correctif du compte personnel de formation."),
      puce("Organisé dans les deux mois suivant la visite médicale de mi-carrière ; lors du premier entretien dans les deux ans précédant le soixantième anniversaire : maintien dans l'emploi et aménagements de fin de carrière."),
      h("2. Trame de l'entretien (les cinq points du I)"),
      puce("1° Compétences et qualifications mobilisées, et leur évolution possible au regard des transformations de l'entreprise ;"),
      puce("2° situation et parcours au regard des évolutions des métiers et des perspectives d'emploi ;"),
      puce("3° besoins de formation (activité actuelle, évolution de l'emploi, projet personnel) ;"),
      puce("4° souhaits d'évolution — reconversion interne ou externe, projet de transition, bilan de compétences, validation des acquis ;"),
      puce("5° activation du compte personnel de formation, abondements que l'employeur peut financer, conseil en évolution professionnelle."),
      par("L'entretien ne porte pas sur l'évaluation du travail ; il est conduit par un supérieur hiérarchique ou un représentant de la direction, pendant le temps de travail, et donne lieu à un document écrit dont copie est remise au salarié."),
      h("3. Exemple rempli (fictif)"),
      par(ex("Salarié : DURAND Paul, conducteur SPL, embauché le 15/09/2018 — entretien du " + plusJours(p, 20) + " conduit par Camille MARTIN. Compétences : conduite SPL, ADR ; évolution possible : formateur interne. Souhait : passage à l'exploitation d'ici trois ans. Besoins : formation exploitation transport. CPF : activé, abondement employeur évoqué. Prochain entretien : " + (Number(jour0(p).slice(0, 4)) + 4) + ".")),
      h("4. Campagne de rattrapage (exemple)"),
      puce(`Extraction des dates de dernier entretien pour les ${eff(p)} salariés : le ${ex(plusJours(p, 7))} — salariés hors échéance : ${ex("214")}.`),
      puce(`Vague 1 (retours d'absence et échéances les plus anciennes) : ${ex("du " + plusJours(p, 21) + " au " + plusJours(p, 60))} ; vague 2 : ${ex("le trimestre suivant")}.`),
      puce(`États des lieux de huit ans à établir : ${ex("57")} — provision d'abondement correctif si carence avérée : ${ex("à chiffrer avec l'expert paie")}.`),
      ...aPers(["La périodicité qu'un accord d'entreprise ou de branche a pu fixer (quatre ans au plus)",
        "Les volumes réels de la campagne de rattrapage",
        "Le circuit de remise et d'archivage des documents écrits"])],
  }),

  "SOC-FOR-ADAPTATION": p => {
    const s = secteurProfil(p);
    return {
    titre: "Plan de développement des compétences : squelette complet chiffré",
    lignes: [...entete(p, "adaptation au poste et maintien de la capacité à occuper un emploi (L. 6321-1)"),
      h("1. Le socle légal"),
      par("L'employeur assure l'adaptation des salariés à leur poste de travail et veille au maintien de leur capacité à occuper un emploi, au regard notamment de l'évolution des emplois, des technologies et des organisations (L. 6321-1) — l'obligation pèse sur l'employeur même sans demande des salariés."),
      h("2. Recueil des besoins (exemple)"),
      puce(`Évolutions identifiées pour une activité ${s.nom} : ${ex("numérisation de l'exploitation, nouvelles motorisations, exigences clients qualité")}.`),
      puce(`Besoins remontés des entretiens de parcours professionnel : ${ex("bureautique et outils métier (54 demandes), habilitations à renouveler (23), management de proximité (11)")}.`),
      h("3. Plan (exemple chiffré)"),
      puce(`Adaptation au poste : ${ex("outils d'exploitation — 60 salariés, 1 jour ; habilitations et recyclages — 23 salariés")}.`),
      puce(`Maintien de l'employabilité : ${ex("parcours numérique de base — 40 salariés ; français professionnel — 8 salariés")}.`),
      puce(`Développement : ${ex("management de proximité — 11 salariés ; VAE accompagnées — 4")}.`),
      puce(`Budget : ${ex("310 000 €, dont contributions conventionnelles éventuelles à vérifier auprès de l'opérateur de compétences")} — calendrier : ${ex("plan annuel, revue semestrielle")}.`),
      h("4. Gouvernance"),
      puce(`Consultation du comité social et économique sur le plan : ${ex("avec la consultation politique sociale, réunion du " + plusJours(p, 60))}.`),
      puce(`Traçabilité : ${ex("émargements et attestations archivés au SIRH")} — un salarié jamais formé sur toute une carrière est un risque contentieux avéré.`),
      ...aPers(["Les évolutions réelles de vos métiers et outils",
        "Les actions, effectifs et budget de votre plan",
        "Les obligations de formation propres à votre branche (à compléter selon la convention " + ccn(p) + ")"])],
  }; },

  /* ─────────────────────────────── épargne et protection sociale ─────── */

  "SOC-EPA-PARTICIPATION": p => ({
    titre: "Mise en place de la participation : lettre de cadrage complète",
    lignes: [...entete(p, "participation des salariés aux résultats (L. 3322-2)"),
      h("1. Le cadre"),
      par("Les entreprises employant au moins cinquante salariés garantissent le droit de leurs salariés à participer aux résultats de l'entreprise ; la base, les modalités de calcul, d'affectation et de gestion sont fixées par accord (L. 3322-2). L'échéance exacte de l'obligation dépend de la durée de maintien de l'effectif au-dessus du seuil — faites-la caler par votre expert : la loi aménage un différé, non vérifié ici."),
      h("2. Chiffrage préparatoire (exemple fictif)"),
      puce(`Calcul de la réserve spéciale de participation par l'expert-comptable sur les exercices ${ex(String(Number(jour0(p).slice(0, 4)) - 2) + " et " + String(Number(jour0(p).slice(0, 4)) - 1))} : ${ex("réserve estimée à 1 240 000 € au titre du dernier exercice")}.`),
      puce(`Répartition envisagée : ${ex("50 % uniforme, 50 % proportionnelle au salaire dans la limite des plafonds")} — gestion : ${ex("plan d'épargne d'entreprise, fonds diversifiés")}.`),
      h("3. Calendrier de négociation (exemple)"),
      puce(`Invitation des délégués syndicaux et du comité à négocier l'accord : le ${ex(plusJours(p, 10))} — réunions les ${ex(plusJours(p, 24) + " et " + plusJours(p, 45))}.`),
      puce(`Signature visée : le ${ex(plusJours(p, 60))} — dépôt sur la plateforme des accords collectifs : le ${ex(plusJours(p, 67))} (le dépôt conditionne les exonérations).`),
      puce(`Information des salariés (livret d'épargne salariale, notice) : le ${ex(plusJours(p, 75))}.`),
      h("4. Points de vigilance"),
      puce("À défaut d'accord dans les délais, un régime d'autorité s'applique, moins favorable à l'employeur — l'échéance précise relève de textes non vérifiés ici : faites-la confirmer."),
      puce(`Articulation avec les dispositifs existants (${ex("intéressement en vigueur jusqu'au " + (Number(jour0(p).slice(0, 4)) + 1))}) et avec la convention ${ccn(p)} : à compléter selon la convention.`),
      ...aPers(["Les exercices de référence et la réserve réellement calculée",
        "La formule de répartition et le support de gestion choisis",
        "Les dates de négociation, de signature et de dépôt",
        "L'échéance légale exacte, calée par l'expert"])],
  }),

  "SOC-EPA-LIVRET": p => ({
    titre: "Livret d'épargne salariale : sommaire complet et exemple rempli",
    lignes: [...entete(p, "livret d'épargne salariale remis à la conclusion du contrat de travail (L. 3341-6)"),
      h("1. L'obligation, lue à la source"),
      par("Tout salarié d'une entreprise proposant un dispositif d'intéressement, de participation, un plan d'épargne entreprise, un plan d'épargne interentreprises, un plan d'épargne pour la retraite collectif ou un plan d'épargne retraite d'entreprise collectif reçoit, LORS DE LA CONCLUSION DE SON CONTRAT DE TRAVAIL, un livret d'épargne salariale présentant les dispositifs mis en place au sein de l'entreprise. Le livret est également porté à la connaissance des représentants du personnel, le cas échéant en tant qu'élément de la base de données économiques, sociales et environnementales établie en application de l'article L. 2312-18 (L. 3341-6)."),
      par("Deux points souvent manqués : la remise se fait À LA CONCLUSION DU CONTRAT, pas au premier versement ; et les représentants du personnel en sont destinataires, la BDESE étant le véhicule naturel."),
      h("2. Sommaire du livret de " + nomE(p) + " (structure complète)"),
      puce("Page 1 — Ce qu'est l'épargne salariale : les dispositifs en place dans l'entreprise, en une page, avec la date de leur mise en place et leur échéance."),
      puce(`Fiche A — Intéressement : ${ex("accord du " + plusJours(p, -400) + ", triennal ; formule liée au résultat d'exploitation et à un critère qualité ; prime moyenne versée l'an dernier : 640 €")} ; date de versement, choix perception immédiate / placement, délai de choix.`),
      puce(`Fiche B — Participation : ${ex("accord du " + plusJours(p, -700) + " ; réserve spéciale de participation de 1 240 000 € au titre du dernier exercice ; répartition 50 % uniforme, 50 % proportionnelle au salaire")} ; règles d'indisponibilité et cas de déblocage anticipé.`),
      puce(`Fiche C — Plan d'épargne d'entreprise : ${ex("teneur de compte Épargne Horizon ; abondement employeur de 100 % dans la limite de 800 € par an ; cinq supports de placement, du monétaire à l'actions")} ; frais à la charge de l'entreprise et à la charge du salarié.`),
      puce(`Fiche D — Plan d'épargne retraite d'entreprise collectif : ${ex("mis en place le " + plusJours(p, -300) + " ; abondement 50 % dans la limite de 500 € ; gestion pilotée par horizon de retraite par défaut")} ; modalités de sortie.`),
      puce("Fiche E — Vos choix et vos délais : où et comment exprimer un choix, ce qui se passe à défaut de choix (affectation par défaut), comment modifier une affectation."),
      puce("Fiche F — Déblocages anticipés : la liste des cas applicables à chaque dispositif, et la procédure interne pour les demander."),
      puce("Fiche G — Que devient votre épargne si vous quittez l'entreprise : état récapitulatif remis au départ, frais de tenue de compte après le départ, coordonnées du teneur de compte."),
      puce(`Fiche H — Vos interlocuteurs : ${ex("service paie (poste 4310), teneur de compte Épargne Horizon (0 800 000 000, espace en ligne), et les représentants du personnel")}.`),
      h("3. Circuit de remise (exemple daté)"),
      puce(`Intégration au dossier d'embauche : ${ex("le livret est joint au contrat, remis contre émargement le jour de la signature — case bloquante dans le SIRH")}, à compter du ${ex(plusJours(p, 15))}.`),
      puce(`Salariés déjà présents jamais destinataires : ${ex("campagne de rattrapage, remise avec la paie de " + plusJours(p, 45).slice(0, 7))} — la loi vise la conclusion du contrat, mais un salarié non informé conteste utilement les affectations par défaut.`),
      puce(`Communication aux représentants du personnel : ${ex("versement du livret à la rubrique « rémunération des salariés et dirigeants » de la BDESE le " + plusJours(p, 20) + ", et information en réunion du comité")}.`),
      puce(`Mise à jour : ${ex("à chaque avenant d'accord et au moins une fois par an — version datée en pied de page")}.`),
      h("4. Ce qui ne s'affirme pas ici"),
      par("Les règles de fond de chaque dispositif (plafonds, régime social et fiscal, cas de déblocage, délais de versement) relèvent de textes que le relais de cette application ne sert pas tous : reprenez-les des accords eux-mêmes et des notices du teneur de compte, et faites relire le livret avant diffusion. Seul l'article L. 3341-6, lu à la source, fonde ici l'obligation de remise."),
      ...aPers(["La liste réelle de vos dispositifs et les références de leurs accords",
        "Les chiffres de chaque fiche (formule, abondement, montants versés) — l'exemple est fictif",
        "Le teneur de compte et les interlocuteurs",
        "La date d'entrée en vigueur du circuit de remise et la campagne de rattrapage"])],
  }),

  "SOC-EPA-SANTE": p => ({
    titre: "Complémentaire santé : décision unilatérale complète (trame article par article)",
    lignes: [...entete(p, "mise en place de la couverture santé collective (code de la sécurité sociale — hors du champ du relais : à vérifier)"),
      h("Décision unilatérale de l'employeur — trame"),
      par(`« Article 1 — Objet. La direction de ${nomE(p)} institue un régime collectif et obligatoire de remboursement de frais de santé au profit de l'ensemble du personnel, à effet du ${ex(plusJours(p, 45))}.`),
      par(`Article 2 — Bénéficiaires et dispenses. Sont couverts tous les salariés, sous réserve des cas de dispense d'ordre public et de ceux prévus par le présent acte — ${ex("salariés couverts par ailleurs en tant qu'ayants droit, contrats courts, apprentis")} — chaque dispense étant formalisée par écrit et archivée.`),
      par(`Article 3 — Organisme et garanties. Contrat collectif souscrit auprès de ${ex("Mutuelle Horizon")}, garanties conformes au panier minimal et au cahier des charges des contrats responsables (textes du code de la sécurité sociale, à vérifier), niveau ${ex("base + option famille")}.`),
      par(`Article 4 — Cotisations. Cotisation mensuelle ${ex("de 62 €")}, prise en charge par l'employeur à hauteur de ${ex("50 %")} — la part patronale minimale et son régime social relèvent de textes non vérifiés ici : faites-les confirmer avant signature.`),
      par(`Article 5 — Information. Remise à chaque salarié de la présente décision et de la notice d'information de l'assureur, contre émargement — ${ex("avec la paie du mois prochain")}.`),
      par(`Article 6 — Durée et révision. Durée indéterminée ; révision ou dénonciation selon les règles applicables aux décisions unilatérales, avec information préalable des salariés et du comité. »`),
      h("Vérifications avant signature"),
      puce(`Exigences de la convention ${ccn(p)} (garanties, taux, organisme recommandé éventuel) : à compléter selon la convention.`),
      puce("Consultation du comité social et économique avant mise en place : à documenter."),
      puce(`Rétroactif : vérifier qu'aucune période passée n'est découverte — ${ex("audit paie sur vingt-quatre mois")}.`),
      ...aPers(["L'organisme, les garanties et les cotisations réelles",
        "Les cas de dispense retenus et leur formalisation",
        "Les exigences conventionnelles et le panier minimal en vigueur (textes hors relais, à vérifier)",
        "La date d'effet et la preuve de remise des notices"])],
  }),

  "SOC-EPA-PREVOYANCE-CADRES": p => {
    const n = effN(p);
    const cadres = n !== null ? Math.max(1, Math.round(n * 0.15)) : 18;
    return {
    titre: "Prévoyance des cadres : audit de couverture et courrier complet à l'assureur",
    lignes: [...entete(p, "couverture de prévoyance des cadres — obligation d'origine conventionnelle : à vérifier sur vos textes"),
      h("1. Audit de couverture (exemple chiffré)"),
      puce(`Population cadre et assimilée identifiée : ${ex(String(cadres) + " salariés sur " + eff(p))} — liste extraite de la paie le ${ex(plusJours(p, 5))}.`),
      puce(`Contrat en vigueur : ${ex("aucun contrat décès dédié aux cadres retrouvé — carence présumée depuis le 01/01/" + (Number(jour0(p).slice(0, 4)) - 2))}.`),
      puce(`Ce que prévoient les textes conventionnels (accord national interprofessionnel et convention ${ccn(p)}) — cotisation patronale dédiée sur la tranche A, affectée en priorité au risque décès : à compléter selon la convention, le relais ne servant que le code du travail.`),
      h("2. Courrier à l'assureur (trame complète)"),
      par(`« À ${ex("Prévoyance Mutualiste du Centre")} — Nous souhaitons souscrire sans délai un contrat de prévoyance couvrant notre population cadre (${ex(String(cadres) + " personnes")}, liste jointe) : capital décès, invalidité, incapacité, avec cotisation patronale affectée en priorité au risque décès conformément aux textes conventionnels applicables — que nous vous demandons de viser expressément au contrat. Merci de nous proposer une prise d'effet au ${ex(plusJours(p, 15))} et de nous indiquer si une reprise du passif (décès survenus pendant la période non couverte) est assurable. »`),
      h("3. Pourquoi c'est la première urgence de sa catégorie"),
      par("En cas de décès d'un cadre non couvert, l'employeur s'expose à devoir lui-même le capital aux ayants droit selon les textes conventionnels — un risque à six chiffres qui ne se rattrape pas rétroactivement. Rien n'est affirmé ici sur un texte non lu : faites viser les stipulations exactes (assiette, taux, ordre d'affectation) par votre conseil, textes conventionnels en main."),
      ...aPers(["La liste réelle des cadres et assimilés (les catégories objectives se définissent au regard des textes en vigueur)",
        "Les stipulations exactes de votre convention (assiette, taux, risques) — à compléter selon la convention",
        "La date d'effet et la question du passif",
        "La cohérence avec le régime de prévoyance éventuel des non-cadres"])],
  }; },

  "SOC-CCN-OBLIGATIONS": p => ({
    titre: "Revue de conformité conventionnelle : grille complète avec exemple d'état",
    lignes: [...entete(p, "revue de conformité à la convention collective " + ccn(p)),
      h("1. Se procurer les textes"),
      puce(`Texte consolidé de la convention et de ses avenants (Légifrance, éditions de branche) : version à jour téléchargée le ${ex(plusJours(p, 3))}, référencée ${ex("avec ses avenants salaires les plus récents")}.`),
      par("Rien de précis n'est affirmé ici sur le contenu de la convention : le relais de l'application ne sert que le code du travail — chaque ligne ci-dessous se vérifie SUR le texte conventionnel."),
      h("2. Grille de revue (exemple d'état fictif)"),
      puce(`Classification : chaque salarié rattaché à un emploi et un coefficient de la grille — ${ex("12 salariés sans coefficient au contrat : à régulariser")}.`),
      puce(`Salaires minima : paie confrontée aux minima de branche par coefficient — ${ex("3 écarts détectés sur les embauches récentes, rappels chiffrés à 4 700 €")}.`),
      puce(`Primes et indemnités conventionnelles (ancienneté, vacances, paniers, déplacements…) : ${ex("prime d'ancienneté non versée aux temps partiels — à corriger et rappeler")}.`),
      puce(`Prévoyance et frais de santé de branche : ${ex("taux et garanties du contrat comparés aux minima conventionnels — conforme sous réserve de l'avenant en cours")}.`),
      puce(`Durée du travail et sujétions propres au secteur ${q(p.secteur) || "d'activité"} : ${ex("amplitudes, temps de liaison, indemnisation des découchés — revue avec l'exploitation")}.`),
      puce(`Jours conventionnels (congés supplémentaires, jours fériés garantis, événements familiaux) : ${ex("paramétrage SIRH vérifié")}.`),
      puce(`Maintien de salaire maladie et carences : ${ex("règles de la convention comparées au paramétrage paie")}.`),
      h("3. Suites"),
      puce(`Écarts corrigés et rappels versés : ${ex("paie de " + plusJours(p, 60).slice(0, 7))} — provision : ${ex("18 000 €")}.`),
      puce(`Revue documentée et archivée ; prochaine revue : ${ex("dans douze mois, ou à chaque avenant de branche")} — responsable : ${ex("Camille MARTIN, avec l'expert paie")}.`),
      ...aPers(["L'intitulé exact et la version à jour de votre convention et de ses avenants",
        "Chaque ligne de la grille, vérifiée sur le texte conventionnel — les états ci-dessus sont fictifs",
        "Le chiffrage des rappels et la période de reprise (la prescription se vérifie avec votre conseil)"])],
  }),
};

module.exports = { MODELES };
