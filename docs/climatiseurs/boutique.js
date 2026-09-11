/* MP Climatisation - fonctions communes a toutes les pages :
   panier, visuels, mises en forme, petits comportements d'interface. */

(function () {
  'use strict';

  var CLE = 'mp-clim-panier';
  var LIVRAISON = 39;
  var FRANCO = 500;

  /* ---------- outils ---------- */

  function euros(n) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency', currency: 'EUR',
      minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2
    }).format(n);
  }

  function produit(ref) {
    for (var i = 0; i < window.PRODUITS.length; i++) {
      if (window.PRODUITS[i].ref === ref) return window.PRODUITS[i];
    }
    return null;
  }

  function etoiles(note) {
    var pleines = Math.round(note);
    return '★'.repeat(pleines) + '☆'.repeat(5 - pleines);
  }

  function typeLisible(t) {
    return { monosplit: 'Monosplit mural', multisplit: 'Multisplit', console: 'Console au sol',
      gainable: 'Gainable et cassette', mobile: 'Climatiseur mobile', accessoire: 'Accessoire' }[t] || t;
  }

  /* Consommation annuelle estimee, methode de l'etiquette energie :
     350 heures de froid, 1 400 heures de chaud en climat moyen. */
  function conso(p) {
    var prixKwh = 0.25, froid = 0, chaud = 0;
    if (p.seer) froid = p.froid * 350 / p.seer;
    else if (p.eer) froid = p.froid * 350 / p.eer;
    if (p.scop) chaud = p.chaud * 1400 / p.scop;
    return { froid: Math.round(froid), chaud: Math.round(chaud),
      total: Math.round(froid + chaud), cout: Math.round((froid + chaud) * prixKwh) };
  }

  /* ---------- visuels ---------- */

  function visuel(p) {
    var c = p.couleur || '#e2e8f0';
    var sombre = c === '#1f2937';
    var trait = sombre ? '#334155' : '#c8d4e2';
    var detail = sombre ? '#64748b' : '#94a3b8';
    var corps = '';

    if (p.type === 'monosplit' || p.type === 'multisplit') {
      var unites = p.type === 'multisplit' ? 2 : 1;
      if (unites === 1) {
        corps =
          '<rect x="74" y="96" width="252" height="74" rx="16" fill="' + c + '" stroke="' + trait + '"/>' +
          '<rect x="74" y="96" width="252" height="26" rx="16" fill="#ffffff" opacity="' + (sombre ? '.08' : '.55') + '"/>' +
          '<rect x="96" y="150" width="208" height="11" rx="5.5" fill="' + detail + '" opacity=".55"/>' +
          '<circle cx="298" cy="137" r="4" fill="#22c55e"/>';
      } else {
        corps =
          '<rect x="46" y="100" width="150" height="58" rx="13" fill="' + c + '" stroke="' + trait + '"/>' +
          '<rect x="62" y="140" width="118" height="9" rx="4.5" fill="' + detail + '" opacity=".55"/>' +
          '<rect x="212" y="100" width="150" height="58" rx="13" fill="' + c + '" stroke="' + trait + '"/>' +
          '<rect x="228" y="140" width="118" height="9" rx="4.5" fill="' + detail + '" opacity=".55"/>';
      }
      corps +=
        '<g opacity=".6" stroke="#0b6bb5" stroke-width="3" fill="none" stroke-linecap="round">' +
        '<path d="M120 196 q30 22 62 0"/><path d="M176 208 q30 22 62 0"/><path d="M232 196 q30 22 62 0"/></g>';
    } else if (p.type === 'console') {
      corps =
        '<rect x="88" y="150" width="224" height="86" rx="12" fill="' + c + '" stroke="' + trait + '"/>' +
        '<rect x="88" y="150" width="224" height="14" rx="7" fill="' + detail + '" opacity=".45"/>' +
        '<rect x="106" y="216" width="188" height="10" rx="5" fill="' + detail + '" opacity=".55"/>' +
        '<g opacity=".55" stroke="#0b6bb5" stroke-width="3" fill="none" stroke-linecap="round">' +
        '<path d="M150 138 q26 -22 52 0"/><path d="M208 138 q26 -22 52 0"/></g>';
    } else if (p.type === 'gainable') {
      corps =
        '<rect x="60" y="70" width="280" height="16" rx="4" fill="#e2e8f0"/>' +
        '<rect x="112" y="86" width="176" height="62" rx="8" fill="' + c + '" stroke="' + trait + '"/>' +
        '<rect x="126" y="148" width="60" height="10" rx="4" fill="' + detail + '" opacity=".6"/>' +
        '<rect x="214" y="148" width="60" height="10" rx="4" fill="' + detail + '" opacity=".6"/>' +
        '<g opacity=".5" stroke="#0b6bb5" stroke-width="3" fill="none" stroke-linecap="round">' +
        '<path d="M140 176 v26"/><path d="M156 176 v26"/><path d="M228 176 v26"/><path d="M244 176 v26"/></g>';
    } else if (p.type === 'mobile') {
      corps =
        '<rect x="126" y="72" width="118" height="166" rx="16" fill="' + c + '" stroke="' + trait + '"/>' +
        '<rect x="142" y="92" width="86" height="30" rx="7" fill="#0f172a" opacity=".82"/>' +
        '<text x="185" y="112" text-anchor="middle" font-family="monospace" font-size="15" fill="#7dd3fc">21°</text>' +
        '<rect x="142" y="140" width="86" height="70" rx="8" fill="' + detail + '" opacity=".35"/>' +
        '<circle cx="150" cy="244" r="7" fill="#64748b"/><circle cx="220" cy="244" r="7" fill="#64748b"/>' +
        '<path d="M244 118 q52 0 52 -38 v-16" stroke="' + detail + '" stroke-width="13" fill="none" stroke-linecap="round" opacity=".7"/>' +
        '<rect x="278" y="40" width="40" height="34" rx="4" fill="#dbeafe" stroke="' + trait + '"/>';
    } else if (p.ref === 'kit-pose-4m') {
      corps =
        '<circle cx="200" cy="158" r="66" fill="none" stroke="' + detail + '" stroke-width="18" opacity=".55"/>' +
        '<circle cx="200" cy="158" r="42" fill="none" stroke="' + detail + '" stroke-width="16" opacity=".8"/>' +
        '<rect x="176" y="82" width="48" height="16" rx="8" fill="#0b6bb5" opacity=".65"/>';
    } else if (p.ref === 'support-mural') {
      corps =
        '<rect x="104" y="92" width="16" height="140" rx="4" fill="' + detail + '"/>' +
        '<rect x="104" y="112" width="180" height="15" rx="4" fill="' + detail + '"/>' +
        '<rect x="104" y="196" width="180" height="15" rx="4" fill="' + detail + '"/>' +
        '<path d="M118 196 L272 127" stroke="' + detail + '" stroke-width="11" opacity=".6"/>' +
        '<circle cx="272" cy="120" r="9" fill="#0b6bb5" opacity=".6"/><circle cx="272" cy="204" r="9" fill="#0b6bb5" opacity=".6"/>';
    } else {
      corps =
        '<rect x="92" y="98" width="216" height="126" rx="10" fill="' + c + '" stroke="' + trait + '"/>' +
        '<g stroke="' + detail + '" stroke-width="8" stroke-linecap="round" opacity=".65">' +
        '<path d="M112 124 h176"/><path d="M112 152 h176"/><path d="M112 180 h176"/><path d="M112 206 h176"/></g>';
    }

    return '<svg viewBox="0 0 400 300" role="img" aria-label="' + (p.marque + ' ' + p.nom).replace(/"/g, '') + '">' +
      '<defs><linearGradient id="g' + p.ref + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#f8fbff"/><stop offset="1" stop-color="#e7eef7"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#g' + p.ref + ')"/>' +
      '<line x1="0" y1="262" x2="400" y2="262" stroke="#d7e0ea" stroke-width="2"/>' +
      corps + '</svg>';
  }

  /* ---------- panier ---------- */

  function lire() {
    try { return JSON.parse(localStorage.getItem(CLE)) || []; } catch (e) { return []; }
  }

  function ecrire(lignes) {
    try { localStorage.setItem(CLE, JSON.stringify(lignes)); } catch (e) { /* navigation privee */ }
    compteur();
    document.dispatchEvent(new CustomEvent('panier-change'));
  }

  function ajouter(ref, qte, pose) {
    var lignes = lire(), trouve = false;
    for (var i = 0; i < lignes.length; i++) {
      if (lignes[i].ref === ref && !!lignes[i].pose === !!pose) { lignes[i].qte += qte; trouve = true; }
    }
    if (!trouve) lignes.push({ ref: ref, qte: qte, pose: !!pose });
    ecrire(lignes);
  }

  function totaux() {
    var lignes = lire(), sousTotal = 0, poses = 0, articles = 0;
    lignes.forEach(function (l) {
      var p = produit(l.ref);
      if (!p) return;
      sousTotal += p.prix * l.qte;
      articles += l.qte;
      if (l.pose && window.POSES[p.type]) poses += window.POSES[p.type].prix * l.qte;
    });
    var livraison = articles === 0 || sousTotal >= FRANCO ? 0 : LIVRAISON;
    return { sousTotal: sousTotal, pose: poses, livraison: livraison,
      total: sousTotal + poses + livraison, articles: articles, franco: FRANCO };
  }

  function compteur() {
    var n = totaux().articles;
    document.querySelectorAll('[data-panier-compte]').forEach(function (el) {
      el.textContent = n;
      el.style.display = n ? '' : 'none';
    });
  }

  /* ---------- interface ---------- */

  function message(texte) {
    var t = document.querySelector('.toast');
    if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = texte;
    requestAnimationFrame(function () { t.classList.add('visible'); });
    clearTimeout(t.minuteur);
    t.minuteur = setTimeout(function () { t.classList.remove('visible'); }, 2600);
  }

  function carte(p) {
    var etiq = '';
    if (p.prixBarre) etiq = '<span class="etiquette promo">-' + Math.round((1 - p.prix / p.prixBarre) * 100) + ' %</span>';
    else if (p.classeFroid === 'A+++' && p.classeChaud === 'A+++') etiq = '<span class="etiquette eco">Double A+++</span>';
    else if (p.stock === 'Sur commande') etiq = '<span class="etiquette">Sur commande</span>';

    var specs = '';
    if (p.type === 'accessoire') {
      specs = '<span class="puce">Accessoire</span>';
    } else if (p.type === 'mobile') {
      specs = '<span class="puce">' + p.froid.toString().replace('.', ',') + ' kW froid</span>' +
        '<span class="puce">' + p.surfaceMin + ' a ' + p.surfaceMax + ' m²</span>' +
        '<span class="puce">Sans travaux</span>';
    } else {
      specs = '<span class="puce">' + p.froid.toString().replace('.', ',') + ' kW</span>' +
        '<span class="puce">' + p.surfaceMin + ' a ' + p.surfaceMax + ' m²</span>' +
        '<span class="puce vert">' + p.classeFroid + ' / ' + p.classeChaud + '</span>' +
        (p.wifi ? '<span class="puce">Wifi</span>' : '');
    }

    return '<article class="carte">' +
      '<a class="carte-visuel" href="produit.html?ref=' + p.ref + '" aria-label="' + p.nom + '">' + visuel(p) + etiq + '</a>' +
      '<div class="carte-corps">' +
      '<div class="carte-marque">' + p.marque + '</div>' +
      '<h3 class="carte-nom"><a href="produit.html?ref=' + p.ref + '">' + p.nom + '</a></h3>' +
      '<div class="note"><span class="etoiles">' + etoiles(p.note) + '</span> ' + p.note.toString().replace('.', ',') + ' (' + p.avis + ')</div>' +
      '<div class="carte-specs">' + specs + '</div>' +
      '<div class="carte-pied"><div><div class="prix">' + euros(p.prix) +
      (p.prixBarre ? '<span class="prix-barre">' + euros(p.prixBarre) + '</span>' : '') + '</div>' +
      '<div class="prix-note">TTC, ' + (p.stock === 'En stock' ? 'expedie sous 48 h' : p.stock.toLowerCase()) + '</div></div>' +
      '<a class="btn btn-plein" href="produit.html?ref=' + p.ref + '">Voir</a></div>' +
      '</div></article>';
  }

  function entete() {
    var b = document.querySelector('.burger');
    if (b) b.addEventListener('click', function () {
      document.querySelector('.menu-mobile').classList.toggle('ouvert');
    });
    compteur();
  }

  document.addEventListener('DOMContentLoaded', entete);

  window.MP = { euros: euros, produit: produit, etoiles: etoiles, typeLisible: typeLisible,
    conso: conso, visuel: visuel, carte: carte, lire: lire, ecrire: ecrire, ajouter: ajouter,
    totaux: totaux, compteur: compteur, message: message, FRANCO: FRANCO, LIVRAISON: LIVRAISON };
})();
