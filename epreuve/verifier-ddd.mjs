/* LE LECTEUR DE CARTE DE CONDUCTEUR, SUR DES FICHIERS DONT ON SAIT LA RÉPONSE.

   docs/lire-ddd.js décode le bloc des activités journalières d'une carte de
   conducteur. Rien ne permet de le vérifier sur un vrai fichier : une carte
   réelle porte des données de salarié, et il n'y en a pas dans le dépôt. On
   fabrique donc les fichiers ici, octet par octet, selon la structure décrite
   en tête du module, et l'on compare le décodage à ce qu'on y a mis.

   Six cas, choisis parce que chacun a déjà été une faute quelque part :
     - une journée ordinaire, travail puis conduite, avec une coupure ;
     - une journée entièrement au repos, qui ne doit donner ni début ni fin ;
     - une journée de convoyeur, pour l'emplacement ;
     - un tampon circulaire dont un enregistrement enjambe la fin ;
     - le même jour écrit deux fois, dont on garde la seconde version ;
     - un fichier sans bloc d'activités, qui doit le dire et non échouer.

     node epreuve/verifier-ddd.mjs                                           */
import { readFileSync } from "node:fs";

const src = readFileSync(new URL("../docs/lire-ddd.js", import.meta.url), "utf8");
const w = {};
new Function("window", src)(w);
const L = w.LireDDD;

let fautes = 0;
function faute(m) { console.log("FAUTE " + m); fautes++; }
function egal(quoi, vu, attendu) {
  if (String(vu) !== String(attendu))
    faute(quoi + " : « " + vu + " » au lieu de « " + attendu + " »");
}

const ACT = ["repos", "disponibilite", "travail", "conduite"];
function chgt(activite, minute, convoyeur) {
  return ((convoyeur ? 0x8000 : 0) | (ACT.indexOf(activite) << 12) | (minute & 0x07ff));
}
/* Un enregistrement de jour, tel que le module l'attend. */
function jour(iso, changements, distance) {
  const secs = Math.floor(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10), 12) / 1000);
  const lg = 12 + changements.length * 2;
  const t = new Uint8Array(lg);
  t[2] = lg >> 8; t[3] = lg & 0xff;
  t[4] = (secs >>> 24) & 0xff; t[5] = (secs >>> 16) & 0xff;
  t[6] = (secs >>> 8) & 0xff; t[7] = secs & 0xff;
  t[9] = 1;
  t[10] = (distance >> 8) & 0xff; t[11] = distance & 0xff;
  changements.forEach((v, i) => { t[12 + i * 2] = v >> 8; t[13 + i * 2] = v & 0xff; });
  return t;
}
/* Le fichier : un bloc 0x0504, son tampon, et de la place libre à la fin. */
function fichier(records, { vieux = 0, libre = 24, fid = 0x0504 } = {}) {
  const corps = records.reduce((n, r) => n + r.length, 0);
  const zone = new Uint8Array(4 + corps + libre);
  zone[0] = (vieux >> 8) & 0xff; zone[1] = vieux & 0xff;
  let p = 4;
  records.forEach((r) => { zone.set(r, p); p += r.length; });
  zone[2] = ((p - 4 - records[records.length - 1].length) >> 8) & 0xff;
  zone[3] = (p - 4 - records[records.length - 1].length) & 0xff;
  const bloc = new Uint8Array(5 + zone.length);
  bloc[0] = (fid >> 8) & 0xff; bloc[1] = fid & 0xff; bloc[2] = 0x00;
  bloc[3] = zone.length >> 8; bloc[4] = zone.length & 0xff;
  bloc.set(zone, 5);
  return bloc;
}
function commeFichier(octets) {
  return { arrayBuffer: () => Promise.resolve(octets.buffer.slice(
    octets.byteOffset, octets.byteOffset + octets.length)) };
}

/* ---- 1. une journée ordinaire ------------------------------------------ */
{
  const f = fichier([jour("2026-09-01", [
    chgt("repos", 0), chgt("travail", 360), chgt("conduite", 390),
    chgt("repos", 720), chgt("conduite", 765), chgt("repos", 990)], 412)]);
  const J = await L.jours(commeFichier(f));
  egal("une journée lue", J.length, 1);
  const j = J[0];
  egal("la date", j.iso, "2026-09-01");
  egal("le début", j.debut, "06:00");
  egal("la fin", j.fin, "16:30");
  egal("la pause", j.pause, 45);
  egal("la conduite", j.conduite, 555);
  egal("le travail", j.travail, 30);
  egal("la distance", j.distance, 412);
  egal("l'emplacement", j.emplacement, "conducteur");
}

/* ---- 2. une journée entièrement au repos ------------------------------- */
{
  const f = fichier([jour("2026-09-03", [chgt("repos", 0)], 0)]);
  const J = await L.jours(commeFichier(f));
  egal("le jour de repos est lu", J.length, 1);
  egal("le repos sans début", J[0].debut, "");
  egal("le repos sans fin", J[0].fin, "");
  egal("le repos sans pause", J[0].pause, 0);
}

/* ---- 3. le convoyeur --------------------------------------------------- */
{
  const f = fichier([jour("2026-09-04", [
    chgt("travail", 420, true), chgt("repos", 900, true)], 120)]);
  const J = await L.jours(commeFichier(f));
  egal("l'emplacement du convoyeur", J[0].emplacement, "convoyeur");
  egal("le début du convoyeur", J[0].debut, "07:00");
}

/* ---- 4. un enregistrement qui enjambe la fin du tampon ----------------- */
{
  /* Le tampon est juste assez grand pour les deux jours ; on place le plus
     ancien près de la fin, de sorte qu'il déborde et reprenne au début. C'est
     le cas qu'une carte pleine produit tous les jours, et celui qu'un lecteur
     écrit trop vite manque. */
  const a = jour("2026-09-05", [chgt("conduite", 300), chgt("repos", 780)], 300);
  const b = jour("2026-09-06", [chgt("travail", 480), chgt("repos", 960)], 10);
  const n = a.length + b.length;
  const zone = new Uint8Array(4 + n);
  const depart = n - Math.floor(a.length / 2);       /* a enjambe la fin */
  zone[0] = (depart >> 8) & 0xff; zone[1] = depart & 0xff;
  for (let k = 0; k < a.length; k++) zone[4 + ((depart + k) % n)] = a[k];
  for (let k = 0; k < b.length; k++) zone[4 + ((depart + a.length + k) % n)] = b[k];
  const bloc = new Uint8Array(5 + zone.length);
  bloc[0] = 0x05; bloc[1] = 0x04; bloc[2] = 0x00;
  bloc[3] = zone.length >> 8; bloc[4] = zone.length & 0xff;
  bloc.set(zone, 5);
  const J = await L.jours(commeFichier(bloc));
  egal("deux jours dans un tampon circulaire", J.length, 2);
  egal("le premier jour du tampon", J[0].iso, "2026-09-05");
  egal("le second jour du tampon", J[1].iso, "2026-09-06");
  egal("le début du jour qui enjambe", J[0].debut, "05:00");
}

/* ---- 5. le même jour deux fois : on garde le dernier ------------------- */
{
  const f = fichier([
    jour("2026-09-07", [chgt("travail", 300), chgt("repos", 600)], 5),
    jour("2026-09-07", [chgt("conduite", 360), chgt("repos", 900)], 250)]);
  const J = await L.jours(commeFichier(f));
  egal("un seul enregistrement pour le jour", J.length, 1);
  egal("c'est le dernier qui est gardé", J[0].debut, "06:00");
  egal("la distance du dernier", J[0].distance, 250);
}

/* ---- 6. un fichier sans bloc d'activités ------------------------------- */
{
  const f = fichier([jour("2026-09-08", [chgt("travail", 300)], 1)], { fid: 0x0505 });
  let dit = "";
  try { await L.jours(commeFichier(f)); } catch (e) { dit = e.message; }
  egal("le message d'un fichier sans activités", dit, "activites");
}

console.log("carte de conducteur : cas essayés 6 | fautes " + fautes);
process.exit(fautes ? 1 : 0);
