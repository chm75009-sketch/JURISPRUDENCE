/* Le contrôle d'un règlement intérieur déjà en vigueur — la branche « oui ».

   L'architecture de l'application tient en une phrase : une question fermée,
   et un « non » qui construit. « Avez-vous un règlement intérieur ? » — non,
   et le parcours le rédige. Oui, et c'est ici : le règlement existant est
   déposé, ses clauses sont confrontées au texte, et une version corrigée en
   sort. C'était le seul volet qui manquait.

   CE QUE CE MODULE NE FAIT PAS, ET QUI EST ÉCRIT PLUTÔT QUE COMBLÉ.

   Il ne lit pas un règlement intérieur : il cherche, dans un texte, les
   marques des matières que la loi impose et de celles qu'elle interdit. Une
   marque trouvée ne prouve pas que la clause est bien rédigée, et le module ne
   le dit jamais. Il n'existe donc ici aucun état « conforme » — la seule
   chose qu'un repérage lexical établisse, c'est qu'un sujet est traité ou
   qu'il ne l'est pas :

     · ABSENT          — aucune marque du sujet dans le document. C'est le seul
                         constat négatif que le repérage autorise, et il suffit :
                         une matière imposée par L. 1321-1 ou L. 1321-2 qui
                         n'apparaît nulle part n'est pas traitée.
     · À VÉRIFIER      — le sujet est traité ; le passage est rendu à l'écran
                         pour être lu. Ce n'est pas un satisfecit.
     · À CONTRÔLER     — une clause de la famille que L. 1321-3 ou L. 1331-2
                         prohibent apparaît. Le passage est rendu avec le
                         critère que le juge applique. Le module ne tranche pas
                         la proportionnalité : il la pose.

   Aucune phrase de droit n'est écrite ici : chaque point cite un article lu à
   la source, et le chargement échoue si l'article manque au dépôt. */
const { ARRETS } = require("./controles-discipline.js");

/* Les textes lus à la source. La forme de l'appel est celle que l'empaqueteur
   sait transformer en module pour le navigateur — voir commun/empaqueter.js. */
const fs = require("fs");
const T = JSON.parse(fs.readFileSync(__dirname + "/textes-discipline.json", "utf8"));

const ABSENT = "absent";
const AVERIFIER = "à vérifier";
const ACONTROLER = "à contrôler";

/* --------------------------------------------------------------------- */
/* Normalisation : minuscules, accents repliés, apostrophes unifiées.
   Le repérage travaille sur cette forme, l'affichage sur l'originale.    */
function replier(s) {
  return String(s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’‘‛]/g, "'").replace(/[“”«»]/g, '"')
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/* Le découpage en phrases. Un règlement intérieur est fait d'articles courts ;
   on coupe sur la ponctuation forte et sur les sauts de ligne, en gardant la
   position d'origine pour pouvoir rendre le passage tel qu'il est écrit. */
function phrases(texte) {
  const P = [];
  const brut = String(texte || "");
  const re = /[^.!?\n]+[.!?]*/g;
  let m;
  while ((m = re.exec(brut)) !== null) {
    const t = m[0].trim();
    if (t.length < 3) continue;
    P.push({ texte: t, debut: m.index, replie: replier(t) });
  }
  return P;
}

/* --------------------------------------------------------------------- */
/* La grille.

   `marqueurs` : les expressions dont la présence signale que le sujet est
   abordé. Elles sont écrites sous forme repliée — sans accent, en minuscules.
   Une entrée exige DEUX marques quand un seul mot serait trop courant : c'est
   `avec`, qui demande qu'une autre expression figure dans la même phrase.   */
const GRILLE = [
  /* ---------------------------- le contenu imposé ---------------------- */
  {
    id: "RI-CTR-01", famille: "contenu obligatoire", fondement: ["L1321-1"],
    objet: "Les mesures d'application de la réglementation en matière de santé et de sécurité",
    exige: "Le règlement intérieur fixe les mesures d'application de la réglementation en matière de santé et de sécurité dans l'entreprise ou l'établissement, notamment les instructions prévues à l'article L. 4122-1 (L. 1321-1, 1°).",
    marqueurs: ["sante et securite", "hygiene et securite", "consignes de securite",
      "equipement de protection", "protection individuelle", "securite au travail",
      "l. 4122-1", "l.4122-1", "accident du travail", "prevention des risques"],
    clause: [
      "SANTÉ ET SÉCURITÉ",
      "Chaque salarié prend soin, en fonction de sa formation et selon ses possibilités, de sa santé et de sa sécurité ainsi que de celles des autres personnes concernées par ses actes ou ses omissions au travail.",
      "Il applique les instructions données par l'employeur en matière de santé et de sécurité, notamment celles qui figurent aux consignes affichées sur les lieux de travail, et utilise les équipements de protection individuelle mis à sa disposition, dans les conditions et pour les usages prévus.",
      "Tout accident, même bénin, et toute situation présentant un danger grave et imminent sont signalés sans délai à l'employeur ou à son représentant.",
    ],
  },
  {
    id: "RI-CTR-02", famille: "contenu obligatoire", fondement: ["L1321-1"],
    objet: "La participation des salariés au rétablissement de conditions de travail protectrices",
    exige: "Le règlement intérieur fixe les conditions dans lesquelles les salariés peuvent être appelés, à la demande de l'employeur, à participer au rétablissement de conditions de travail protectrices de la santé et de la sécurité, dès lors qu'elles apparaîtraient compromises (L. 1321-1, 2°).",
    marqueurs: ["retablissement de conditions de travail", "retablissement des conditions de travail",
      "conditions de travail protectrices", "compromises"],
    clause: [
      "PARTICIPATION AU RÉTABLISSEMENT DE CONDITIONS DE TRAVAIL PROTECTRICES",
      "Lorsque les conditions de travail protectrices de la santé et de la sécurité des salariés apparaissent compromises, les salariés peuvent être appelés, à la demande de l'employeur, à participer à leur rétablissement.",
      "Cette participation s'exerce dans la limite des compétences de chacun et de la formation reçue ; elle ne peut exposer le salarié à un danger grave et imminent, ni faire obstacle à l'exercice du droit de retrait.",
    ],
  },
  {
    id: "RI-CTR-03", famille: "contenu obligatoire", fondement: ["L1321-1", "L1331-1"],
    objet: "La nature et l'échelle des sanctions",
    exige: "Le règlement intérieur fixe les règles générales et permanentes relatives à la discipline, notamment la nature et l'échelle des sanctions que peut prendre l'employeur (L. 1321-1, 3°).",
    jurisprudence: [ARRETS.sanctionPrevueRI, ARRETS.sanctionPrevueRI2],
    marqueurs: ["echelle des sanctions", "avertissement", "blame", "mise a pied",
      "retrogradation", "mutation disciplinaire", "sanction disciplinaire"],
    clause: [
      "NATURE ET ÉCHELLE DES SANCTIONS",
      "Constitue une sanction toute mesure, autre que les observations verbales, prise par l'employeur à la suite d'un agissement du salarié considéré par lui comme fautif, que cette mesure soit de nature à affecter immédiatement ou non la présence du salarié dans l'entreprise, sa fonction, sa carrière ou sa rémunération.",
      "Selon la gravité des faits reprochés, l'employeur peut prononcer l'une des sanctions suivantes, sans que cet ordre lui impose de les épuiser successivement :",
      "1° l'avertissement ;",
      "2° le blâme ;",
      "3° la mise à pied disciplinaire, sans rémunération, d'une durée maximale de [nombre] jours ouvrés ;",
      "4° la mutation disciplinaire ;",
      "5° la rétrogradation ;",
      "6° le licenciement pour cause réelle et sérieuse ou pour faute grave ou lourde.",
      "La mutation et la rétrogradation emportent modification du contrat de travail : elles ne peuvent être imposées au salarié, qui peut les refuser sans que ce refus constitue par lui-même une faute.",
    ],
  },
  {
    id: "RI-CTR-04", famille: "contenu obligatoire", fondement: ["L1321-1"],
    objet: "La durée maximale de la mise à pied disciplinaire",
    exige: "Une mise à pied disciplinaire prévue par le règlement intérieur n'est licite que si ce règlement précise sa durée maximale.",
    jurisprudence: [ARRETS.sanctionPrevueRI],
    /* Le sujet n'existe que si la mise à pied est prévue : la question posée
       est celle de la DURÉE, et elle se cherche dans la phrase qui la porte. */
    depend: "mise a pied",
    marqueurs: ["duree maximale", "au maximum", "ne peut exceder", "ne pourra exceder", "jours ouvres", "jours ouvrables"],
    clause: [
      "DURÉE MAXIMALE DE LA MISE À PIED DISCIPLINAIRE",
      "La mise à pied disciplinaire ne peut excéder [nombre] jours ouvrés.",
    ],
  },
  {
    id: "RI-CTR-05", famille: "contenu obligatoire", fondement: ["L1321-2", "L1332-1", "L1332-2", "L1332-3"],
    objet: "Le rappel des droits de la défense",
    exige: "Le règlement intérieur rappelle les dispositions relatives aux droits de la défense des salariés définis aux articles L. 1332-1 à L. 1332-3 ou par la convention collective applicable (L. 1321-2, 1°).",
    marqueurs: ["droits de la defense", "entretien prealable", "se faire assister",
      "convocation ecrite", "l. 1332-1", "l. 1332-2", "l.1332-2"],
    clause: [
      "DROITS DE LA DÉFENSE",
      "Aucune sanction ne peut être prise sans que le salarié soit informé, dans le même temps et par écrit, des griefs retenus contre lui.",
      "Lorsque l'employeur envisage une sanction, il convoque le salarié en lui précisant l'objet de la convocation, sauf si la sanction envisagée est un avertissement ou une sanction de même nature n'ayant pas d'incidence, immédiate ou non, sur la présence dans l'entreprise, la fonction, la carrière ou la rémunération.",
      "Lors de son audition, le salarié peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise. Au cours de l'entretien, l'employeur indique le motif de la sanction envisagée et recueille les explications du salarié.",
      "La sanction ne peut intervenir moins de deux jours ouvrables ni plus d'un mois après le jour fixé pour l'entretien ; elle est motivée et notifiée à l'intéressé.",
      "Aucun fait fautif ne peut donner lieu à lui seul à l'engagement de poursuites disciplinaires au-delà d'un délai de deux mois à compter du jour où l'employeur en a eu connaissance, à moins que ce fait ait donné lieu dans le même délai à l'exercice de poursuites pénales.",
      "Les stipulations plus favorables de la convention collective applicable s'appliquent, notamment lorsqu'elles instituent une procédure disciplinaire particulière.",
    ],
  },
  {
    id: "RI-CTR-06", famille: "contenu obligatoire", fondement: ["L1321-2"],
    objet: "Le rappel des dispositions sur les harcèlements et les agissements sexistes",
    exige: "Le règlement intérieur rappelle les dispositions relatives aux harcèlements moral et sexuel et aux agissements sexistes prévues par le code du travail (L. 1321-2, 2°).",
    marqueurs: ["harcelement moral", "harcelement sexuel", "agissement sexiste", "agissements sexistes"],
    clause: [
      "HARCÈLEMENTS ET AGISSEMENTS SEXISTES",
      "Aucun salarié ne doit subir les agissements répétés de harcèlement moral qui ont pour objet ou pour effet une dégradation de ses conditions de travail susceptible de porter atteinte à ses droits et à sa dignité, d'altérer sa santé physique ou mentale ou de compromettre son avenir professionnel.",
      "Aucun salarié ne doit subir des faits de harcèlement sexuel, constitué par des propos ou comportements à connotation sexuelle ou sexiste répétés qui portent atteinte à sa dignité en raison de leur caractère dégradant ou humiliant, ou créent à son encontre une situation intimidante, hostile ou offensante, ni aucune forme de pression grave dans le but réel ou apparent d'obtenir un acte de nature sexuelle.",
      "Nul ne doit subir d'agissement sexiste, défini comme tout agissement lié au sexe d'une personne, ayant pour objet ou pour effet de porter atteinte à sa dignité ou de créer un environnement intimidant, hostile, dégradant, humiliant ou offensant.",
      "Aucun salarié, aucune personne en formation ou en stage ne peut être sanctionné, licencié ou faire l'objet d'une mesure discriminatoire pour avoir subi, refusé de subir, témoigné de tels faits ou les avoir relatés.",
      "Ces agissements exposent leur auteur à une sanction disciplinaire.",
    ],
  },
  {
    id: "RI-CTR-07", famille: "contenu obligatoire", fondement: ["L1321-2"],
    objet: "Le rappel du dispositif de protection des lanceurs d'alerte",
    exige: "Le règlement intérieur rappelle l'existence du dispositif de protection des lanceurs d'alerte prévu au chapitre II de la loi n° 2016-1691 du 9 décembre 2016 (L. 1321-2, 3°). Ce rappel a été ajouté à L. 1321-2 : un règlement antérieur ne le porte pas.",
    marqueurs: ["lanceur d'alerte", "lanceurs d'alerte", "loi n° 2016-1691", "loi 2016-1691"],
    clause: [
      "PROTECTION DES LANCEURS D'ALERTE",
      "Il existe un dispositif de protection des lanceurs d'alerte, prévu au chapitre II de la loi n° 2016-1691 du 9 décembre 2016 relative à la transparence, à la lutte contre la corruption et à la modernisation de la vie économique.",
      "Le salarié qui signale ou divulgue, dans les conditions prévues par ce dispositif, des informations portant sur un crime, un délit, une menace ou un préjudice pour l'intérêt général, une violation ou une tentative de dissimulation d'une violation du droit, ne peut être sanctionné, licencié ni faire l'objet d'une mesure discriminatoire à ce titre.",
      "La procédure de recueil et de traitement des signalements applicable dans l'entreprise est portée à la connaissance des salariés par [préciser le moyen].",
    ],
  },
  {
    id: "RI-CTR-08", famille: "contenu obligatoire", fondement: ["L1321-4", "R1321-3"],
    objet: "La date d'entrée en vigueur",
    exige: "Le règlement intérieur indique la date de son entrée en vigueur. Cette date doit être postérieure d'un mois à l'accomplissement des formalités de publicité ; le délai court à compter de la dernière en date des formalités de publicité et de dépôt (L. 1321-4, R. 1321-3).",
    marqueurs: ["entree en vigueur", "entrera en vigueur", "prend effet le", "applicable a compter du"],
    clause: [
      "ENTRÉE EN VIGUEUR",
      "Le présent règlement intérieur entre en vigueur le [date], soit un mois après la dernière en date des formalités de dépôt au greffe du conseil de prud'hommes et de publicité.",
    ],
  },
  /* ------------------------------ les formalités ----------------------- */
  {
    id: "RI-CTR-09", famille: "formalités", fondement: ["L1321-4"],
    objet: "La mention de l'avis du comité social et économique",
    exige: "Le règlement intérieur ne peut être introduit qu'après avoir été soumis à l'avis du comité social et économique (L. 1321-4). La mention de cet avis dans le document n'est pas exigée par le texte, mais son absence prive le règlement de la trace de la formalité.",
    marqueurs: ["comite social et economique", "avis du comite", "cse"],
    clause: [
      "AVIS DU COMITÉ SOCIAL ET ÉCONOMIQUE",
      "Le présent règlement intérieur a été soumis à l'avis du comité social et économique lors de sa réunion du [date].",
    ],
  },
  {
    id: "RI-CTR-10", famille: "formalités", fondement: ["R1321-1", "R1321-2", "R1321-4"],
    objet: "La mention du dépôt au greffe, de la communication à l'inspection du travail et de la publicité",
    exige: "Le règlement intérieur est déposé au greffe du conseil de prud'hommes du ressort (R. 1321-2), transmis à l'inspecteur du travail en deux exemplaires (R. 1321-4) et porté par tout moyen à la connaissance des personnes ayant accès aux lieux de travail ou aux locaux où se fait l'embauche (R. 1321-1).",
    marqueurs: ["conseil de prud'hommes", "greffe", "inspecteur du travail", "inspection du travail", "affichage"],
    clause: [
      "DÉPÔT, COMMUNICATION ET PUBLICITÉ",
      "Le présent règlement a été déposé au greffe du conseil de prud'hommes de [ville] le [date], transmis en deux exemplaires à l'inspecteur du travail le [date], et affiché le [date] sur les lieux de travail ainsi que dans les locaux où se fait l'embauche.",
    ],
  },
  /* --------------------------- le contenu prohibé ---------------------- */
  {
    id: "RI-CTR-11", famille: "contenu prohibé", fondement: ["L1331-2"],
    objet: "Les amendes et autres sanctions pécuniaires",
    exige: "Les amendes ou autres sanctions pécuniaires sont interdites. Toute disposition ou stipulation contraire est réputée non écrite (L. 1331-2).",
    prohibe: true,
    marqueurs: ["amende", "sanction pecuniaire", "sanctions pecuniaires", "penalite",
      "retenue sur salaire", "retenue de salaire", "prelevement sur la remuneration"],
    critere: "Une retenue sur salaire n'est licite que si elle correspond à une absence de travail effectif ou à une créance de l'employeur régulièrement établie. Toute somme prélevée à raison d'un comportement fautif est une sanction pécuniaire, quelle que soit la formule employée.",
    remplacement: "Supprimer la clause. Le comportement visé peut être sanctionné par une sanction de l'échelle (avertissement, blâme, mise à pied), jamais par une somme d'argent.",
  },
  {
    id: "RI-CTR-12", famille: "contenu prohibé", fondement: ["L1321-3", "L1321-2-1"],
    objet: "Les restrictions aux droits des personnes et aux libertés",
    exige: "Le règlement intérieur ne peut contenir de dispositions apportant aux droits des personnes et aux libertés individuelles et collectives des restrictions qui ne seraient pas justifiées par la nature de la tâche à accomplir ni proportionnées au but recherché (L. 1321-3, 2°). Le principe de neutralité et la restriction de la manifestation des convictions ne sont admis que s'ils sont justifiés par l'exercice d'autres libertés et droits fondamentaux ou par les nécessités du bon fonctionnement de l'entreprise, et proportionnés au but recherché (L. 1321-2-1).",
    prohibe: true,
    marqueurs: ["fouille", "controle des sacs", "vestiaire", "ethylotest", "alcootest",
      "test salivaire", "depistage", "videosurveillance", "geolocalisation",
      "telephone portable", "reseaux sociaux", "messagerie", "signe religieux",
      "neutralite", "tenue vestimentaire", "port de la barbe", "voile"],
    critere: "Deux conditions cumulatives, que le juge vérifie l'une après l'autre : la restriction est-elle justifiée par la nature de la tâche à accomplir, et est-elle proportionnée au but recherché ? Une interdiction générale et absolue ne franchit ni l'une ni l'autre. Le règlement doit énoncer les postes et les circonstances visés, les modalités du contrôle et les garanties du salarié.",
    remplacement: "Réécrire la clause en désignant les postes concernés, la circonstance qui la justifie et les garanties offertes — présence d'un tiers, possibilité de s'y opposer, contre-expertise, information préalable.",
  },
  {
    id: "RI-CTR-13", famille: "contenu prohibé", fondement: ["L1321-3"],
    objet: "Les dispositions discriminatoires",
    exige: "Le règlement intérieur ne peut contenir de dispositions discriminant les salariés dans leur emploi ou leur travail, à capacité professionnelle égale, en raison notamment de leur origine, de leur sexe, de leurs mœurs, de leur orientation sexuelle ou identité de genre, de leur âge, de leur situation de famille ou de leur grossesse, de leur appartenance vraie ou supposée à une ethnie, une nation ou une race, de leurs opinions politiques, de leurs activités syndicales ou mutualistes, de leurs convictions religieuses, de leur apparence physique, de leur nom de famille ou de leur état de santé ou handicap (L. 1321-3, 3°).",
    prohibe: true,
    marqueurs: ["grossesse", "maternite", "nationalite", "origine", "religion",
      "appartenance syndicale", "activite syndicale", "etat de sante", "handicap",
      "apparence physique", "orientation sexuelle"],
    critere: "La clause distingue-t-elle entre les salariés à capacité professionnelle égale, sur l'un des motifs énumérés ? Une clause qui mentionne l'un de ces motifs pour l'interdire comme motif de distinction est licite ; celle qui en tire une conséquence sur l'emploi ou le travail ne l'est pas.",
    remplacement: "Supprimer la distinction. Si le motif est mentionné pour rappeler l'interdiction de discriminer, laisser la clause telle quelle.",
  },
  {
    id: "RI-CTR-14", famille: "contenu prohibé", fondement: ["L1321-3"],
    objet: "Les dispositions contraires aux lois, règlements et conventions collectives",
    exige: "Le règlement intérieur ne peut contenir de dispositions contraires aux lois et règlements ainsi qu'aux stipulations des conventions et accords collectifs de travail applicables (L. 1321-3, 1°).",
    prohibe: true,
    marqueurs: ["demission d'office", "considere comme demissionnaire", "rupture automatique",
      "rupture de plein droit", "abandon de poste vaut", "renonce a", "renonciation",
      "interdiction de se syndiquer", "droit de greve", "aucun recours"],
    critere: "Une clause qui fait produire à un comportement du salarié un effet que la loi ne lui donne pas — une démission, une rupture de plein droit, une renonciation à un droit — est contraire à la loi. L'inspecteur du travail peut à tout moment en exiger le retrait ou la modification (L. 1322-1).",
    remplacement: "Supprimer la clause. Le comportement visé relève de la procédure disciplinaire, avec ses garanties, ou du licenciement, avec les siennes.",
  },
  {
    id: "RI-CTR-15", famille: "contenu prohibé", fondement: ["L1321-1"],
    objet: "Les matières étrangères au règlement intérieur",
    exige: "Le règlement intérieur fixe EXCLUSIVEMENT les trois matières de l'article L. 1321-1 : santé et sécurité, participation au rétablissement de conditions protectrices, règles générales et permanentes de discipline. Ce qui n'y entre pas n'a pas sa place dans le règlement, et n'y produit pas d'effet obligatoire.",
    prohibe: true,
    marqueurs: ["clause de non-concurrence", "clause de mobilite", "periode d'essai",
      "remuneration variable", "prime d'anciennete", "conges payes", "duree du travail",
      "forfait jours", "preavis de demission", "frais professionnels"],
    critere: "La disposition entre-t-elle dans l'une des trois matières de L. 1321-1 ? Sinon, elle relève du contrat de travail, d'un accord collectif ou d'une note d'information — et non du règlement intérieur, qui ne peut la rendre obligatoire.",
    remplacement: "Sortir la clause du règlement et la porter dans l'instrument qui lui convient : le contrat de travail, l'accord collectif, ou une note d'information sans portée disciplinaire.",
  },
];

/* Le chargement échoue si un article cité manque au dépôt : la grille ne doit
   jamais renvoyer à un texte qui n'a pas été lu à la source. */
for (const g of GRILLE)
  for (const a of g.fondement)
    if (!T[a]) throw new Error(`controle-ri : l'article ${a} cité par ${g.id} n'est pas au dépôt des textes lus à la source.`);

/* --------------------------------------------------------------------- */
/* Le repérage.

   Une marque cherchée en sous-chaîne se trompe : « amende » se lit dans
   « amendement », « cse » dans un mot qui le contient. La recherche est donc
   bornée aux limites de mot — le caractère qui précède et celui qui suit ne
   doivent pas être alphanumériques. C'est la seule protection que le procédé
   admette, et elle ne le rend pas exact pour autant : voir l'en-tête. */
function estLettre(c) { return c >= "a" && c <= "z" || c >= "0" && c <= "9"; }

function contient(replie, marqueur) {
  let i = replie.indexOf(marqueur);
  while (i !== -1) {
    const avant = i === 0 ? "" : replie[i - 1];
    const apres = replie[i + marqueur.length] || "";
    if (!estLettre(avant) && !estLettre(apres)) return true;
    i = replie.indexOf(marqueur, i + 1);
  }
  return false;
}

/* Rendre les phrases où une marque apparaît, jamais le document entier : ce
   qui est montré doit pouvoir être lu.                                     */
function reperer(P, marqueurs) {
  const trouves = [];
  for (const p of P) {
    const vus = marqueurs.filter(m => contient(p.replie, m));
    if (vus.length) trouves.push({ texte: p.texte, debut: p.debut, marques: vus });
  }
  return trouves;
}

function analyser(texte) {
  const brut = String(texte || "");
  const P = phrases(brut);
  const points = [];

  for (const g of GRILLE) {
    /* Un point conditionnel — la durée maximale de la mise à pied — ne se pose
       que si la sanction dont il fixe la borne est prévue. */
    if (g.depend) {
      const porteuses = P.filter(p => contient(p.replie, g.depend));
      if (!porteuses.length) {
        points.push({ ...vue(g), etat: ABSENT, passages: [],
          motif: "La mise à pied disciplinaire n'apparaît pas dans le document : la durée maximale n'a pas d'objet tant qu'elle n'est pas prévue. Si vous l'ajoutez à l'échelle des sanctions, sa durée maximale devient obligatoire.",
          sansObjet: true });
        continue;
      }
      const avec = porteuses.filter(p => g.marqueurs.some(m => contient(p.replie, m)));
      points.push({ ...vue(g),
        etat: avec.length ? AVERIFIER : ABSENT,
        passages: (avec.length ? avec : porteuses).map(p => ({ texte: p.texte, debut: p.debut })),
        motif: avec.length
          ? "La phrase qui prévoit la mise à pied porte une durée : lisez-la, et vérifiez qu'elle borne bien la sanction et non l'une de ses modalités."
          : "La mise à pied disciplinaire est prévue, sans qu'une durée maximale apparaisse dans la phrase qui la prévoit. Une mise à pied disciplinaire prévue par le règlement intérieur n'est licite que si ce règlement précise sa durée maximale.",
      });
      continue;
    }

    const trouves = reperer(P, g.marqueurs);

    if (g.prohibe) {
      points.push({ ...vue(g),
        etat: trouves.length ? ACONTROLER : ABSENT,
        passages: trouves.map(p => ({ texte: p.texte, debut: p.debut, marques: p.marques })),
        motif: trouves.length
          ? `${trouves.length} passage${trouves.length > 1 ? "s font" : " fait"} apparaître une clause de cette famille. Le module ne conclut pas à son illicéité : il rend le passage et le critère que le juge applique.`
          : "Aucun passage de cette famille n'a été repéré. Cela ne vaut pas quitus : une clause peut être rédigée en termes que ce repérage ne connaît pas.",
      });
      continue;
    }

    points.push({ ...vue(g),
      etat: trouves.length ? AVERIFIER : ABSENT,
      passages: trouves.map(p => ({ texte: p.texte, debut: p.debut, marques: p.marques })),
      motif: trouves.length
        ? "Le sujet est traité dans le document. Lisez le passage : le repérage établit qu'il en est question, jamais que la clause est complète ni bien rédigée."
        : "Aucune trace de cette matière dans le document. Le règlement ne la traite pas.",
    });
  }

  const compte = e => points.filter(p => p.etat === e && !p.sansObjet).length;
  return {
    texte: brut,
    caracteres: brut.length,
    phrases: P.length,
    points,
    compteurs: {
      absents: points.filter(p => p.etat === ABSENT && !p.prohibe && !p.sansObjet).length,
      aVerifier: compte(AVERIFIER),
      aControler: compte(ACONTROLER),
      sansObjet: points.filter(p => p.sansObjet).length,
    },
  };
}

function vue(g) {
  return {
    id: g.id, famille: g.famille, objet: g.objet, fondement: g.fondement,
    exige: g.exige, prohibe: !!g.prohibe,
    clause: g.clause || null, critere: g.critere || null,
    remplacement: g.remplacement || null,
    jurisprudence: g.jurisprudence || [],
  };
}

/* --------------------------------------------------------------------- */
/* La version corrigée.

   Elle ne réécrit pas le document à la place de son auteur : elle l'assemble.
   Le texte d'origine est conservé mot pour mot ; chaque passage à contrôler y
   est signalé à sa place, en clair, avec le critère ; et les clauses des
   matières absentes sont ajoutées à la suite, prêtes à être déplacées à leur
   rang. `choix` porte ce que l'utilisateur a retenu : les identifiants des
   clauses à insérer et ceux des passages à signaler.                       */
function corriger(analyse, choix) {
  const c = choix || {};
  const inserer = c.inserer || analyse.points.filter(p => p.etat === ABSENT && p.clause && !p.sansObjet).map(p => p.id);
  const signaler = c.signaler || analyse.points.filter(p => p.etat === ACONTROLER).map(p => p.id);

  /* Les marques, posées de la fin vers le début pour ne pas décaler les
     positions restantes. */
  const marques = [];
  for (const p of analyse.points) {
    if (!p.prohibe || signaler.indexOf(p.id) === -1) continue;
    for (const q of p.passages) marques.push({ debut: q.debut, fin: q.debut + q.texte.length, id: p.id, objet: p.objet });
  }
  marques.sort((a, b) => b.debut - a.debut);

  let corps = analyse.texte;
  for (const m of marques) {
    corps = corps.slice(0, m.fin) +
      `  [À CONTRÔLER — ${m.id} : ${m.objet}]` +
      corps.slice(m.fin);
  }

  const ajouts = [];
  for (const p of analyse.points) {
    if (inserer.indexOf(p.id) === -1 || !p.clause) continue;
    ajouts.push({ id: p.id, objet: p.objet, fondement: p.fondement, lignes: p.clause });
  }

  const notes = [];
  for (const p of analyse.points) {
    if (!p.prohibe || signaler.indexOf(p.id) === -1) continue;
    notes.push({ id: p.id, objet: p.objet, fondement: p.fondement, critere: p.critere,
      remplacement: p.remplacement, passages: p.passages.map(q => q.texte) });
  }

  return { corps, ajouts, notes,
    resume: `${ajouts.length} clause${ajouts.length > 1 ? "s ajoutées" : " ajoutée"}, ${notes.length} famille${notes.length > 1 ? "s signalées" : " signalée"} à contrôler.` };
}

/* Le texte plat de la version corrigée — celui que la page propose au
   téléchargement lorsque l'utilisateur ne veut pas le composer lui-même. */
function texteCorrige(analyse, choix) {
  const r = corriger(analyse, choix);
  const L = [r.corps.trim(), ""];
  if (r.ajouts.length) {
    L.push("", "— — —", "CLAUSES AJOUTÉES AU TITRE DU CONTRÔLE", "");
    for (const a of r.ajouts) {
      L.push(`[${a.id} — ${a.fondement.map(article).join(", ")}]`);
      for (const l of a.lignes) L.push(l);
      L.push("");
    }
  }
  if (r.notes.length) {
    L.push("", "— — —", "PASSAGES À CONTRÔLER AVANT DIFFUSION", "");
    for (const n of r.notes) {
      L.push(`[${n.id} — ${n.objet} — ${n.fondement.map(article).join(", ")}]`);
      L.push("Critère : " + n.critere);
      L.push("Ce qu'il faut faire : " + n.remplacement);
      for (const p of n.passages) L.push("  « " + p + " »");
      L.push("");
    }
  }
  return L.join("\n");
}

/* « L1321-1 » s'écrit « L. 1321-1 » dans un document. */
function article(a) {
  const m = /^([LRD])(.+)$/.exec(a);
  return m ? `${m[1]}. ${m[2]}` : a;
}

module.exports = { analyser, corriger, texteCorrige, GRILLE, phrases, replier, contient,
                   ETATS: { ABSENT, AVERIFIER, ACONTROLER }, article };
