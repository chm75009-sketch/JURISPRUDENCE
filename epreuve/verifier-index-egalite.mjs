/* L'INDEX DE L'ÉGALITÉ, ÉPROUVÉ SUR SON ARITHMÉTIQUE.

   Le module ne touche ni à l'écran ni au stockage : il se charge dans node et
   on lui donne des cas dont le résultat se vérifie à la main.

   Le barème et les règles viennent des annexes I et II du chapitre II bis,
   citées dans docs/index-egalite.js avec leurs identifiants de version.

     node epreuve/verifier-index-egalite.mjs                                */
import { readFileSync } from "node:fs";

const src = readFileSync("docs/index-egalite.js", "utf8");
const fenetre = {};
new Function("window", src)(fenetre);
const IX = fenetre.IndexEgalite;

let n = 0, ko = 0;
function ok(quoi, a, b) {
  n++;
  const eg = JSON.stringify(a) === JSON.stringify(b);
  if (!eg) { ko++; console.log("FAUTE " + quoi + " : " + JSON.stringify(a) + " au lieu de " + JSON.stringify(b)); }
}

/* LE BARÈME. Les vingt-deux lignes de l'annexe, aux bornes. */
ok("écart nul", IX.pointsEcart(0), 40);
ok("écart 0,1", IX.pointsEcart(0.1), 39);
ok("écart 1", IX.pointsEcart(1), 39);
ok("écart 1,1", IX.pointsEcart(1.1), 38);
ok("écart 7,5", IX.pointsEcart(7.5), 31);
ok("écart 15,2", IX.pointsEcart(15.2), 14);
ok("écart 20", IX.pointsEcart(20), 2);
ok("écart 20,1", IX.pointsEcart(20.1), 0);
ok("écart 40", IX.pointsEcart(40), 0);

/* LES TRANCHES D'ÂGE. */
ok("29 ans", IX.tranche(29).cle, "a");
ok("30 ans", IX.tranche(30).cle, "b");
ok("39 ans", IX.tranche(39).cle, "b");
ok("40 ans", IX.tranche(40).cle, "c");
ok("50 ans", IX.tranche(50).cle, "d");
ok("âge au 31 décembre", IX.ageAu("1990-11-30", 2025), 35);

/* UN CAS COMPLET, ANNEXE II, CALCULÉ À LA MAIN.

   Un seul groupe : coefficient 150 M, tranche « de 30 à 39 ans », trois femmes
   à 12, 12 et 12 euros, trois hommes à 13, 13 et 13. Moyennes 12 et 13, écart
   (13 - 12) / 13 = 7,6923 %, moins le seuil de 2 points = 5,6923 %, arrondi à
   5,7 : le barème donne 34 points. Six salariés sur six pris en compte : la
   règle des 40 % est tenue.                                                  */
function s(id, sexe, nais, coef, rem) {
  return { id, nom: id, sexe, nais, coef, csp: "ouvriers", rem };
}
const six = [
  s("f1", "F", "1990-01-01", "150 M", 12), s("f2", "F", "1991-01-01", "150 M", 12),
  s("f3", "F", "1992-01-01", "150 M", 12), s("h1", "H", "1990-01-01", "150 M", 13),
  s("h2", "H", "1991-01-01", "150 M", 13), s("h3", "H", "1992-01-01", "150 M", 13)
];
let r = IX.calculer({ annee: 2025, effectif: 82, base: "coef", salaries: six,
  aug2: { f: 2, h: 1 }, mat: { retours: 1, augmentees: 1, pendant: "oui" } });
ok("annexe retenue", r.annexe, "II");
ok("écart de rémunération, résultat", r.indicateurs[0].resultat, 5.7);
ok("écart de rémunération, points", r.indicateurs[0].points, 34);
ok("part de l'effectif retenu", r.indicateurs[0].part, 1);

/* Les augmentations : trois femmes, trois hommes, donc moins de cinq de chaque
   sexe : l'indicateur n'est pas calculable. */
ok("augmentations incalculables", r.indicateurs[1].etat, "incalculable");
ok("maternité, points", r.indicateurs[2].points, 15);
/* Six rémunérations connues : les dix plus hautes ne se classent pas. */
ok("dix plus hautes, manque", r.indicateurs[3].etat, "manque");
ok("total incomplet", r.etat, "incomplet");

/* LE MÊME CAS AVEC DOUZE SALARIÉS, POUR QUE TOUT SE CALCULE.

   Six femmes à 12, six hommes à 13, tous dans la tranche « de 30 à 39 ans » et
   au même coefficient. Écart 7,6923 - 2 = 5,7 : 34 points. Augmentations :
   3 femmes sur 6, soit 50 %, et 1 homme sur 6, soit 16,7 % ; écart 33,3 points
   de pourcentage, soit 2 salariés (33,333 % de 6 = 2). Le barème retient le
   plus favorable des deux lectures : 2 salariés, donc 35 points. Les dix plus
   hautes rémunérations sont les six hommes à 13 et quatre femmes à 12 :
   4 pour le sexe sous-représenté, donc 10 points. Maternité 15. Total
   34 + 35 + 15 + 10 = 94.                                                    */
const douze = [];
for (let i = 0; i < 6; i++) douze.push(s("f" + i, "F", "1990-01-01", "150 M", 12));
for (let i = 0; i < 6; i++) douze.push(s("h" + i, "H", "1990-01-01", "150 M", 13));
r = IX.calculer({ annee: 2025, effectif: 82, base: "coef", salaries: douze,
  aug2: { f: 3, h: 1 }, mat: { retours: 2, augmentees: 2, pendant: "oui" } });
ok("écart, douze salariés", r.indicateurs[0].resultat, 5.7);
ok("augmentations, écart en points", r.indicateurs[1].resultat, 33.3);
ok("augmentations, écart en salariés", r.indicateurs[1].salaries, 2);
ok("augmentations, points", r.indicateurs[1].points, 35);
ok("dix plus hautes, résultat", r.indicateurs[3].resultat, 4);
ok("dix plus hautes, points", r.indicateurs[3].points, 10);
ok("niveau de résultat", r.niveau, 94);
ok("état", r.etat, "calcule");

/* LA PROPORTIONNALITÉ. Sans retour de congé de maternité, l'indicateur des
   quinze points n'est pas calculable : le maximum atteignable descend à 85, et
   34 + 35 + 10 = 79 points sont ramenés sur cent, soit 93.                   */
r = IX.calculer({ annee: 2025, effectif: 82, base: "coef", salaries: douze,
  aug2: { f: 3, h: 1 }, mat: { retours: 0, augmentees: 0, pendant: "non" } });
ok("maximum atteignable", r.maxAtteint, 85);
ok("points avant proportionnalité", r.points, 79);
ok("niveau ramené sur cent", r.niveau, 93);
ok("proportionnalité signalée", r.proportionnalite, true);

/* LE SEUIL DE PERTINENCE PAR CATÉGORIE : cinq points au lieu de deux.
   7,6923 - 5 = 2,6923, arrondi à 2,7 : 37 points.                            */
r = IX.calculer({ annee: 2025, effectif: 82, base: "csp", salaries: douze,
  aug2: { f: 3, h: 1 }, mat: { retours: 2, augmentees: 2, pendant: "oui" } });
ok("seuil de cinq points", r.indicateurs[0].resultat, 2.7);
ok("points au seuil de cinq", r.indicateurs[0].points, 37);

/* LES MESURES DE CORRECTION DU 5.2. L'écart de rémunération désavantage les
   femmes et n'est pas au maximum ; le taux d'augmentation des femmes, 50 %,
   est supérieur à celui des hommes, 16,7 % : l'indicateur des augmentations
   passe au maximum. Il y est déjà dans le cas ci-dessus, on le vérifie donc
   sur un écart plus large : 6 femmes augmentées sur 6 et 0 homme, soit
   100 points de pourcentage, ce qui vaut zéro point, mais 6 salariés, ce qui
   en vaut quinze ; le barème retient le plus élevé des deux lectures, donc
   quinze, et le 5.2 porte l'indicateur à trente-cinq.                        */
r = IX.calculer({ annee: 2025, effectif: 82, base: "coef", salaries: douze,
  aug2: { f: 6, h: 0 }, mat: { retours: 2, augmentees: 2, pendant: "oui" } });
ok("correction appliquée", r.indicateurs[1].correction, true);
ok("points sans la correction", r.indicateurs[1].pointsAvant, 15);
ok("points avec la correction", r.indicateurs[1].points, 35);

/* L'INVERSE : quand les écarts d'augmentations favorisent les hommes, déjà les
   mieux payés, le 5.2 ne s'applique pas et les quinze points restent. */
r = IX.calculer({ annee: 2025, effectif: 82, base: "coef", salaries: douze,
  aug2: { f: 0, h: 6 }, mat: { retours: 2, augmentees: 2, pendant: "oui" } });
ok("pas de correction", !!r.indicateurs[1].correction, false);
ok("quinze points aux augmentations", r.indicateurs[1].points, 15);

/* L'ANNEXE I, au-delà de deux cent cinquante salariés : cinq indicateurs, et
   les groupes des augmentations et des promotions demandent dix femmes et dix
   hommes par catégorie. Vingt-deux salariés d'une seule catégorie : onze
   femmes à 12, onze hommes à 13.                                             */
const vingtDeux = [];
for (let i = 0; i < 11; i++) vingtDeux.push(s("F" + i, "F", "1990-01-01", "150 M", 12));
for (let i = 0; i < 11; i++) vingtDeux.push(s("H" + i, "H", "1990-01-01", "150 M", 13));
r = IX.calculer({ annee: 2025, effectif: 400, base: "coef", salaries: vingtDeux,
  aug: { ouvriers: { f: 2, h: 2 } }, promo: { ouvriers: { f: 1, h: 1 } },
  mat: { retours: 1, augmentees: 1, pendant: "oui" } });
ok("annexe I", r.annexe, "I");
ok("cinq indicateurs", r.indicateurs.length, 5);
ok("augmentations hors promotion, écart nul", r.indicateurs[1].resultat, 0);
ok("augmentations hors promotion, vingt points", r.indicateurs[1].points, 20);
ok("promotions, quinze points", r.indicateurs[2].points, 15);
/* Les dix plus hautes rémunérations sont ici les dix hommes à 13 euros : le
   sexe sous-représenté n'en compte aucun, donc zéro point. */
ok("dix plus hautes, aucune femme", r.indicateurs[4].resultat, 0);
ok("total annexe I", r.niveau, 34 + 20 + 15 + 15 + 0);

/* LES EXCLUSIONS. Un apprenti et un salarié écarté ne comptent pas. */
const avecExclus = douze.concat([
  { id: "ap", nom: "apprenti", sexe: "F", nais: "2005-01-01", coef: "150 M", csp: "ouvriers",
    rem: 6, motif: "apprenti", ecarte: true }]);
r = IX.calculer({ annee: 2025, effectif: 82, base: "coef", salaries: avecExclus,
  aug2: { f: 3, h: 1 }, mat: { retours: 2, augmentees: 2, pendant: "oui" } });
ok("salariés pris en compte", r.pris, 12);
ok("salariés écartés", r.ecartes, 1);
ok("l'apprenti ne change pas l'écart", r.indicateurs[0].resultat, 5.7);

/* LA RÈGLE DES 40 %. Douze salariés, dont six seulement dans un groupe
   complet : l'autre moitié est seule dans sa tranche d'âge. Six sur douze font
   50 %, la règle est tenue ; on descend donc à quatre sur douze, soit 33 %. */
const epars = [
  s("a1", "F", "1990-01-01", "150 M", 12), s("a2", "F", "1990-01-01", "150 M", 12),
  s("a3", "F", "1990-01-01", "150 M", 12), s("a4", "H", "1990-01-01", "150 M", 13),
  s("b1", "F", "1970-01-01", "120 M", 12), s("b2", "F", "1971-01-01", "130 M", 12),
  s("b3", "F", "1972-01-01", "140 M", 12), s("b4", "H", "1973-01-01", "115 M", 13),
  s("b5", "H", "1974-01-01", "116 M", 13), s("b6", "H", "1975-01-01", "117 M", 13),
  s("b7", "H", "1976-01-01", "118 M", 13), s("b8", "H", "1977-01-01", "119 M", 13)
];
r = IX.calculer({ annee: 2025, effectif: 82, base: "coef", salaries: epars,
  aug2: { f: 3, h: 1 }, mat: { retours: 2, augmentees: 2, pendant: "oui" } });
/* Par coefficient, aucun groupe ne réunit trois femmes et trois hommes ; le
   repli sur les catégories socioprofessionnelles, que l'annexe commande, les
   réunit dans la tranche des cinquante ans et plus. */
ok("le calcul se replie sur la catégorie", r.indicateurs[0].etat, "calcule");
ok("et le dit", r.indicateurs[0].repli, true);
ok("au seuil de cinq points", r.indicateurs[0].seuil, 5);

/* LE REPLI SUR LES CATÉGORIES SOCIOPROFESSIONNELLES.

   Douze salariés, chacun à un coefficient différent : aucun groupe ne réunit
   trois femmes et trois hommes, et le classement par coefficient ne tient pas.
   L'annexe commande alors de regrouper par catégorie socioprofessionnelle, où
   les douze se retrouvent : 12 contre 13 euros, écart 7,7 %, moins le seuil de
   5 %, soit 2,7 %, donc 37 points.                                           */
const eparpilles = [];
for (let i = 0; i < 6; i++)
  eparpilles.push({ id: "F" + i, nom: "F" + i, sexe: "F", nais: "1990-01-01",
    coef: "1" + i + "0 M", csp: "ouvriers", rem: 12 });
for (let i = 0; i < 6; i++)
  eparpilles.push({ id: "H" + i, nom: "H" + i, sexe: "H", nais: "1990-01-01",
    coef: "2" + i + "0 M", csp: "ouvriers", rem: 13 });
r = IX.calculer({ annee: 2025, effectif: 82, base: "coef", salaries: eparpilles,
  aug2: { f: 3, h: 1 }, mat: { retours: 2, augmentees: 2, pendant: "oui" } });
ok("le repli est signalé", r.indicateurs[0].repli, true);
ok("la base devient la catégorie", r.base, "csp");
ok("le seuil passe à cinq points", r.indicateurs[0].seuil, 5);
ok("le résultat du repli", r.indicateurs[0].resultat, 2.7);
ok("les points du repli", r.indicateurs[0].points, 37);

/* Quand le coefficient suffit, il n'y a pas de repli. */
r = IX.calculer({ annee: 2025, effectif: 82, base: "coef", salaries: douze,
  aug2: { f: 3, h: 1 }, mat: { retours: 2, augmentees: 2, pendant: "oui" } });
ok("pas de repli inutile", !!r.indicateurs[0].repli, false);
ok("la base reste le coefficient", r.base, "coef");

console.log("epreuve/verifier-index-egalite.mjs  " + (ko ? "FAUTES : " + ko + " sur " + n : "OK : " + n + " contrôles"));
process.exit(ko ? 1 : 0);
