/* L'épreuve navigateur du parcours client — Playwright, Chromium, bureau et
   téléphone (390 x 844).

   CE QU'ELLE VÉRIFIE, et pourquoi c'est ici plutôt que dans une note :

   - le parcours est joué DE BOUT EN BOUT, de l'étape 1 à l'étape 6, avec un
     profil de test : fiche client, questionnaire de l'existant, rapport
     général, guide de régularisation, régularisation d'un élément (modèle
     complet ouvert, parcours guidé ouvert, document ouvert pré-rempli),
     vérification finale qui reprend ce qui vient d'être régularisé ;

   - toute réponse fermée offre QUATRE valeurs — oui, non, en cours, autre — sur
     les six pages qui en portent, et « en cours » ne conclut jamais : il est
     rangé en nuance, signalé à l'écran, et le rapport dit ce sur quoi il ne
     s'est pas prononcé ;

   - la progression survit à la fermeture de la page ;

   - les huit audits détaillés tournent encore de bout en bout sur leur dossier
     d'exemple ;

   - ZÉRO erreur de console, zéro erreur de page, zéro requête échouée de même
     origine — sur les deux tailles d'écran.

   Usage, depuis la racine du dépôt :
     (cd docs && python3 -m http.server 8765 &)
     node moteur/commun/epreuve-navigateur.js

   Chemins de l'environnement de développement du dépôt :
     chromium   /opt/pw-browsers/chromium-1194/chrome-linux/chrome
     playwright /opt/node22/lib/node_modules/playwright                      */
const { chromium } = require("/opt/node22/lib/node_modules/playwright");

const BASE = "http://127.0.0.1:8765";
function CSS_escape(s) { return String(s).replace(/([^\w-])/g, "\\$1"); }
const ERREURS = [];
const PAS = [];
function ok(t) { PAS.push("  ok   " + t); }
function ko(t) { PAS.push("  KO   " + t); ERREURS.push(t); }

function brancher(page, nom) {
  page.on("console", m => {
    if (m.type() === "error" || m.type() === "warning") {
      const t = m.text();
      if (/favicon|Manifest|service worker|sw\.js/i.test(t)) return;
      ERREURS.push(`[console ${m.type()} · ${nom}] ${t}`);
    }
  });
  page.on("pageerror", e => ERREURS.push(`[pageerror · ${nom}] ${e.message}`));
  page.on("requestfailed", r => {
    const u = r.url();
    if (/api\.anthropic|judilibre|netlify|favicon/i.test(u)) return;
    ERREURS.push(`[requête échouée · ${nom}] ${u} — ${(r.failure() || {}).errorText}`);
  });
}

(async () => {
  const nav = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
    args: ["--no-sandbox"],
  });

  for (const vue of [{ nom: "bureau", w: 1280, h: 900 }, { nom: "mobile", w: 390, h: 844 }]) {
    const ctx = await nav.newContext({ viewport: { width: vue.w, height: vue.h },
      serviceWorkers: "block" });
    const page = await ctx.newPage();
    brancher(page, vue.nom);
    PAS.push(`\n=== ${vue.nom} (${vue.w}x${vue.h}) ===`);

    /* ---------------------------------------------- étape 1 : fiche client */
    await page.goto(BASE + "/audit-social.html", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(400);

    const fil = await page.$$eval("#fil-temps span", els => els.map(e => e.textContent.trim()));
    if (fil.length === 6 && /^1 · Fiche client/.test(fil[0]) && /^6 · Vérification/.test(fil[5]))
      ok("fil d'Ariane numéroté de 1 à 6 : " + fil.join(" | "));
    else ko("fil d'Ariane inattendu : " + JSON.stringify(fil));

    const nbFiche = await page.$$eval("#fiche-client [data-champ]", e => e.length);
    if (nbFiche >= 12) ok("fiche client rendue — " + nbFiche + " champs");
    else ko("fiche client incomplète : " + nbFiche + " champs");

    /* Les champs demandés par la consigne. */
    for (const c of ["denomination", "siret", "adresse", "responsable", "courriel", "telephone",
                     "effectif", "secteur", "conventionCollective", "groupe",
                     "etablissementsDistincts", "nbEtablissements"]) {
      const p = await page.$(`#fc-${c}`);
      if (p) ok("champ fiche client « " + c + " »");
      else ko("champ fiche client manquant : " + c);
    }

    /* Saisie d'un profil de test. */
    await page.fill("#fc-denomination", "TRANSPORTS DUVAL SAS");
    await page.fill("#fc-siret", "39284756100027");
    await page.fill("#fc-adresse", "7 avenue du Port, 76600 Le Havre");
    await page.fill("#fc-responsable", "Hélène Duval, présidente");
    await page.fill("#fc-courriel", "rh@transports-duval.fr");
    await page.fill("#fc-telephone", "02 35 00 11 22");
    await page.fill("#fc-effectif", "120");
    await page.selectOption("#fc-secteur", "transport et logistique");
    await page.fill("#fc-conventionCollective", "Transports routiers (IDCC 0016)");
    await page.selectOption("#fc-groupe", "non");
    await page.selectOption("#fc-etablissementsDistincts", "non");
    await page.fill("#fc-nbEtablissements", "1");
    await page.waitForTimeout(250);

    const stock = await page.evaluate(() => JSON.parse(localStorage.getItem("profil-entreprise") || "{}"));
    if (stock.siret === "39284756100027" && stock.courriel === "rh@transports-duval.fr"
        && stock.entreprise === "TRANSPORTS DUVAL SAS")
      ok("« profil-entreprise » étendu et écrit (SIRET, courriel, alias entreprise conservé)");
    else ko("profil-entreprise mal écrit : " + JSON.stringify(stock));

    /* Les questions d'orientation : quatre valeurs partout. */
    const menus = await page.$$eval('#formulaire select[data-ferme="1"]',
      els => els.map(s => [...s.options].map(o => o.value)));
    const attendu = ["", "oui", "non", "en cours", "autre"];
    if (menus.length && menus.every(m => JSON.stringify(m) === JSON.stringify(attendu)))
      ok(menus.length + " questions d'orientation à quatre valeurs (oui/non/en cours/autre)");
    else ko("menus d'orientation inattendus : " + JSON.stringify(menus.slice(0, 3)));

    await page.selectOption('#formulaire [name="seuilDepuis12Mois"]', "oui");
    await page.fill('#formulaire [name="dateAudit"]', "2026-08-22");
    await page.selectOption('#formulaire [name="sectionSyndicale"]', "oui");
    await page.selectOption('#formulaire [name="matieresInflammables"]', "non");
    await page.selectOption('#formulaire [name="salariesHorsHoraire"]', "oui");
    await page.selectOption('#formulaire [name="postesRisquesParticuliers"]', "non");
    await page.selectOption('#formulaire [name="cadres"]', "oui");
    await page.selectOption('#formulaire [name="projetLicenciementEco"]', "non");
    await page.selectOption('#formulaire [name="epargneSalariale"]', "non");
    await page.selectOption('#formulaire [name="comiteSeuilsComptes"]', "non");
    /* Une réponse « en cours » : elle ne doit rien conclure. */
    await page.selectOption('#formulaire [name="accordsCollectifs"]', "en cours");
    await page.waitForTimeout(250);

    const note = await page.textContent('#formulaire [data-nuance="accordsCollectifs"]');
    if (note && /ne\s+conclut\s+pas/.test(note)) ok("« en cours » signalé comme ne concluant pas");
    else ko("aucun avertissement sur « en cours » : " + JSON.stringify(note));

    const etat1 = await page.evaluate(() => JSON.parse(localStorage.getItem("audit-social-brouillon")));
    if (etat1.profil.accordsCollectifs === undefined
        && etat1.nuances.coches["__profil-accordsCollectifs"] === "en cours")
      ok("« en cours » rangé en nuance, jamais remis au moteur");
    else ko("« en cours » mal traité : " + JSON.stringify(etat1.profil.accordsCollectifs));

    /* ------------------------------------ étape 2 : questionnaire de l'existant */
    await page.click("#generer");
    await page.waitForTimeout(500);
    const dus = await page.$$eval("#liste [data-coche]", e => e.length);
    if (dus > 10) ok("étape 2 ouverte — " + dus + " obligations dues à répondre");
    else ko("étape 2 : trop peu d'obligations (" + dus + ")");

    const opt2 = await page.$$eval("#liste [data-coche]",
      els => [...els[0].options].map(o => o.value));
    if (JSON.stringify(opt2) === JSON.stringify(attendu))
      ok("questionnaire de l'existant à quatre valeurs");
    else ko("menus du questionnaire inattendus : " + JSON.stringify(opt2));

    /* Aucune question ne demande un jugement de conformité. */
    const libelles = await page.$$eval("#liste .coches .nom", e => e.map(x => x.textContent));
    if (libelles.every(l => /l'avez-vous/i.test(l))) ok("la question posée est « L'avez-vous ? »");
    else ko("libellés inattendus : " + JSON.stringify(libelles.slice(0, 3)));

    /* On répond : le règlement intérieur manque, le DUERP est là. */
    const ids = await page.$$eval("#liste [data-coche]", e => e.map(x => x.getAttribute("data-coche")));
    if (ids.includes("SOC-DOC-RI")) ok("SOC-DOC-RI dû à 120 salariés");
    else ko("SOC-DOC-RI absent de la liste");
    await page.selectOption('[data-coche="SOC-DOC-RI"]', "non");
    if (ids.includes("SOC-DOC-DUERP")) await page.selectOption('[data-coche="SOC-DOC-DUERP"]', "oui");
    if (ids.includes("SOC-REG-PERSONNEL")) await page.selectOption('[data-coche="SOC-REG-PERSONNEL"]', "en cours");
    await page.waitForTimeout(300);

    /* ------------------------------------------- étape 3 : rapport général */
    await page.click("#vers-general");
    await page.waitForTimeout(600);
    const bandeau = await page.textContent("#rapport-general .bandeau .r");
    if (/obligations applicables/.test(bandeau)) ok("étape 3 — rapport général : " + bandeau.trim());
    else ko("rapport général absent");
    const lignesRap = await page.$$eval("#rapport-general table tr", e => e.length);
    if (lignesRap > 40) ok("rapport général : " + lignesRap + " lignes de tableau");
    else ko("rapport général trop court : " + lignesRap);

    /* ------------------------------------- étape 4 : guide de régularisation */
    await page.click("#vers-guide");
    await page.waitForTimeout(600);
    const titreGuide = await page.textContent("#t4");
    if (/guide pratique de régularisation/i.test(titreGuide)) ok("étape 4 : « " + titreGuide.trim() + " »");
    else ko("titre de l'étape 4 inattendu : " + titreGuide);
    const cartes = await page.$$eval("#guide .action", e => e.length);
    if (cartes > 0) ok("guide : " + cartes + " point(s) à régulariser");
    else ko("guide vide");
    const lienRI = await page.$('#guide-SOC-DOC-RI a[href^="parcours.html?p=ri"]');
    if (lienRI) ok("liaison obligation → parcours posée dans le guide (SOC-DOC-RI → parcours « ri »)");
    else ko("aucun lien vers le parcours dans la carte SOC-DOC-RI");
    const lienDoc = await page.$('#guide-SOC-DOC-RI a[href^="documents.html?modele="]');
    if (lienDoc) ok("liaison obligation → modèle documentaire posée dans le guide");
    else ko("aucun lien vers un modèle dans la carte SOC-DOC-RI");
    const enCoursBloc = await page.textContent("#guide");
    if (/engagé, mais pas encore acquis/i.test(enCoursBloc))
      ok("le guide reprend les points déclarés « en cours »");
    else ko("les points « en cours » ne sont pas repris au guide");

    /* ------------------------------- étape 5 : régularisation élément par élément */
    await page.click('#guide-SOC-DOC-RI [data-regulariser="SOC-DOC-RI"]');
    await page.waitForTimeout(600);
    const choix = await page.inputValue("#choix-item");
    if (choix === "SOC-DOC-RI") ok("étape 5 ouverte sur l'élément choisi depuis le guide");
    else ko("l'étape 5 ne s'est pas ouverte sur SOC-DOC-RI (" + choix + ")");
    const modeleOuvert = await page.$("#fiche-item details.modele[open] .feuille");
    if (modeleOuvert) {
      const t = await page.textContent("#fiche-item details.modele[open] .ft");
      ok("modèle complet déplié : « " + t.trim() + " »");
    } else ko("le modèle complet n'est pas ouvert à l'étape 5");
    const lienParcours5 = await page.getAttribute('#fiche-item a[href^="parcours.html?p="]', "href");
    if (lienParcours5 === "parcours.html?p=ri") ok("procédure pas à pas reliée : " + lienParcours5);
    else ko("lien de parcours inattendu à l'étape 5 : " + lienParcours5);
    const lienDoc5 = await page.getAttribute('#fiche-item a[href^="documents.html?modele="]', "href");
    if (lienDoc5 && /modele=echelle-sanctions/.test(lienDoc5)) ok("document à produire relié");
    else ko("lien de document inattendu à l'étape 5 : " + lienDoc5);

    /* Le parcours s'ouvre-t-il vraiment ? */
    const pageP = await ctx.newPage();
    brancher(pageP, vue.nom + "/parcours");
    await pageP.goto(BASE + "/" + lienParcours5, { waitUntil: "domcontentloaded" });
    await pageP.waitForTimeout(700);
    const cartesP = await pageP.$$eval(".carte", e => e.length);
    const actifP = await pageP.textContent(".carte.actif b");
    if (cartesP === 12) ok("parcours.html : douze parcours");
    else ko("parcours.html : " + cartesP + " cartes (12 attendues)");
    if (/règlement intérieur/i.test(actifP || "")) ok("le parcours « " + actifP.trim() + " » s'ouvre depuis l'audit");
    else ko("le parcours ne s'est pas ouvert : " + actifP);
    const etapesP = await pageP.$$eval("#zone-etapes .etape", e => e.length);
    if (etapesP > 5) ok("parcours ouvert avec " + etapesP + " étapes");
    else ko("parcours sans étapes");
    const denomP = await pageP.inputValue("#pr-denomination");
    if (denomP === "TRANSPORTS DUVAL SAS") ok("la fiche client est reprise par les parcours");
    else ko("fiche client non reprise par les parcours : " + denomP);
    /* Les nouveaux parcours et leur étape de validation. */
    for (const c of ["affichages", "registre", "bdese", "index", "entretiens"]) {
      await pageP.click("#carte-" + c);
      await pageP.waitForTimeout(350);
      const n = await pageP.$$eval("#zone-etapes .etape", e => e.length);
      const dernier = await pageP.$$eval("#zone-etapes .etape .etape-titre", e => e[e.length - 1].textContent);
      if (n > 3 && /VALIDATION/.test(dernier)) ok(`parcours « ${c} » : ${n} étapes, la dernière est une validation`);
      else ko(`parcours « ${c} » : ${n} étapes, dernière « ${dernier} »`);
    }
    /* Les quatre valeurs dans un parcours. */
    await pageP.click("#carte-registre");
    await pageP.waitForTimeout(350);
    const optP = await pageP.$$eval('#form-donnees select', els => {
      const s = els.find(x => [...x.options].some(o => o.value === "en cours"));
      return s ? [...s.options].map(o => o.value) : null;
    });
    if (optP && optP.includes("en cours") && optP.includes("autre"))
      ok("parcours : réponses fermées à quatre valeurs");
    else ko("parcours : menus fermés à deux valeurs seulement");
    await pageP.close();

    /* Le document s'ouvre-t-il pré-rempli ? */
    const pageD = await ctx.newPage();
    brancher(pageD, vue.nom + "/documents");
    await pageD.goto(BASE + "/" + lienDoc5, { waitUntil: "domcontentloaded" });
    await pageD.waitForTimeout(700);
    const entD = await pageD.inputValue("#ch-entreprise").catch(() => null);
    if (entD === "TRANSPORTS DUVAL SAS") ok("le modèle s'ouvre pré-rempli de la fiche client (« " + entD + " »)");
    else ko("le modèle ne reprend pas la fiche client : " + entD);
    await pageD.close();

    /* On déclare le point régularisé. */
    await page.check("#fait-SOC-DOC-RI");
    await page.waitForTimeout(600);
    const etat5 = await page.evaluate(() => JSON.parse(localStorage.getItem("audit-social-brouillon")));
    if (etat5.faits["SOC-DOC-RI"] && etat5.coches["SOC-DOC-RI"] === "oui")
      ok("régularisation déclarée : le point passe à « oui » et entre au contrôle");
    else ko("la déclaration de régularisation n'a rien changé");

    /* --------------------------------- étape 6 : vérification de ce qui est fait */
    await page.click("#vers-existant");
    await page.waitForTimeout(600);
    const blocs = await page.$$eval("#verifs .verif-bloc", e => e.map(x => x.getAttribute("data-item")));
    if (blocs.includes("SOC-DOC-RI"))
      ok("étape 6 : le point régularisé à l'étape 5 est repris au contrôle");
    else ko("le point régularisé n'est pas repris à l'étape 6 : " + JSON.stringify(blocs));
    const badge = await page.textContent('#verifs [data-item="SOC-DOC-RI"] .chip').catch(() => null);
    if (badge && /régularisé/.test(badge)) ok("il y est signalé : « " + badge.trim() + " »");
    else ko("aucune mention de la régularisation à l'étape 6");

    const opt6 = await page.$$eval('#verifs [data-item="SOC-DOC-RI"] select',
      els => [...els[0].options].map(o => o.value));
    if (JSON.stringify(opt6) === JSON.stringify(attendu))
      ok("questions de vérification à quatre valeurs");
    else ko("menus de vérification inattendus : " + JSON.stringify(opt6));

    /* On répond partiellement, et on vérifie que rien ne devient « conforme ». */
    const selRI = await page.$$('#verifs [data-item="SOC-DOC-RI"] select');
    await selRI[0].selectOption("oui");
    if (selRI[1]) await selRI[1].selectOption("en cours");
    await page.waitForTimeout(300);
    await page.click("#controler");
    await page.waitForTimeout(700);
    const rap6 = await page.textContent("#rapport-existant .bandeau .r");
    if (/Rapport de régularisation/.test(rap6)) ok("étape 6 — " + rap6.trim());
    else ko("rapport de régularisation absent");
    const verdictRI = await page.$$eval("#rapport-existant .verdict", els => {
      const v = els.find(x => /Règlement intérieur/.test(x.textContent));
      return v ? v.querySelector(".chip").textContent.trim() : null;
    });
    if (verdictRI && verdictRI !== "conforme")
      ok("le point régularisé mais non prouvé rend « " + verdictRI + "», jamais « conforme »");
    else ko("verdict inattendu pour le règlement intérieur : " + verdictRI);

    /* La progression est-elle persistée ? */
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.waitForTimeout(800);
    const visible6 = await page.$eval("#bloc-existant", el => el.style.display !== "none");
    const actif = await page.$eval("#fil-temps span.actif", el => el.textContent.trim());
    if (visible6 && /^6 · /.test(actif)) ok("progression persistée : réouverture à l'étape « " + actif + " »");
    else ko("progression non persistée (étape active : " + actif + ")");

    /* Les huit audits détaillés s'ouvrent-ils sans erreur, avec quatre valeurs ? */
    for (const a of ["audit.html", "audit-cse.html", "audit-pse.html", "audit-bdese.html",
                     "audit-nao.html", "audit-sst.html", "audit-discipline.html"]) {
      const pa = await ctx.newPage();
      brancher(pa, vue.nom + "/" + a);
      await pa.goto(BASE + "/" + a, { waitUntil: "domcontentloaded" });
      await pa.waitForTimeout(600);
      const q4 = await pa.$$eval("select", els => {
        const s = els.find(x => [...x.options].some(o => o.value === "en cours"));
        return s ? [...s.options].map(o => o.value) : null;
      });
      if (q4 && q4.includes("en cours") && q4.includes("autre")) ok(a + " : réponses fermées à quatre valeurs");
      else ko(a + " : pas de menu à quatre valeurs");
      /* L'audit tourne-t-il encore de bout en bout ? */
      /* Sur téléphone la barre d'actions est repliée : on clique par le DOM. */
      await pa.$eval("#exemple", el => el.click());
      await pa.waitForTimeout(600);
      await pa.$eval("#lancer", el => el.click());
      await pa.waitForTimeout(1000);
      const rap = await pa.$$eval("#sortie .bandeau, #sortie .erreur, #sortie h2", e => e.length);
      const err = await pa.$("#sortie .erreur");
      if (rap > 0 && !err) ok(a + " : dossier d'exemple audité, rapport produit");
      else ko(a + " : l'audit d'exemple n'a pas produit de rapport");
      /* Une réponse « en cours » ne doit rien conclure. */
      const cible = await pa.evaluate(() => {
        const s = [...document.querySelectorAll("select")].find(x =>
          [...x.options].some(o => o.value === "en cours") && x.value === "oui" &&
          x.closest("label") && x.closest("label").style.display !== "none");
        if (!s) return null;
        s.value = "en cours";
        s.dispatchEvent(new Event("change", { bubbles: true }));
        return s.name;
      });
      if (cible) {
        await pa.waitForTimeout(400);
        const note = await pa.textContent("#nuance-" + CSS_escape(cible)).catch(() => null);
        if (note && /ne conclut pas/.test(note)) ok(a + " : « en cours » signalé sur « " + cible + " »");
        else ko(a + " : « en cours » non signalé sur « " + cible + " »");
        await pa.$eval("#lancer", el => el.click());
        await pa.waitForTimeout(1000);
        const txt = await pa.textContent("#sortie");
        if (/ne s'est pas prononcé/.test(txt)) ok(a + " : le rapport dit ce sur quoi il ne s'est pas prononcé");
        else ko(a + " : le rapport ne mentionne pas les réponses qui ne concluent pas");
      }
      await pa.close();
    }

    /* Les pages qui lisent le profil ne doivent pas casser. */
    for (const a of ["agenda.html", "guides.html", "index.html", "documents.html"]) {
      const pa = await ctx.newPage();
      brancher(pa, vue.nom + "/" + a);
      await pa.goto(BASE + "/" + a, { waitUntil: "domcontentloaded" });
      await pa.waitForTimeout(700);
      ok(a + " s'ouvre");
      await pa.close();
    }

    await ctx.close();
  }

  await nav.close();
  console.log(PAS.join("\n"));
  console.log("\n================================");
  if (ERREURS.length) {
    console.log("ÉCHECS ET ERREURS CONSOLE (" + ERREURS.length + ") :");
    ERREURS.forEach(e => console.log("  - " + e));
    process.exit(1);
  }
  console.log("Tout est vert : parcours joué de l'étape 1 à l'étape 6, zéro erreur console.");
})();
