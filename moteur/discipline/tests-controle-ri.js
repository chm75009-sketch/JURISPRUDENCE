/* Les cas contradictoires du contrôle de règlement intérieur.

   Un repérage lexical se trompe de deux manières : il voit ce qui n'est pas
   là, et il ne voit pas ce qui y est. Les cas ci-dessous sont construits pour
   provoquer les deux, et pour vérifier la règle qui tient le module : il ne
   conclut jamais à la conformité.

   Usage : node tests-controle-ri.js      */
const CR = require("./controle-ri.js");
const { ABSENT, AVERIFIER, ACONTROLER } = CR.ETATS;

let echecs = 0, verifications = 0;
function verifie(quoi, condition, detail) {
  verifications++;
  if (!condition) { echecs++; console.error(`ÉCHEC — ${quoi}${detail ? " : " + detail : ""}`); }
}
const point = (a, id) => a.points.find(p => p.id === id);

/* ------------------------------------------------------------------ 1 */
/* Le document vide. Rien ne doit être tenu pour traité, et rien ne doit
   être tenu pour prohibé : l'absence ne prouve dans aucun sens. */
{
  const a = CR.analyser("");
  verifie("document vide — aucun sujet traité",
    a.points.every(p => p.etat === ABSENT), "un point n'est pas « absent »");
  verifie("document vide — aucune clause prohibée signalée",
    a.points.filter(p => p.prohibe).every(p => p.passages.length === 0));
  verifie("document vide — la mise à pied est sans objet",
    point(a, "RI-CTR-04").sansObjet === true);
  verifie("document vide — le compteur des absents ne compte pas les familles prohibées",
    a.compteurs.absents === a.points.filter(p => !p.prohibe && !p.sansObjet).length,
    `${a.compteurs.absents}`);
}

/* ------------------------------------------------------------------ 2 */
/* Un règlement qui traite les huit matières imposées. Le module doit les
   voir — et ne jamais écrire « conforme ». */
{
  const texte = [
    "RÈGLEMENT INTÉRIEUR",
    "Article 1 — Santé et sécurité. Chaque salarié applique les consignes de sécurité affichées et utilise les équipements de protection individuelle mis à sa disposition.",
    "Article 2 — Lorsque les conditions de travail protectrices de la santé et de la sécurité apparaissent compromises, les salariés peuvent être appelés à participer à leur rétablissement.",
    "Article 3 — Échelle des sanctions : avertissement, blâme, mise à pied disciplinaire d'une durée maximale de cinq jours ouvrés, mutation disciplinaire, rétrogradation, licenciement.",
    "Article 4 — Droits de la défense. Le salarié convoqué à un entretien préalable peut se faire assister par une personne de son choix appartenant au personnel de l'entreprise.",
    "Article 5 — Aucun salarié ne doit subir de harcèlement moral, de harcèlement sexuel ni d'agissement sexiste.",
    "Article 6 — Il existe un dispositif de protection des lanceurs d'alerte prévu par la loi n° 2016-1691 du 9 décembre 2016.",
    "Article 7 — Le présent règlement a été soumis à l'avis du comité social et économique le 3 mars 2026.",
    "Article 8 — Il a été déposé au greffe du conseil de prud'hommes et transmis à l'inspecteur du travail. Affichage le 10 mars 2026.",
    "Article 9 — Entrée en vigueur le 15 avril 2026.",
  ].join("\n");
  const a = CR.analyser(texte);

  for (const id of ["RI-CTR-01", "RI-CTR-02", "RI-CTR-03", "RI-CTR-04", "RI-CTR-05",
                    "RI-CTR-06", "RI-CTR-07", "RI-CTR-08", "RI-CTR-09", "RI-CTR-10"])
    verifie(`règlement complet — ${id} repéré`, point(a, id).etat === AVERIFIER,
      `${id} rendu « ${point(a, id).etat} »`);

  verifie("règlement complet — aucun état « conforme » nulle part",
    !JSON.stringify(a).match(/"conforme"/));
  verifie("règlement complet — le passage est rendu pour être lu",
    point(a, "RI-CTR-06").passages.length > 0 &&
    /harcèlement moral/.test(point(a, "RI-CTR-06").passages[0].texte));
  verifie("règlement complet — la durée de la mise à pied est vue dans la phrase qui la prévoit",
    point(a, "RI-CTR-04").etat === AVERIFIER);
}

/* ------------------------------------------------------------------ 3 */
/* La mise à pied prévue SANS durée maximale : le défaut que la Cour de
   cassation sanctionne, et que le repérage doit isoler. */
{
  const a = CR.analyser("Article 3 — Les sanctions applicables sont l'avertissement, le blâme et la mise à pied disciplinaire. Le licenciement demeure réservé aux fautes les plus graves.");
  const p = point(a, "RI-CTR-04");
  verifie("mise à pied sans durée — le point est absent, pas sans objet",
    p.etat === ABSENT && !p.sansObjet, `état « ${p.etat} », sansObjet=${p.sansObjet}`);
  verifie("mise à pied sans durée — la phrase qui la prévoit est rendue",
    p.passages.length === 1 && /mise à pied/.test(p.passages[0].texte));
  verifie("mise à pied sans durée — l'arrêt est cité",
    p.jurisprudence.some(j => /durée maximale/.test(j)));
}

/* ------------------------------------------------------------------ 4 */
/* Les clauses prohibées, une par famille. */
{
  const texte = [
    "Article 12 — Tout retard donnera lieu à une amende de vingt euros retenue sur le salaire du mois suivant.",
    "Article 13 — La fouille des sacs est effectuée à la sortie de l'établissement, à tout moment et pour tous les salariés.",
    "Article 14 — Les salariées dont l'état de grossesse est apparent sont affectées d'office au service administratif.",
    "Article 15 — L'abandon de poste vaut démission et emporte rupture de plein droit du contrat de travail.",
    "Article 16 — La période d'essai est de quatre mois, renouvelable une fois.",
  ].join("\n");
  const a = CR.analyser(texte);
  for (const id of ["RI-CTR-11", "RI-CTR-12", "RI-CTR-13", "RI-CTR-14", "RI-CTR-15"])
    verifie(`clause prohibée — ${id} signalé`, point(a, id).etat === ACONTROLER,
      `${id} rendu « ${point(a, id).etat} »`);

  verifie("clause prohibée — le module ne conclut pas à l'illicéité",
    a.points.filter(p => p.prohibe && p.etat === ACONTROLER)
      .every(p => /ne conclut pas/.test(p.motif)));
  verifie("clause prohibée — le critère du juge est rendu",
    point(a, "RI-CTR-12").critere.indexOf("proportionnée") !== -1);
  verifie("clause prohibée — l'amende est rattachée à L. 1331-2",
    point(a, "RI-CTR-11").fondement.indexOf("L1331-2") !== -1);
}

/* ------------------------------------------------------------------ 5 */
/* L'absence d'une famille prohibée ne délivre pas de quitus : le motif doit
   le dire, faute de quoi le lecteur y lirait une conformité. */
{
  const a = CR.analyser("Article unique — Les consignes de sécurité sont affichées dans l'atelier.");
  const p = point(a, "RI-CTR-11");
  verifie("famille prohibée absente — le motif refuse le quitus",
    p.etat === ABSENT && /ne vaut pas quitus/.test(p.motif), p.motif);
}

/* ------------------------------------------------------------------ 6 */
/* La version corrigée : le texte d'origine n'est pas altéré, les clauses
   absentes sont ajoutées, les passages à contrôler sont signalés en place. */
{
  const origine = "Article 12 — Tout retard donnera lieu à une amende de vingt euros. Article 13 — Les consignes de sécurité sont affichées.";
  const a = CR.analyser(origine);
  const c = CR.corriger(a);
  verifie("version corrigée — le texte d'origine est conservé mot pour mot",
    c.corps.replace(/\s*\[À CONTRÔLER[^\]]*\]/g, "") === origine,
    c.corps);
  verifie("version corrigée — le passage prohibé est signalé à sa place",
    /amende de vingt euros\.\s+\[À CONTRÔLER — RI-CTR-11/.test(c.corps), c.corps);
  verifie("version corrigée — les clauses des matières absentes sont proposées",
    c.ajouts.length >= 6 && c.ajouts.every(x => x.lignes.length > 0), `${c.ajouts.length}`);
  verifie("version corrigée — aucune clause n'est proposée pour une matière déjà traitée",
    !c.ajouts.some(x => x.id === "RI-CTR-01"));

  const plat = CR.texteCorrige(a);
  verifie("texte corrigé — la section des ajouts est titrée",
    /CLAUSES AJOUTÉES AU TITRE DU CONTRÔLE/.test(plat));
  verifie("texte corrigé — les articles sont écrits en clair",
    /L\. 1321-2/.test(plat), "les fondements ne sont pas mis en forme");
  verifie("texte corrigé — le critère accompagne le passage signalé",
    /Critère :/.test(plat) && /« Article 12 — Tout retard/.test(plat));
}

/* ------------------------------------------------------------------ 7 */
/* Le choix de l'utilisateur commande : ce qu'il n'a pas retenu n'entre pas
   dans la version corrigée. */
{
  const a = CR.analyser("Article 1 — Rien de particulier.");
  const c = CR.corriger(a, { inserer: ["RI-CTR-06"], signaler: [] });
  verifie("choix — une seule clause insérée", c.ajouts.length === 1 && c.ajouts[0].id === "RI-CTR-06");
  verifie("choix — aucun passage signalé", c.notes.length === 0);
}

/* ------------------------------------------------------------------ 8 */
/* Le repérage voit-il ce qui est écrit autrement ? Le cas est construit pour
   ÉCHOUER si le module prétendait couvrir toutes les rédactions : la matière
   est traitée en d'autres termes, et le module la dit absente. Ce test fixe
   la limite du procédé, et le motif doit l'avouer. */
{
  const a = CR.analyser("Article 4 — Nul ne peut être sanctionné sans avoir été mis en mesure de s'expliquer au cours d'un échange contradictoire.");
  const p = point(a, "RI-CTR-05");
  verifie("limite du repérage — la matière rédigée autrement est dite absente",
    p.etat === ABSENT, `état « ${p.etat} » : le repérage a vu une marque qu'il ne devrait pas voir`);
  verifie("limite du repérage — l'en-tête du module la déclare",
    /marque trouvée ne prouve pas/.test(require("fs")
      .readFileSync(require("path").join(__dirname, "controle-ri.js"), "utf8")));
}

/* ----------------------------------------------------------------- 8bis */
/* Les fausses reconnaissances. Une marque cherchée en sous-chaîne voit
   « amende » dans « amendement » et « alerte » dans « alerte incendie ». Ces
   deux phrases ne doivent rien déclencher. */
{
  const a = CR.analyser([
    "Article 2 — Le présent amendement au règlement intérieur prend effet ce jour.",
    "Article 3 — En cas d'alerte incendie, les salariés évacuent par les issues signalées.",
  ].join("\n"));
  verifie("faux positif — « amendement » ne déclenche pas l'amende",
    point(a, "RI-CTR-11").etat === ABSENT, point(a, "RI-CTR-11").passages.map(x => x.texte).join(" | "));
  verifie("faux positif — « alerte incendie » ne déclenche pas le lanceur d'alerte",
    point(a, "RI-CTR-07").etat === ABSENT, point(a, "RI-CTR-07").passages.map(x => x.texte).join(" | "));
  verifie("la borne de mot est bien celle qui l'empêche",
    CR.contient("amendement au reglement", "amende") === false &&
    CR.contient("une amende de vingt euros", "amende") === true);
}

/* ------------------------------------------------------------------ 9 */
/* Chaque point de la grille cite un fondement, et chaque matière imposée
   porte la clause qui la comble. */
{
  for (const g of CR.GRILLE) {
    verifie(`grille — ${g.id} a un fondement`, g.fondement && g.fondement.length > 0);
    verifie(`grille — ${g.id} a un objet`, !!g.objet);
    if (g.prohibe) {
      verifie(`grille — ${g.id} a un critère`, !!g.critere);
      verifie(`grille — ${g.id} dit quoi faire`, !!g.remplacement);
    } else {
      verifie(`grille — ${g.id} porte la clause qui comble l'absence`, !!g.clause && g.clause.length > 0);
    }
  }
}

console.log(`${verifications} vérifications sur ${CR.GRILLE.length} points de grille, ${echecs} échec(s)`);
if (echecs) process.exit(1);

module.exports = { verifications };
