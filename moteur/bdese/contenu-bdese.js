/* La base de données économiques, sociales et environnementales : son contenu,
   extrait du texte et non recopié.

   Onze mille caractères en deçà de trois cents salariés, trente et un mille huit
   cents au-delà. Recopier cela à la main, c'est garantir des écarts — et surtout
   des écarts silencieux à la prochaine modification du décret. Le contenu est
   donc découpé depuis le texte lui-même, comme l'a été le tableau de l'article
   R. 2314-1, et la couverture du découpage est mesurée : ce qui n'a pas été
   reconnu est compté et affiché, jamais passé sous silence.

   Trois étages, et l'ordre entre eux commande tout :

   — le plancher de l'article L. 2312-21, troisième alinéa : les thèmes que la
     base comporte « au moins ». Aucun accord ne descend en dessous. Deux thèmes
     du décret n'y figurent pas — la sous-traitance, que le décret nomme
     « partenariats », et les transferts intragroupe : un accord peut donc les
     supprimer, et l'application doit le dire ;
   — l'accord de l'article L. 2312-21, d'entreprise ou, à défaut et en deçà de
     trois cents salariés, de branche ;
   — le supplétif des articles R. 2312-8 et R. 2312-9, qui ne s'applique qu'à
     défaut d'accord.

   Le découpage suit la ponctuation du décret :
     N° Rubrique : A-Section : a) Sujet ; -information ; -information ; b) …

   Usage : node bdese.js            mesure la couverture et publie _bdese.json */
const fs = require("fs");
const T = JSON.parse(fs.readFileSync(__dirname + "/textes-bdese.json", "utf8"));

const net = s => String(s || "").replace(/\s+/g, " ").trim();
const texte = n => { const v = T[n]; if (!v || !v.texte) throw new Error(`Article ${n} non lu à la source.`); return net(v.texte); };

/* Le plancher : les thèmes énumérés au troisième alinéa de L. 2312-21, relevés
   dans le texte même plutôt que recopiés. La phrase les sépare par des virgules
   et se termine par « et les conséquences environnementales… ». */
const PLANCHER = (() => {
  const t = texte("L2312-21");
  const m = t.match(/La base de données comporte au moins les thèmes suivants\s*:\s*([^.]+)\./);
  if (!m) throw new Error("Le plancher de L. 2312-21 n'a pas été retrouvé dans le texte.");
  /* La phrase sépare les thèmes par des virgules, et le dernier par « et ».
     Découper sur tous les « et » couperait « les femmes et les hommes » en deux :
     seul le « et » qui suit la dernière virgule est un séparateur. */
  const brut = m[1];
  const derniere = brut.lastIndexOf(",");
  const morceaux = (derniere < 0 ? [brut] :
    brut.slice(0, derniere).split(",").concat(brut.slice(derniere + 1).split(/\s+et\s+(?=l)/)));
  return morceaux.map(x => net(x).replace(/^l['’]|^les |^la |^le /, "")).filter(Boolean);
})();

/* Chaque rubrique du décret est-elle couverte par le plancher ? Le rattachement
   se fait sur les mots du plancher, non sur un numéro : c'est la seule manière
   de rester juste si l'un des deux textes est modifié. */
const MOTS = {
  1: ["investissement social", "investissement matériel et immatériel"],
  2: ["égalité professionnelle entre les femmes et les hommes au sein de l'entreprise"],
  3: ["fonds propres", "endettement"],
  4: ["ensemble des éléments de la rémunération des salariés et dirigeants"],
  5: ["activités sociales et culturelles"],
  6: ["rémunération des financeurs"],
  7: ["flux financiers à destination de l'entreprise"],
  8: [],
  9: [],
  10: ["conséquences environnementales de l'activité de l'entreprise"],
};
const auPlancher = n => (MOTS[n] || []).filter(m =>
  PLANCHER.some(p => p.toLowerCase().includes(m.toLowerCase().slice(0, 28))));

/* UN TITRE NE SE COUPE PAS AU MILIEU D'UN MOT.

   Quand une rubrique ou une section n'a pas de titre propre, le découpage en
   prend la tête, quatre-vingt-dix caractères. Coupés net, ils donnaient
   « Transferts de capitaux tels qu'ils figurent dans les comptes individuels
   des sociétés du g », que la relecture du 25 septembre 2026 a vu passer
   jusque dans un onglet du classeur. La coupe recule donc au dernier espace,
   et la ponctuation qui traîne s'en va : le titre reste un extrait exact du
   texte, comme la garantie du mot pour mot l'exige.                        */
function tete(s, n) {
  const t = String(s || "");
  if (t.length <= n) return t;
  const coupe = t.slice(0, n);
  const espace = coupe.lastIndexOf(" ");
  return (espace > n / 2 ? coupe.slice(0, espace) : coupe).replace(/[\s,;:.\-(]+$/, "");
}

/* ------------------------------------------------------------- le découpage */
function decouper(brut) {
  /* On retire l'en-tête, qui n'est pas du contenu mais l'énoncé du régime. */
  const t = brut.replace(/^.*?comporte (?:les informations suivantes|les informations prévues dans le tableau ci-dessous\.?)\s*:?\s*/i, "");
  const rubriques = [];
  /* Les rubriques : « 1° … » jusqu'au « 2° … » suivant. */
  /* Le numéro d'une rubrique ressemble à un renvoi : « 2° de l'article
     L. 2312-27 » et « 1° A e et f de l'article R. 2312-8 » en sont, et le décret
     en compte plusieurs. Trois marques distinguent le titre du renvoi — il
     commence par une majuscule, il ne cite pas d'article, et il ne contient pas
     de point avant les deux-points qui le ferment. Sans ces trois marques, le
     découpage prenait un renvoi pour une rubrique et en perdait une. */
  const candidat = m => {
    const suite = t.slice(m.index + m[0].length, m.index + m[0].length + 170);
    if (!/^[A-ZÉÈÀ]/.test(suite)) return false;
    const tete = suite.split(/\s*[:;]/)[0];
    return !/article|\./.test(tete);
  };
  const bornes = [];
  for (const m of t.matchAll(/(?:^|\s)(\d{1,2})°\s+/g)) {
    const attendu = bornes.length ? +bornes[bornes.length - 1][1] + 1 : 1;
    if (+m[1] === attendu && candidat(m)) bornes.push(m);
  }
  bornes.forEach((b, i) => {
    const deb = b.index + b[0].length;
    const fin = i + 1 < bornes.length ? bornes[i + 1].index : t.length;
    const corps = net(t.slice(deb, fin));
    const titre = net((corps.match(/^([^:;]{3,140})\s*[:;]/) || [, tete(corps, 90)])[1]);
    rubriques.push({ n: +b[1], titre, corps, sections: [] });
  });
  /* Les sections : « A-… », « B-… ». */
  for (const r of rubriques) {
    /* Trois écritures de section cohabitent dans le décret, et n'en connaître
       qu'une revenait à perdre le contenu des autres : « A-Investissement
       social », « I. Indicateurs sur la situation comparée » et, dans la
       rubrique environnementale, « I-Pour les entreprises soumises… ». La
       mesure l'a dit — trois mille sept cent quarante-neuf caractères du seul
       10° de R. 2312-9 tombaient hors du découpage. */
    const sb = [...r.corps.matchAll(/(?:^|\s)((?:[A-Z]|I{1,3}|IV|V|VI{0,3})\s?[-.]\s?)(?=[A-ZÉÈÀ])/g)]
      .map(m => Object.assign(m, { 1: m[1].replace(/[\s\-.]+$/, "") }));
    const zones = sb.length
      ? sb.map((m, i) => ({ lettre: m[1],
          corps: net(r.corps.slice(m.index + m[0].length, i + 1 < sb.length ? sb[i + 1].index : r.corps.length)) }))
      : [{ lettre: null, corps: r.corps.replace(/^[^:]{0,140}:\s*/, "") }];
    /* Ce qui précède la première section n'est pas perdu : il appartient à la
       rubrique elle-même — « montant de la contribution aux activités sociales
       et culturelles », qui vient avant « A-Représentation du personnel ». */
    if (sb.length && sb[0].index > 0) {
      const tete = net(r.corps.slice(0, sb[0].index)).replace(/^[^:]{0,160}:\s*/, "");
      if (tete.length > 3) zones.unshift({ lettre: null, corps: tete });
    }
    for (const z of zones) {
      /* Une section peut n'avoir pas de titre à elle : le décret enchaîne
         alors directement sur le premier sujet, et le découpage en prend la
         tête. Cette tête n'est pas un titre, et elle ne doit pas s'afficher
         comme tel — c'est ce qui donnait « …des sociétés du » au-dessus de la
         phrase entière. La marque est posée ici, une fois, plutôt que devinée
         à l'affichage. Relevé le 25 septembre 2026. */
      const mTitre = z.corps.match(/^([^:;]{3,160})\s*[:;]/);
      const titre = net(mTitre ? mTitre[1] : tete(z.corps, 90));
      const sujets = [];
      /* Les sujets : « a) … », « b) … ». */
      /* Les sujets : « a) … », et les alinéas romains minuscules « i-Identification
         des postes d'émissions… » de la rubrique environnementale. */
      const ab = [...z.corps.matchAll(/(?:^|\s)([a-z]\)|i{1,3}v?-|iv-|vi{0,3}-)\s*/g)]
        .map(m => Object.assign(m, { 1: m[1].replace(/[)\-]$/, "") }));
      const parts = ab.length
        ? ab.map((m, i) => ({ lettre: m[1],
            corps: net(z.corps.slice(m.index + m[0].length, i + 1 < ab.length ? ab[i + 1].index : z.corps.length)) }))
        : [{ lettre: null, corps: z.corps }];
      for (const p of parts) {
        /* Les informations : séparées par « ; - » ou par « ; ». */
        const morceaux = p.corps.split(/\s*;\s*/).map(net).filter(x => x && x !== "-");
        const intitule = net((morceaux[0] || "").replace(/^-\s*/, ""));
        sujets.push({ lettre: p.lettre, intitule,
          informations: morceaux.slice(1).map(x => net(x.replace(/^-\s*/, ""))).filter(Boolean) });
      }
      r.sections.push({ lettre: z.lettre, titre, sansTitre: !mTitre, sujets });
    }
    delete r.corps;
  }
  return rubriques;
}

/* La couverture : quelle part du texte se retrouve dans le découpage. Une
   mesure, non une promesse — c'est elle qui dira si le décret a changé de
   ponctuation et si l'extraction doit être reprise. */
const ENTETE = /^.*?comporte (?:les informations suivantes|les informations prévues dans le tableau ci-dessous\.?)\s*:?\s*/i;
/* R. 2312-9 ne se suffit pas à lui-même : il importe deux sujets de R. 2312-8.
   La phrase n'est pas du contenu, c'est un renvoi — mais ce qu'elle importe en
   est, et l'omettre priverait les entreprises d'au moins trois cents salariés
   de la formation professionnelle et des conditions de travail. */
/* Le renvoi se termine par un numéro d'article — « … de l'article R. 2312-8. » —
   dont le point interne trompait la borne : la phrase était coupée après
   « R. », et « 2312-8. » restait sur le carreau. La borne suit donc le numéro. */
const RENVOI = /Elle comporte également les informations relatives.*?article R\.\s*\d+-\d+(?:-\d+)?\.\s*/i;
/* Ce qui reste entre deux extraits, et qui n'est pas du contenu perdu.

   La première mesure annonçait 96,2 % et 96,6 %, et il fallait comprendre ce
   que valaient les 3,8 % restants avant de promettre cent pour cent. Ils ont été
   sortis un à un : ce sont des marqueurs et de la ponctuation — « ; a) »,
   « ; iii- », « ; 2° », « . II. » — c'est-à-dire l'ossature même du découpage.
   Le plus long trou de R. 2312-9, cent soixante et un caractères, est la phrase
   de renvoi vers R. 2312-8, déjà exécutée ailleurs.

   Autrement dit : rien n'était perdu, la mesure était fausse. Elle comptait
   comme reliquat ce que le découpage consomme en tant que structure — comme si
   l'on reprochait à une table des matières de ne pas contenir ses propres
   numéros de page.

   La règle est donc écrite, et STRICTE : un intervalle non extrait ne compte
   comme structure que s'il ne contient rien d'autre que des séparateurs, des
   numérotations et des lettres de rang. Tout le reste demeure un reliquat, il
   est publié tel quel, et il bloque la publication réglementaire. */
const STRUCTURE = /^[\s;:.,)(°-]*(?:(?:\d+°(?:\s*bis)?|[a-z]\)|[ivxIVX]+-|[A-Z]\.|[A-Z]-|I{1,3}\.|\d+\)|[a-z]-|-)[\s;:.,-]*)*$/;
const estStructure = t => STRUCTURE.test(t);

function couverture(brut, rubriques) {
  const dedans = [];
  for (const r of rubriques) {
    dedans.push(r.titre);
    for (const s of r.sections) {
      if (s.titre) dedans.push(s.titre);
      for (const su of s.sujets) { dedans.push(su.intitule); su.informations.forEach(x => dedans.push(x)); }
    }
  }
  /* Compter la longueur des libellés extraits donnait plus de cent pour cent :
     un titre de rubrique est aussi le début du premier sujet, et se comptait
     deux fois. On mesure donc ce que le découpage couvre du texte, en marquant
     les intervalles réellement consommés — une mesure ne vaut que si elle ne
     peut pas dépasser son maximum. */
  const pris = new Uint8Array(brut.length);
  let curseur = 0;
  for (const x of dedans) {
    if (!x) continue;
    let i = brut.indexOf(x, curseur);
    if (i < 0) i = brut.indexOf(x);          /* un titre repris plus haut */
    if (i < 0) continue;
    pris.fill(1, i, i + x.length);
    curseur = Math.max(curseur, i);
  }
  /* L'en-tête énonce le régime — « En l'absence d'accord prévu à l'article
     L. 2312-21, dans les entreprises de moins de trois cents salariés… » — il
     n'est pas du contenu, et il n'a rien à faire au dénominateur : le mesurer
     comme une perte reviendrait à se reprocher de ne pas l'avoir découpé. */
  const tete = (brut.match(ENTETE) || [""])[0].length;
  const renvoi = brut.match(RENVOI);
  if (renvoi) pris.fill(1, renvoi.index, renvoi.index + renvoi[0].length);
  /* Les intervalles restés hors du découpage, classés un à un : structure
     d'un côté — elle est consommée —, reliquat de l'autre — il ne l'est pas.
     Le classement se fait sur le texte lui-même, jamais sur sa longueur. */
  const structure = [], reliquat = [];
  let debut = -1;
  for (let i = tete; i <= pris.length; i++) {
    if (i < pris.length && !pris[i]) { if (debut < 0) debut = i; continue; }
    if (debut < 0) continue;
    const bout = { i: debut, n: i - debut, t: brut.slice(debut, i) };
    (estStructure(bout.t) ? structure : reliquat).push(bout);
    debut = -1;
  }
  structure.forEach(x => pris.fill(1, x.i, x.i + x.n));

  let couverts = 0;
  for (let i = tete; i < pris.length; i++) if (pris[i]) couverts++;
  const contenu = brut.length - tete;
  const perdus = reliquat.reduce((n, x) => n + x.n, 0);
  return { extraits: dedans.length, couverts, entete: tete, contenu,
    renvoi: renvoi ? net(renvoi[0]) : null,
    structure: structure.reduce((n, x) => n + x.n, 0),
    reliquat: perdus,
    fragments: reliquat.sort((a, b) => b.n - a.n).slice(0, 20).map(x => net(x.t)),
    part: +(100 * couverts / contenu).toFixed(1) };
}

/* Chaque libellé extrait doit se retrouver mot pour mot dans le texte : c'est
   la garantie qu'aucune information n'a été reformulée en chemin. */
function fidelite(brut, rubriques) {
  const manquants = [];
  const voir = x => { if (x && !brut.includes(x)) manquants.push(x.slice(0, 70)); };
  for (const r of rubriques) {
    voir(r.titre);
    for (const s of r.sections) {
      /* Une section marquée « hors » ne vient pas de cet article : l'index de
         l'égalité est dû par R. 2312-7, qui ajoute aux tableaux de R. 2312-8
         et R. 2312-9 sans y figurer. Le contrôle du mot pour mot ne peut donc
         pas la chercher ici. L'exemption est nommée, jamais silencieuse. */
      if (s.hors) continue;
      voir(s.titre);
      for (const su of s.sujets) { voir(su.intitule); su.informations.forEach(voir); } }
  }
  return manquants;
}

/* ═══════════════════════════════════════════════════════════════════════
   CE QUE L'EXTRACTION DU DÉCRET LAISSE DERRIÈRE ELLE

   Le texte de R. 2312-8 et de R. 2312-9 est découpé automatiquement. Trois
   scories sont passées jusque dans le classeur du client, relevées par deux
   relectures le 25 septembre 2026 :

   1. le texte ne s'arrête pas à la dernière ligne du tableau : il enchaîne
      sur la nomenclature des qualifications puis sur les cinquante-deux
      notes de bas de page, qui sortaient comme des informations à renseigner ;
   2. le premier indicateur d'une liste reste collé à l'intitulé du sujet,
      après un deux-points : « i) Effectif : Effectif total au 31/12 ». Il
      n'avait donc aucune ligne où être renseigné, et la colonne Sujet
      répétait la colonne Information ;
   3. les exposants des taux d'accidents, 10⁶ et 10³, reviennent en « 106 »
      et « 10 ³ », ce qui change le sens du taux.

   Ces trois nettoyages se font ici, sur l'arbre construit, et non dans le
   découpage : le découpage suit le texte, et c'est bien ainsi.            */
const FIN_DU_TABLEAU = "employés, techniciens et agents de maîtrise (ETAM)";

/* LES EXPOSANTS PERDUS, ET POURQUOI ON N'Y TOUCHE PAS.

   Le décret imprimé écrit « × 10⁶ » et « × 10³ » ; le texte servi par le
   relais rend « × 106 » et « × 10 ³ », l'exposant ayant disparu à la
   numérisation. Une relecture y a vu, le 25 septembre 2026, une faute de
   notre traitement. Elle est en amont : le rétablir ici reviendrait à écrire
   dans la base un libellé qui ne se retrouve pas mot pour mot dans le texte,
   et c'est la garantie à laquelle ce module tient le plus. On laisse donc le
   libellé tel qu'il est servi.                                             */

/* DEUX PHRASES DU DÉCRET COUPÉES AU MAUVAIS ENDROIT.

   Relevé le 25 septembre 2026, sur le classeur livré :

   - une information qui commence par « et » ou « ainsi que » est la fin de la
     phrase précédente, arrachée à elle : « c) Mesures envisagées en ce qui
     concerne l'amélioration [...] des méthodes de production et
     d'exploitation », puis, sur la ligne suivante, « et incidences de ces
     mesures sur les conditions de travail ». Elle est recollée ;
   - deux points distincts partagent une ligne quand le décret les sépare d'un
     simple point : l'entretien professionnel et le bilan de l'alternance, la
     professionnalisation et le compte personnel de formation. Ils sont
     séparés.

   Les deux opérations ne touchent qu'aux bornes : les morceaux se retrouvent
   mot pour mot dans le texte, et pas un caractère n'est perdu.            */
function recoller(infos) {
  const out = [];
  infos.forEach(function (i) {
    const t = String(i).trim();
    if (out.length && /^(et|ainsi que|ou)\s/.test(t)) out[out.length - 1] = out[out.length - 1] + " " + t;
    else out.push(t);
  });
  return out;
}

function separer(infos) {
  const out = [];
  infos.forEach(function (i) {
    const t = String(i).trim();
    /* On ne coupe qu'après un point suivi d'une majuscule, et seulement si les
       deux morceaux tiennent debout seuls. Le point d'une référence
       d'article, « L. 6315-1 », n'est jamais suivi d'une majuscule. */
    const m = t.match(/^(.{40,}?[^A-Z])\.\s+([A-ZÉÈÀ].{40,})$/);
    if (m) { out.push(m[1] + "."); out.push(m[2]); }
    else out.push(t);
  });
  return out;
}

function nettoyer(arbre) {
  let fini = false;
  (arbre.rubriques || []).forEach(function (r) {
    if (fini) r.commentaire = true;
    (r.sections || []).forEach(function (s) {
      if (fini) s.commentaire = true;
      (s.sujets || []).forEach(function (su) {
        if (fini) { su.commentaire = true; return; }
        /* La borne se cherche AVANT tout recollage : la ligne de nomenclature
           doit se retrouver telle quelle, et « et ouvriers. » qui la suit ne
           doit pas lui être recollé. */
        const brutes = (su.informations && su.informations.length) ? su.informations : [];
        const coupe = brutes.indexOf(FIN_DU_TABLEAU);
        if (su.informations && su.informations.length) {
          const gardees = coupe >= 0 ? brutes.slice(0, coupe) : brutes;
          const apres = coupe >= 0 ? brutes.slice(coupe) : [];
          su.informations = separer(recoller(gardees))
            /* La rubrique dont le titre revient en information ne dit rien :
               « Environnement (1) », en section et en information. */
            .filter(function (i) { return String(i).trim() !== String(r.titre).trim(); })
            .concat(apres);
        }
        /* CE QU'ON NE RECOLLE PAS, ET POURQUOI.

           Une relecture a vu une phrase coupée en deux : « c) Mesures
           envisagées [...] des méthodes de production et d'exploitation »
           d'un côté, « et incidences de ces mesures sur les conditions de
           travail » de l'autre. La coupure n'est pas la nôtre : le décret
           écrit un point-virgule entre les deux, « ...d'exploitation ; et
           incidences... ». Les recoller ferait un libellé qui ne se retrouve
           plus mot pour mot dans le texte, et c'est la garantie de ce module.
           Vérifié le 25 septembre 2026. */
        /* Un sujet qui n'a rien d'autre que le titre de sa rubrique ne
           demande rien : « Environnement (1) », en section comme en
           information. */
        /* Le titre de la rubrique revenu trois fois, en section, en sujet et en
           information : « Environnement (1) ». Le découpage a collé la
           première section au titre de la rubrique, d'où la comparaison sur le
           début. Ce n'est pas une donnée à porter. */
        if ((!su.informations || !su.informations.length) &&
            String(su.intitule).trim() === String(s.titre).trim() &&
            String(r.titre).indexOf(String(su.intitule).trim()) === 0) su.commentaire = true;
        const infos = (su.informations && su.informations.length) ? su.informations : [];
        if (coupe >= 0) {
          /* Ce qui suit dans ce sujet, et tout ce qui vient après dans l'arbre,
             est du commentaire du décret : la nomenclature des qualifications
             puis les notes de bas de page. Rien n'est supprimé, la couverture
             du texte reste entière et le mot pour mot aussi ; ces lignes sont
             seulement marquées, et les écrans comme les classeurs les passent.
             Relevé le 25 septembre 2026 : elles sortaient au client comme des
             informations à renseigner. */
          su.commentaireDepuis = su.informations.indexOf(FIN_DU_TABLEAU);
          fini = true;
        }
        /* Le premier indicateur, rendu à sa liste : « i) Effectif : Effectif
           total au 31/12 » gardait l'indicateur dans l'intitulé du sujet, donc
           sans ligne où le renseigner, et la colonne Sujet répétait la colonne
           Information. Les deux morceaux viennent du texte, le mot pour mot
           est intact. */
        const k = String(su.intitule).indexOf(" : ");
        if (k > 0 && !su.commentaire) {
          const tete = String(su.intitule).slice(0, k).trim();
          const queue = String(su.intitule).slice(k + 3).trim();
          const premiere = String(infos[0] || "").trim();
          /* L'intitulé n'est pas modifié : il doit rester tel que le décret
             l'écrit, pour la couverture du texte comme pour le mot pour mot.
             Ce sont deux repères qui sont posés à côté, et les écrans et les
             classeurs s'en servent pour afficher un sujet court et rendre au
             premier indicateur sa ligne. */
          if (queue && premiere && premiere.indexOf(queue) === 0) su.court = tete;
          else if (queue && infos.length && infos.indexOf(queue) < 0) {
            su.court = tete;
            su.premiere = queue;
          }
        }
      });
    });
  });
  return arbre;
}

/* Ce qu'un écran ou un classeur doit porter : tout, sauf le commentaire. */
/* CE QUI SE LIT D'UNE SEULE TRAITE, ET QUI EST ÉCRIT EN DEUX.

   Le décret sépare d'un point-virgule des morceaux qui n'ont pas de sens
   séparés : « ...aux congés pour enseignement accordés ; notamment leur
   objet, leur durée et leur coût ». Les données gardent les deux libellés,
   parce que la garantie du mot pour mot les cherche tels quels dans le texte ;
   l'affichage, lui, les remet ensemble. Relevé le 25 septembre 2026.        */
const SUITE = /^(notamment|et|ainsi que|ou)\s/;
/* LA NOTE DE BAS DE TABLEAU N'EST PAS UNE DONNÉE À PORTER.

   La dernière information du 10° de R. 2312-8 se termine sur le renvoi (1)
   du décret : « …pour les entreprises tenues d'établir ces différents
   bilans. Notes : (1) Lorsque les données et informations
   environnementales… ». Le texte ne marque pas la rupture autrement, et le
   découpage la lisait donc comme la suite de la phrase. Relevé le
   25 septembre 2026 : le client voyait la note dans la case à remplir. Les
   données gardent la phrase entière, l'affichage s'arrête à la note.      */
const NOTE_FINALE = /\s*Notes?\s*:\s*\(\d{1,2}\)[\s\S]*$/;
/* L'EXPOSANT QUE LE TEXTE SERVI A PERDU.

   Le taux de fréquence de R. 2312-9 s'écrit « × 10⁶ » ; le texte servi par le
   relais rend l'exposant à plat, « × 106 », et le classeur le recopiait tel
   quel. Une première tentative avait réécrit les données elles-mêmes : la
   garantie du mot pour mot, qui cherche chaque libellé dans le texte servi,
   ne le retrouvait plus. La réécriture est donc faite à l'affichage, là où
   rien n'est vérifié contre la source. Relevé le 25 septembre 2026.       */
const EXPOSANTS = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
function exposant(t) {
  return String(t).replace(/(×\s?10)(\d)\b/g, function (tout, dix, chiffre) {
    return EXPOSANTS[chiffre] ? dix + EXPOSANTS[chiffre] : tout;
  });
}

function informationsDues(su) {
  if (!su || su.commentaire) return [];
  let infos = (su.informations && su.informations.length) ? su.informations : [su.intitule];
  const fin = (su.commentaireDepuis === undefined) ? infos.length : su.commentaireDepuis;
  infos = infos.slice(0, fin);
  if (su.premiere) infos = [su.premiere].concat(infos);
  infos = infos.filter(function (i) { return /^[A-Za-zÀ-ÿ0-9]/.test(String(i).trim()); });
  const jointes = [];
  infos.forEach(function (i) {
    const t = exposant(String(i).trim().replace(NOTE_FINALE, ""));
    if (!t) return;
    /* La suite qui n'a rien devant elle se rattache à l'intitulé du sujet :
       le décret écrit « Mesures envisagées en ce qui concerne l'amélioration
       […] des méthodes de production et d'exploitation ; et incidences de ces
       mesures sur les conditions de travail et l'emploi ». Le premier membre
       est l'intitulé, le second était affiché seul, commençant par « et ». */
    if (!jointes.length && SUITE.test(t) && su.intitule && String(su.intitule).trim() !== t)
      jointes.push(String(su.intitule).trim() + " ; " + t);
    else if (jointes.length && SUITE.test(t)) jointes[jointes.length - 1] += " ; " + t;
    else jointes.push(t);
  });
  return jointes;
}

/* Le titre d'une rubrique, tel qu'il s'affiche. Le découpage a collé la
   première section au titre de la dixième : « Environnement (1) A-Politique
   générale en matière environnementale ». Les données le gardent, parce que
   c'est ainsi qu'il se retrouve dans le texte ; l'onglet et la première ligne
   du classeur n'en montrent que le titre. */
/* Le renvoi « (1) » qui suit « Environnement » est un appel de note du
   décret, pas une partie du titre : il s'en va aussi. */
function titreRubrique(r) {
  return String((r && r.titre) || "").replace(/\s+[A-Z]-.*$/, "")
    .replace(/\s*\(\d{1,2}\)\s*$/, "").trim();
}

/* L'intitulé d'un sujet, tel qu'il s'affiche : sans le premier indicateur
   qui lui était collé. */
function intituleDu(su) {
  return String((su && (su.court || su.intitule)) || "").replace(NOTE_FINALE, "").trim();
}

/* LE NOM D'UN ONGLET DIT CE QU'IL Y A DEDANS.

   Le 9° s'appelle « Pour les entreprises appartenant à un groupe, transferts
   commerciaux et financiers entre les entités du groupe » : ramené à trente et
   un caractères, cela donnait l'onglet « 9 Pour les entreprises », qui ne dit
   rien. La condition est retirée pour le seul nom de l'onglet, jamais du titre
   porté en tête de la feuille. Relevé le 25 septembre 2026. */
function titreOnglet(r) {
  const t = titreRubrique(r).replace(/^Pour les entreprises[^,]*,\s*/i, "");
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : titreRubrique(r);
}

/* CE QUE LE DÉCRET LUI-MÊME SOUMET À UNE CONDITION.

   Deux rubriques de R. 2312-8 ne valent pas pour toutes les entreprises, et
   le tableau le dit dans son propre libellé : « Pour les entreprises soumises
   aux dispositions de l'article L. 225-115 du code de commerce… » (4° A b) et
   « Pour les entreprises appartenant à un groupe… » (9°). Une relecture du
   25 septembre 2026 a relevé qu'elles étaient demandées à une SARL comme le
   reste, sans rien qui dise qu'elles ne la concernent pas.

   Ce qui a été lu à la source ce jour-là, dans le code de commerce :
     - L. 225-115 (LEGIARTI000038610196) ouvre à « tout actionnaire » le droit
       d'obtenir communication, notamment, du « montant global, certifié exact
       par les commissaires aux comptes, s'il en existe, des rémunérations
       versées aux personnes les mieux rémunérées » (4°). Il est dans le
       chapitre des sociétés anonymes ;
     - L. 226-1 (LEGIARTI000047591354) applique à la société en commandite par
       actions les règles de la société anonyme, sauf les articles L. 225-17 à
       L. 225-93 : L. 225-115 en fait donc partie ;
     - L. 227-1 (LEGIARTI000048535177) applique à la société par actions
       simplifiée les règles de la société anonyme « à l'exception […] des
       articles L. 225-17 à L. 225-102, L. 225-103 à L. 225-126 » : L. 225-115
       est écarté pour la SAS ;
     - L. 223-26 (LEGIARTI000048535091) régit la communication aux associés de
       la SARL et ne renvoie pas à L. 225-115.

   La règle, et sa limite : on n'écarte que sur ce que la fiche d'entreprise
   dit. Forme non renseignée, forme inconnue, groupe répondu « en cours » : la
   ligne reste due, et rien n'est écrit à la place de l'employeur. La raison,
   quand il y en a une, se porte dans la colonne de R. 2312-10.            */
const PAR_ACTIONS_115 = /^(sca\b|société en commandite par actions|societe en commandite par actions|commandite par actions|sa\b|société anonyme|societe anonyme)/;
const HORS_115 = /^(sasu?\b|société par actions simplifiée|societe par actions simplifiee|sarl\b|eurl\b|snc\b|société civile|societe civile|sci\b|association|entreprise individuelle|ei\b|micro)/;

function soumise225115(forme) {
  const f = String(forme || "").trim().toLowerCase();
  if (!f) return null;
  if (HORS_115.test(f)) return false;
  if (PAR_ACTIONS_115.test(f)) return true;
  return null;
}

/* Rend la raison pour laquelle une ligne ne concerne pas l'entreprise, ou
   null. `texte` est ce que la ligne porte, titre de rubrique compris ; la
   condition est dans le libellé du décret, pas dans un catalogue tenu à
   part. */
function sansObjet(texte, fiche) {
  const t = String(texte || "");
  const f = fiche || {};
  if (/L\.?\s*225-115/.test(t)) {
    const due = soumise225115(f.formeJuridique);
    if (due === false)
      return "Non applicable : le montant global des plus hautes rémunérations n'est dû que "
        + "par les entreprises soumises à L. 225-115 du code de commerce, c'est-à-dire les "
        + "sociétés anonymes et, par renvoi de L. 226-1, les sociétés en commandite par actions. "
        + "La fiche d'entreprise porte « " + String(f.formeJuridique).trim() + " ».";
  }
  if (/[Pp]our les entreprises appartenant à un groupe/.test(t)) {
    if (String(f.groupe || "").trim().toLowerCase() === "non")
      return "Non applicable : la rubrique ne vise que les entreprises appartenant à un groupe, "
        + "et la fiche d'entreprise répond « non ».";
  }
  return null;
}

/* L'INDEX DE L'ÉGALITÉ, QUE LE TABLEAU DU DÉCRET NE PORTE PAS.

   R. 2312-7 (LEGIARTI000047548416, lu le 25 septembre 2026) : la base
   « comporte également les indicateurs relatifs aux écarts de rémunération
   entre les femmes et les hommes et aux actions mises en œuvre pour les
   supprimer mentionnés à l'article L. 1142-8 ». Ils ne sont ni dans le
   tableau de R. 2312-8 ni dans celui de R. 2312-9 : ils s'y ajoutent, et la
   base les ignorait. L. 1142-8 vise les entreprises d'au moins cinquante
   salariés, donc les deux régimes. Les composantes de l'index sont fixées
   par décret et ne sont pas recopiées ici.                                */
const INDEX_EGALITE = {
  lettre: "", hors: "R. 2312-7", titre: "Index de l'égalité professionnelle (R. 2312-7)",
  sujets: [{
    lettre: "", intitule: "Indicateurs publiés au titre de L. 1142-8",
    informations: [
      "Indicateurs relatifs aux écarts de rémunération entre les femmes et les hommes et aux actions mises en œuvre pour les supprimer, tels que publiés chaque année (L. 1142-8)",
      "Note globale obtenue, et date de la publication sur le site du ministère chargé du travail",
      "Mesures de correction et, le cas échéant, programmation de mesures financières de rattrapage salarial lorsque les résultats sont en deçà du niveau fixé par décret (L. 1142-9)",
      "Objectifs de progression de chacun des indicateurs, fixés et publiés lorsque les résultats sont en deçà du niveau défini par décret (L. 1142-9-1)",
      "Délai de trois ans pour se mettre en conformité, et son échéance (L. 1142-10)",
    ],
  }],
};

function poserIndexEgalite(arbre) {
  const r = (arbre.rubriques || []).find(function (x) {
    return /[ÉEe]galit[ée] professionnelle/i.test(String(x.titre));
  });
  if (!r) return arbre;
  if ((r.sections || []).some(function (s) { return s.titre === INDEX_EGALITE.titre; })) return arbre;
  r.sections = (r.sections || []).concat([JSON.parse(JSON.stringify(INDEX_EGALITE))]);
  return arbre;
}

function construire() {
  const out = {};
  for (const [cle, art, seuil] of [["moins300", "R2312-8", "moins de trois cents salariés"],
                                   ["au moins300", "R2312-9", "au moins trois cents salariés"]]) {
    const brut = texte(art);
    const rubriques = decouper(brut);
    rubriques.forEach(r => { const p = auPlancher(r.n);
      r.plancher = p.length > 0; r.themesPlancher = p; });
    poserIndexEgalite(nettoyer({ rubriques }));
    out[cle] = { article: art, version: T[art].id, seuil, rubriques,
      couverture: couverture(brut, rubriques), infidelites: fidelite(brut, rubriques) };
  }
  /* Le renvoi de R. 2312-9 exécuté : les sujets e) et f) du 1° A de R. 2312-8 —
     la formation professionnelle et les conditions de travail — sont ajoutés au
     régime des entreprises d'au moins trois cents salariés, en portant la marque
     de leur origine. Les citer sans les importer aurait laissé un trou de deux
     sujets dans le contenu du régime le plus exigeant.

     Les quatre alinéas i) à iv) viennent avec f) : la phrase du programme
     annuel de prévention se termine sur « afin de satisfaire, notamment : »,
     et ce qu'elle annonce est écrit dans ces quatre sujets-là. Importer f)
     sans eux laissait la phrase en suspens dans le classeur d'au moins trois
     cents salariés. Relevé le 25 septembre 2026. */
  const source = out["moins300"].rubriques.find(r => r.n === 1);
  const cible = out["au moins300"].rubriques.find(r => r.n === 1);
  if (source && cible) {
    const sA = source.sections.find(s => s.lettre === "A");
    const cA = cible.sections.find(s => s.lettre === "A") || cible.sections[0];
    if (sA && cA) for (const lettre of ["e", "f", "i", "ii", "iii", "iv"]) {
      const su = sA.sujets.find(x => x.lettre === lettre);
      if (su && !cA.sujets.some(x => x.intitule === su.intitule))
        cA.sujets.push({ ...su, renvoi: "R. 2312-8, 1° A " + lettre + ")" });
    }
    out["au moins300"].renvois = ["R. 2312-8, 1° A e) — formation professionnelle",
                                  "R. 2312-8, 1° A f) — conditions de travail, avec ses alinéas i) à iv)"];
  }

  return { plancher: PLANCHER, planchierTexte: "L. 2312-21, al. 3",
    planchierVersion: T["L2312-21"].id, contenu: out };
}

module.exports = { construire, decouper, PLANCHER, auPlancher };

if (require.main === module) {
  const b = construire();
  console.log(`plancher de L. 2312-21, al. 3 — ${b.plancher.length} thèmes énumérés :`);
  b.plancher.forEach(t => console.log("   · " + t));
  let ko = 0;
  for (const [cle, d] of Object.entries(b.contenu)) {
    const info = d.rubriques.reduce((n, r) => n + r.sections.reduce((m, s) =>
      m + s.sujets.reduce((k, su) => k + 1 + su.informations.length, 0), 0), 0);
    const hors = d.rubriques.filter(r => !r.plancher).map(r => r.n + "° " + r.titre.slice(0, 40));
    console.log(`\n${d.article} — ${d.seuil} — version ${d.version}`);
    console.log(`  ${d.rubriques.length} rubriques · ${info} informations · couverture ${d.couverture.part} % du texte`);
    console.log(`  hors du plancher, donc supprimables par accord : ${hors.join(" ; ") || "aucune"}`);
    if (d.infidelites.length) { ko += d.infidelites.length;
      console.log(`  ÉCHEC — ${d.infidelites.length} libellé(s) ne se retrouvent pas mot pour mot dans le texte :`);
      d.infidelites.slice(0, 5).forEach(x => console.log("      " + x)); }
  }
  /* Le seuil de publication. Une couverture inférieure à cent pour cent ne dit
     pas que la BDESE est incomplète : elle dit que le découpage ne rend pas
     tout le texte, et qu'il faut le regarder avant de publier. La règle est de
     gouvernance, non de droit — elle est écrite ici pour ne pas être décidée au
     cas par cas, et ce qui reste hors du découpage est nommé, jamais toléré en
     silence. */
  /* Le critère de sortie est cent pour cent, et il bloque. Tout intervalle du
     texte doit être, soit extrait comme contenu, soit reconnu comme structure —
     marqueur, numérotation, séparateur. Le moindre caractère qui n'est ni l'un
     ni l'autre est un reliquat : il est affiché, et la publication échoue. */
  const bas = Object.values(b.contenu).filter(d => d.couverture.reliquat > 0);
  if (bas.length) {
    console.log("\nÉCHEC — le découpage laisse du texte de côté :");
    for (const d of bas) {
      console.log(`  ${d.article} : ${d.couverture.part} % · ${d.couverture.reliquat} caractère(s) hors du découpage`);
      d.couverture.fragments.forEach(f => console.log(`      · ${JSON.stringify(f.slice(0, 120))}`));
      ko++;
    }
  } else {
    for (const d of Object.values(b.contenu))
      console.log(`  ${d.article} : 100 % — ${d.couverture.couverts} caractères, dont ${d.couverture.structure} de structure (marqueurs, numérotations, séparateurs). Reliquat : aucun.`);
  }
  if (b.contenu["au moins300"].renvois)
    console.log("\nrenvois exécutés vers R. 2312-8 : " + b.contenu["au moins300"].renvois.join(" · "));
  fs.writeFileSync(__dirname + "/_bdese.json", JSON.stringify(b, null, 1));
  console.log("\n_bdese.json écrit.");
  if (ko) process.exit(1);
}
module.exports.informationsDues = informationsDues;
module.exports.intituleDu = intituleDu;
module.exports.titreRubrique = titreRubrique;
module.exports.titreOnglet = titreOnglet;
module.exports.sansObjet = sansObjet;
module.exports.soumise225115 = soumise225115;
