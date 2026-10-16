/* EXPORTER MON DOSSIER, POUR LE SITE DU CLIENT.

   Tous les documents gardés sur ce poste, plus la fiche d'entreprise, le
   registre, la flotte et le forfait, sont rassemblés dans UN seul fichier
   chiffré, « dossier-tec.js ». Ce fichier a exactement la forme que la porte
   du site client (entrer.js) sait relire : on le dépose là-bas et le client
   retrouve, en entrant son mot de passe, tout ce qu'il y a ici.

   Rien ne part sur le réseau : la lecture des documents, la mise en forme et
   le chiffrement se font dans le navigateur. Le mot de passe est demandé au
   moment de l'export et n'est écrit nulle part ; ce doit être celui que le
   client tape pour ouvrir son application.

   Le format est celui d'entrer.js : AES-256-GCM, clé dérivée du mot de passe
   par PBKDF2-SHA256 en six cent mille tours, sel et vecteur tirés au hasard.
   Le clair est un objet JSON { profil-entreprise, registre-personnel,
   flotte-vehicules, flotte-conducteurs, forfait-jours, documents:[{nom, sorte,
   type, note, rubrique, b64}] }. */
(function (window, document) {
  "use strict";

  var CLES = ["profil-entreprise", "registre-personnel", "flotte-vehicules",
    "flotte-conducteurs", "forfait-jours"];
  var TOURS = 600000;

  function b64DeOctets(octets) {
    var bin = "", chunk = 0x8000, i;
    for (i = 0; i < octets.length; i += chunk) {
      bin += String.fromCharCode.apply(null, octets.subarray(i, i + chunk));
    }
    return window.btoa(bin);
  }

  function blobEnOctets(blob) {
    if (blob.arrayBuffer) {
      return blob.arrayBuffer().then(function (buf) { return new Uint8Array(buf); });
    }
    return new Promise(function (ok, non) {
      var fr = new FileReader();
      fr.onload = function () { ok(new Uint8Array(fr.result)); };
      fr.onerror = function () { non(fr.error); };
      fr.readAsArrayBuffer(blob);
    });
  }

  /* Le contenu d'une pièce est soit un Blob (un fichier), soit une chaîne (un
     texte). Dans les deux cas on en fait des octets, puis du base64 : la porte
     du client les rendra tels quels, sans rien convertir. */
  function contenuEnB64(c) {
    if (c && typeof c.size === "number" && typeof c.arrayBuffer !== "undefined") {
      return blobEnOctets(c).then(b64DeOctets);
    }
    if (c && typeof c.size === "number") {               /* Blob sans arrayBuffer */
      return blobEnOctets(c).then(b64DeOctets);
    }
    var enc = new TextEncoder();
    return Promise.resolve(b64DeOctets(enc.encode(String(c == null ? "" : c))));
  }

  function lireCles() {
    var out = {};
    CLES.forEach(function (c) {
      var brut = null;
      try { brut = window.localStorage.getItem(c); } catch (e) { brut = null; }
      if (brut == null) return;
      try { out[c] = JSON.parse(brut); } catch (e) { out[c] = brut; }
    });
    return out;
  }

  function rassemblerPieces(etat) {
    var D = window.Documents;
    if (!D || !D.disponible || !D.disponible()) return Promise.resolve([]);
    return D.rubriques().then(function (rubs) {
      var pieces = [];
      return (rubs || []).reduce(function (avant, rub) {
        return avant.then(function () {
          return D.liste(rub).then(function (items) {
            return (items || []).reduce(function (av2, it) {
              return av2.then(function () {
                return D.lire(it.id).then(function (plein) {
                  if (!plein) return null;
                  return contenuEnB64(plein.contenu).then(function (b64) {
                    pieces.push({
                      nom: plein.nom, sorte: plein.sorte, type: plein.type || "",
                      note: plein.note || "", rubrique: plein.rubrique || rub, b64: b64,
                    });
                    if (etat) etat(pieces.length);
                  });
                });
              });
            }, Promise.resolve());
          });
        });
      }, Promise.resolve()).then(function () { return pieces; });
    });
  }

  function chiffrer(clairTexte, mot) {
    var enc = new TextEncoder();
    var sel = window.crypto.getRandomValues(new Uint8Array(16));
    var iv = window.crypto.getRandomValues(new Uint8Array(12));
    return window.crypto.subtle
      .importKey("raw", enc.encode(mot), { name: "PBKDF2" }, false, ["deriveKey"])
      .then(function (base) {
        return window.crypto.subtle.deriveKey(
          { name: "PBKDF2", salt: sel, iterations: TOURS, hash: "SHA-256" },
          base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
      })
      .then(function (k) {
        return window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, k, enc.encode(clairTexte));
      })
      .then(function (ct) {
        return {
          format: "dossier-chiffre", version: 1, algorithme: "AES-256-GCM",
          derivation: "PBKDF2-SHA256", tours: TOURS,
          sel: b64DeOctets(sel), vecteur: b64DeOctets(iv),
          contenu: b64DeOctets(new Uint8Array(ct)),
        };
      });
  }

  /* LE FICHIER SORT EN .txt, JAMAIS EN .js.

     Sur iPhone, un téléchargement « .js » était happé par une application
     (Pages), qui le réécrivait et cassait le dossier. Un « .txt » reste un
     texte que le téléphone ne transforme pas ; il est rechargé tel quel côté
     client, le nom n'a aucune importance pour la lecture. */
  function texteDe(obj) {
    return "/* Le dossier de la SARL TEC, chiffré. Illisible sans le mot de passe. */\n" +
      "window.DOSSIER_CHIFFRE = " + JSON.stringify(obj) + ";\n";
  }

  function telechargerFichier(txt) {
    var blob = new Blob([txt], { type: "text/plain" });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "dossier-tec.txt";
    a.setAttribute("data-sans-base", "1");   /* un fichier qui SORT ne rentre pas dans la base */
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.setTimeout(function () { window.URL.revokeObjectURL(url); }, 2000);
  }

  /* L'ENVOI SE FAIT SUR UN SECOND GESTE.

     Le partage natif d'iOS (le menu « Envoyer ») exige d'être appelé dans le
     geste même de l'utilisateur. Or le chiffrement prend une seconde : le
     geste du premier bouton est déjà « consommé » quand il finit, et iOS
     refuse alors de partager. On prépare donc le fichier au premier bouton,
     puis un second bouton, touché à son tour, ouvre le menu d'envoi (ou, à
     défaut de partage, télécharge le .txt). */
  function livrer(txt, etat) {
    var fichier = null;
    try { fichier = new File([txt], "dossier-tec.txt", { type: "text/plain" }); } catch (e) { fichier = null; }
    if (fichier && navigator.share && navigator.canShare && navigator.canShare({ files: [fichier] })) {
      navigator.share({ files: [fichier], title: "Dossier TEC" })
        .then(function () { etat("Fichier envoyé. Transmettez-le pour mettre à jour le dossier du client."); })
        .catch(function () { telechargerFichier(txt); etat("Fichier dossier-tec.txt enregistré. Dans Fichiers, envoyez-le sans l'ouvrir dans une autre application."); });
    } else {
      telechargerFichier(txt);
      etat("Fichier dossier-tec.txt enregistré. Dans Fichiers → Téléchargements, envoyez-le sans l'ouvrir dans Pages.");
    }
  }

  function exporter(bouton, etat, pret) {
    if (!window.crypto || !window.crypto.subtle) {
      etat("Ce navigateur ne sait pas chiffrer le dossier.", true);
      return;
    }
    var mot = window.prompt(
      "Mot de passe pour ouvrir le dossier chez le client.\n\n" +
      "Tapez le mot de passe que le client utilise pour entrer dans son application. " +
      "C'est avec lui qu'il pourra ouvrir le fichier.");
    if (mot == null) return;              /* annulé */
    mot = String(mot).trim();
    if (!mot) { etat("Aucun mot de passe : export annulé.", true); return; }

    bouton.disabled = true;
    etat("Lecture des documents...");
    var cles = lireCles();
    rassemblerPieces(function (n) { etat("Lecture des documents... " + n); })
      .then(function (pieces) {
        var clair = {};
        Object.keys(cles).forEach(function (k) { clair[k] = cles[k]; });
        clair.documents = pieces;
        etat("Chiffrement de " + pieces.length + " document" + (pieces.length > 1 ? "s" : "") + "...");
        return chiffrer(JSON.stringify(clair), mot).then(function (obj) {
          pret(texteDe(obj), pieces.length);
        });
      })
      .catch(function (e) {
        etat("L'export a échoué : " + (e && e.message ? e.message : "erreur inconnue") + ".", true);
      })
      .then(function () { bouton.disabled = false; });
  }

  function demarrer() {
    var bouton = document.getElementById("exporter-dossier");
    if (!bouton) return;
    var zone = document.getElementById("exporter-etat");
    var envoyer = document.getElementById("exporter-partager");
    function etat(msg, erreur) {
      if (!zone) return;
      zone.textContent = msg;
      zone.className = "exp-etat" + (erreur ? " exp-err" : "");
    }
    /* Le fichier préparé, en attente du second geste qui l'envoie. */
    var txtPret = null;
    function pret(txt, n) {
      txtPret = txt;
      etat("Prêt : " + n + " document" + (n > 1 ? "s" : "") + ". Touchez « Envoyer le fichier ».");
      if (envoyer) { envoyer.hidden = false; envoyer.disabled = false; }
    }
    bouton.addEventListener("click", function () { exporter(bouton, etat, pret); });
    if (envoyer) {
      envoyer.addEventListener("click", function () {
        if (!txtPret) { etat("Préparez d'abord l'export.", true); return; }
        livrer(txtPret, etat);
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", demarrer);
  } else {
    demarrer();
  }
})(window, document);
