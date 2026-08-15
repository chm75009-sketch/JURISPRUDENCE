/* Une pièce n'est plus une case cochée : c'est un objet daté, situé, versionné.
   Le contrôle porte alors sur ce qu'elle est, non sur le fait qu'on l'annonce. */
const norm = f => {
  const l = f.pieces || [];
  return l.map(p => typeof p === "string" ? { code: p, _binaire: true } : p);
};
const get = (f, code) => norm(f).find(p => p.code === code) || null;
const CHAMPS = ["fichier","date","periode","auteur","version","perimetre","lue"];
const complet = p => p && !p._binaire && CHAMPS.every(c => p[c] !== undefined && p[c] !== "");
const manquants = p => p && !p._binaire ? CHAMPS.filter(c => p[c] === undefined || p[c] === "") : CHAMPS;
module.exports = { norm, get, complet, manquants, CHAMPS };
