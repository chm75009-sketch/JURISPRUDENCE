/* Le socle de l'audit social : lire le profil de l'entreprise, et dire pour
   chaque seuil s'il est atteint, non atteint, ou impossible à apprécier.

   TROIS RÈGLES DE MÉTHODE, les mêmes que partout dans le dépôt :

   1. Une donnée absente ne conclut jamais. Un effectif non renseigné ne rend
      aucune obligation « sans objet » — il rend l'assujettissement
      indéterminé, et le référentiel le dit.

   2. Les seuils d'effectif ne se lisent pas seuls : plusieurs obligations
      naissent d'un effectif atteint PENDANT DOUZE MOIS CONSÉCUTIFS. Le profil
      le demande, et un seuil franchi hier n'est pas un seuil acquis.

   3. Le moteur ne prononce rien : il rend l'assujettissement et ses motifs.
      Les contrôles prononcent, dans controles-social.js.                    */

const nombre = x => (typeof x === "number" && isFinite(x) ? x
  : (typeof x === "string" && x.trim() !== "" && isFinite(+x) ? +x : null));
const dit = x => x === true || x === "oui";
const nie = x => x === false || x === "non";
const renseigne = x => x !== undefined && x !== null && String(x).trim() !== "";

/* Le seuil d'effectif brut : atteint, pas atteint, ou inconnu. */
function seuil(p, n) {
  const eff = nombre(p.effectif);
  if (eff === null) return { connu: false, atteint: null,
    motif: `L'effectif n'est pas renseigné : le seuil de ${n} salarié(s) ne peut pas être apprécié.` };
  return { connu: true, atteint: eff >= n,
    motif: eff >= n ? `Effectif de ${eff} salariés : le seuil de ${n} est atteint.`
      : `Effectif de ${eff} salariés : le seuil de ${n} n'est pas atteint.` };
}

/* Le seuil durci par la durée : atteint depuis au moins douze mois consécutifs.
   C'est la condition que portent notamment la mise en place du comité et le
   règlement intérieur — un seuil franchi le mois dernier n'y suffit pas. */
function seuilDouzeMois(p, n) {
  const s = seuil(p, n);
  if (!s.connu) return { connu: false, atteint: null, motif: s.motif };
  if (!s.atteint) return s;
  if (!renseigne(p.seuilDepuis12Mois))
    return { connu: false, atteint: null,
      motif: `Effectif de ${nombre(p.effectif)} salariés, mais il n'est pas dit si ce niveau est atteint depuis au moins douze mois consécutifs : l'assujettissement ne peut pas être conclu.` };
  if (nie(p.seuilDepuis12Mois))
    return { connu: true, atteint: false,
      motif: `Le seuil de ${n} salariés est franchi, mais pas depuis douze mois consécutifs : l'obligation n'est pas encore née — elle le sera si l'effectif se maintient. À suivre.` };
  return { connu: true, atteint: true,
    motif: `Effectif de ${nombre(p.effectif)} salariés atteint depuis au moins douze mois consécutifs : le seuil de ${n} est acquis.` };
}

/* Une réponse oui/non du profil, sans jamais deviner. */
function ouiNon(p, cle, question) {
  const v = p[cle];
  if (!renseigne(v)) return { connu: false, vrai: null, motif: `${question} — la réponse n'est pas renseignée : rien ne se conclut.` };
  return { connu: true, vrai: dit(v), motif: null };
}

module.exports = { nombre, dit, nie, renseigne, seuil, seuilDouzeMois, ouiNon };
