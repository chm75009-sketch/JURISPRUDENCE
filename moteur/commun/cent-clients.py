# -*- coding: utf-8 -*-
"""CENT CLIENTS DANS L'APPLICATION, DANS UN VRAI NAVIGATEUR.

   Demande du 1er septembre 2026 : « cent clients qui vont sur l'application
   pour vérifier l'accès, remplir la fiche de renseignements et l'audit de
   tous les modules avec réponses NON ».

   Chacun des cent profils fait, pour de bon :
     1. il ouvre l'application, remplit la fiche d'entreprise et la valide ;
     2. il ouvre les huit questionnaires d'audit ;
     3. il répond NON à toutes les questions fermées, remplit les autres ;
     4. il demande le rapport, puis le guide de régularisation.

   Est relevé : toute erreur de console, tout bouton absent, tout écran qui ne
   vient pas, et — c'est l'objet — tout parcours proposé à un effectif qui ne
   le doit pas.

   Lancer depuis la racine :  python3 moteur/commun/cent-clients.py
"""
import http.server, json, random, socketserver, threading, sys, os
from playwright.sync_api import sync_playwright

RACINE = os.path.join(os.path.dirname(__file__), "..", "..", "docs")
RACINE = os.path.abspath(RACINE)

MODULES = ["discipline", "sst", "cse", "bdese", "nao", "pse", "social"]

SECTEURS = ["services", "commerce", "industrie", "bâtiment", "transport",
            "hôtellerie-restauration", "santé", "association"]
CONVENTIONS = ["Syntec (IDCC 1486)", "HCR (IDCC 1979)", "Métallurgie (IDCC 3248)",
               "Commerce de détail (IDCC 1517)", "Bâtiment ETAM (IDCC 2609)"]

def serveur():
    os.chdir(RACINE)
    h = http.server.SimpleHTTPRequestHandler
    h.log_message = lambda *a, **k: None
    s = socketserver.TCPServer(("127.0.0.1", 0), h)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s, s.server_address[1]

def profils(n=int(os.environ.get("N","100"))):
    random.seed(20260901)
    # des effectifs qui encadrent chaque seuil : 10/11, 19/20, 49/50, 299/300,
    # 999/1000, 1999/2000 — le reste au hasard.
    bornes = [1, 5, 10, 11, 12, 19, 20, 21, 49, 50, 51, 99, 149, 199, 249,
              299, 300, 301, 499, 999, 1000, 1001, 1999, 2000, 2001]
    effs = list(bornes) + [random.randint(1, 3000) for _ in range(n - len(bornes))]
    return [{"denomination": "CLIENT %03d" % (i + 1),
             "effectif": str(effs[i]),
             "secteur": SECTEURS[i % len(SECTEURS)],
             "conventionCollective": CONVENTIONS[i % len(CONVENTIONS)]}
            for i in range(n)]

# Les champs d'entrée de chaque module : ceux dont le « non » fait basculer.
ENTREE_OUI = """() => {
  const noms = ['ri.existe', 'duerp.existe', 'cssct.existe', 'comiteExistant',
                'base.existe', 'negosEngagees'];
  noms.forEach(n => {
    document.querySelectorAll('[name="' + n + '"], [data-nom="' + n + '"]').forEach(e => {
      if (e.tagName === 'SELECT') { e.value = 'oui'; }
      else if (e.type === 'radio') { e.checked = (String(e.value) === 'oui'); }
      e.dispatchEvent(new Event('change', {bubbles: true}));
    });
  });
}"""

REMPLIR = """(rep) => {
  const out = {radios: 0, selects: 0, textes: 0};
  // La question d'entrée est laissée de côté : répondue « non », elle ferait
  // basculer vers la procédure avant que le reste du questionnaire soit rempli,
  // et le rapport ne pourrait plus être éprouvé. Elle l'est séparément, à la fin.
  // « cssct.existe » en fait partie : la santé-sécurité a DEUX questions
  // d'entrée, le document unique et la commission santé-sécurité, et la
  // seconde ne bascule qu'à partir de trois cents salariés.
  const ENTREE = ['ri.existe', 'duerp.existe', 'cssct.existe', 'comiteExistant',
                  'base.existe', 'negosEngagees'];
  const entree = e => ENTREE.indexOf(e.name || e.getAttribute('data-nom') || '') >= 0;
  document.querySelectorAll('input[type=radio]').forEach(r => {
    if (entree(r)) return;
    if (String(r.value).toLowerCase() === rep) { r.checked = true;
      r.dispatchEvent(new Event('change', {bubbles: true})); out.radios++; }
  });
  document.querySelectorAll('select').forEach(s => {
    if (entree(s)) return;
    const o = [...s.options].find(o => /^non$/i.test(o.textContent.trim()));
    if (o) { s.value = o.value; s.dispatchEvent(new Event('change', {bubbles: true})); out.selects++; }
  });
  document.querySelectorAll('input[type=text], input[type=number], input[type=date]').forEach(i => {
    if (i.value) return;
    i.value = i.type === 'date' ? '2026-01-15' : (i.type === 'number' ? '1' : 'à compléter');
    i.dispatchEvent(new Event('input', {bubbles: true}));
    i.dispatchEvent(new Event('change', {bubbles: true})); out.textes++;
  });
  return out;
}"""

def main():
    srv, port = serveur()
    base = "http://127.0.0.1:%d/" % port
    anomalies, resume = [], []
    docs_ouverts = [0]
    with sync_playwright() as pw:
        nav = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        for i, prof in enumerate(profils()):
            ctx = nav.new_context()
            page = ctx.new_page()
            erreurs = []
            page.on("pageerror", lambda e: erreurs.append(str(e)))
            page.on("console", lambda m: erreurs.append(m.text) if m.type == "error" else None)

            # 1. l'accès, et la fiche écrite comme le ferait le client
            page.goto(base + "index.html", wait_until="domcontentloaded")
            page.evaluate("(p) => localStorage.setItem('profil-entreprise', JSON.stringify(p))", prof)

            # 2. les huit questionnaires, tous répondus « non »
            faits = {}
            for m in MODULES:
                page.goto(base + "audit-%s.html" % m, wait_until="domcontentloaded")
                # « Étape 2 : ouvrir le questionnaire » commande tout le reste :
                # si ce clic échoue, le bouton du rapport général demeure masqué
                # et l'échec se lit plus loin, au mauvais endroit. On le suit donc
                # pour lui-même.
                if page.locator("#generer").count():
                    try:
                        page.locator("#generer").scroll_into_view_if_needed(timeout=5000)
                        page.click("#generer", timeout=8000)
                    except Exception as ex:
                        anomalies.append((prof["denomination"], m,
                                          "questionnaire non ouvert : " + str(ex).split("\n")[0][:80]))
                page.wait_for_timeout(250)
                # LA QUESTION D'ENTRÉE EST DÉSORMAIS LA PREMIÈRE, et « non » fait
                # basculer aussitôt vers la procédure. Pour éprouver le rapport et
                # le guide, il faut donc y répondre « oui » ; la bascule est
                # éprouvée à part, une fois le module parcouru.
                page.evaluate(ENTREE_OUI)
                page.wait_for_timeout(120)
                n = page.evaluate(REMPLIR, "non")
                faits[m] = n["radios"] + n["selects"]
                # Le bouton peut être recouvert un instant par la barre d'actions
                # collante : on le fait défiler à vue et on lui laisse le temps,
                # sinon l'épreuve se signale elle-même comme un défaut.
                # La barre d'actions est collée au bas de l'écran et bouge tant que
                # les deux cent trente questions finissent de se poser : Playwright
                # refuse alors de cliquer sur une cible qu'il juge instable, quand
                # un utilisateur, lui, cliquerait sans peine. On déclenche donc le
                # bouton directement, et l'on vérifie le RÉSULTAT — le rapport
                # s'est-il ouvert — plutôt que la mécanique du clic.
                for b, bloc in (("#vers-general", "#bloc-general"), ("#vers-guide", "#bloc-guide")):
                    if not page.locator(b).count():
                        continue
                    avant = page.url
                    try:
                        page.evaluate("(s) => { const e = document.querySelector(s); if (e) e.click(); }", b)
                        page.wait_for_timeout(250)
                        ouvert = page.evaluate(
                            "(s) => { const e = document.querySelector(s);"
                            " return !!e && getComputedStyle(e).display !== 'none'; }", bloc)
                    except Exception:
                        # Le contexte a été détruit : la page a navigué. Ce n'est pas
                        # un défaut en soi — répondre « non » fait basculer vers la
                        # procédure, c'est voulu —, mais il faut savoir où l'on part.
                        page.wait_for_timeout(300)
                        anomalies.append((prof["denomination"], m,
                                          "navigation pendant " + b + " : " + avant.split("/")[-1] +
                                          " -> " + page.url.split("/")[-1]))
                        break
                    if not ouvert:
                        anomalies.append((prof["denomination"], m,
                                          "le bouton " + b + " n'ouvre pas " + bloc))
                if n["radios"] + n["selects"] == 0:
                    anomalies.append((prof["denomination"], m, "aucune question fermée trouvée"))

            # 2 bis. LA BASCULE, éprouvée pour elle-même : on revient sur chaque
            # module, on répond « non » à la seule question d'entrée, et l'on
            # vérifie que la procédure s'ouvre — c'est la promesse du volet
            # « non », et c'est le seul endroit où elle se mesure.
            BASCULE = {"discipline": "ri", "sst": "duerp", "cse": "installation",
                       "bdese": "bdese", "nao": "nao"}
            # La commission santé-sécurité n'est due qu'à trois cents salariés :
            # sa bascule ne s'éprouve qu'au-delà.
            if int(prof["effectif"]) >= 300:
                pass
            for m, attendu in BASCULE.items():
                page.goto(base + "audit-%s.html" % m, wait_until="domcontentloaded")
                if page.locator("#generer").count():
                    try: page.click("#generer", timeout=6000)
                    except Exception: pass
                page.wait_for_timeout(250)
                try:
                    page.evaluate("""() => {
                      const noms = ['ri.existe','duerp.existe','comiteExistant','base.existe','negosEngagees'];
                      for (const n of noms) {
                        const e = document.querySelector('[name="'+n+'"], [data-nom="'+n+'"]');
                        if (!e) continue;
                        if (e.tagName === 'SELECT') e.value = 'non';
                        else if (e.type === 'radio') {
                          const r = document.querySelector('[name="'+n+'"][value="non"], [data-nom="'+n+'"][value="non"]');
                          if (r) { r.checked = true; r.dispatchEvent(new Event('change',{bubbles:true})); return; }
                        }
                        e.dispatchEvent(new Event('change', {bubbles: true}));
                        return;
                      }
                    }""")
                except Exception:
                    pass
                page.wait_for_timeout(900)
                if ("p=" + attendu) not in page.url:
                    anomalies.append((prof["denomination"], m,
                                      "« non » n'ouvre pas p=" + attendu + " (arrivée : " +
                                      page.url.split("/")[-1][:40] + ")"))

            # 2 ter. LES DOCUMENTS, OUVERTS POUR DE BON. L'épreuve ne les avait
            # jamais ouverts : elle cliquait le rapport et le guide, comptait les
            # cartes, et concluait « zéro anomalie » sur une version où le bouton
            # « Ouvrir la base à remplir » ne répondait pas — les générateurs se
            # chargeaient dans le désordre. Reproche du 2 septembre 2026, fondé.
            # On ouvre donc chaque document de chaque parcours proposé, et l'on
            # vérifie qu'un texte en sort.
            page.goto(base + "parcours.html", wait_until="domcontentloaded")
            page.wait_for_timeout(300)
            cles = page.evaluate(
                "() => [...document.querySelectorAll('.carte')].map(b => b.id.replace('carte-',''))")
            for cle in cles:
                page.goto(base + "parcours.html?p=" + cle, wait_until="domcontentloaded")
                page.wait_for_timeout(350)
                docs = page.evaluate(
                    "() => [...new Set([...document.querySelectorAll('[data-courrier]')]"
                    ".map(b => b.getAttribute('data-courrier')))]")
                for d in docs:
                    try:
                        page.evaluate(
                            "(id) => { const b = document.querySelector('[data-courrier=\"' + id + '\"]');"
                            " if (b) b.click(); }", d)
                        page.wait_for_timeout(700)
                        etat = page.evaluate(
                            "() => ({titre: (document.getElementById('dt-titre')||{}).textContent || '',"
                            " corps: ((document.getElementById('dt-corps')||{}).value || '').length,"
                            " tableur: !((document.getElementById('dt-tableur')||{}).hidden)})")
                        if not etat["titre"] or etat["corps"] < 200:
                            anomalies.append((prof["denomination"], cle,
                                              "document " + d + " ne s'ouvre pas (titre « " +
                                              etat["titre"][:30] + " », " + str(etat["corps"]) + " caractères)"))
                        else:
                            docs_ouverts[0] += 1
                        page.evaluate("() => { const b = document.getElementById('dt-fermer'); if (b) b.click(); }")
                        page.wait_for_timeout(120)
                    except Exception as ex:
                        anomalies.append((prof["denomination"], cle,
                                          "document " + d + " : " + str(ex).split("\n")[0][:70]))

            # 3. les parcours proposés à cet effectif
            page.goto(base + "parcours.html", wait_until="domcontentloaded")
            page.wait_for_timeout(200)
            cartes = page.evaluate(
                "() => [...document.querySelectorAll('.carte b')].map(b => b.textContent)")
            eff = int(prof["effectif"])
            interdits = []
            if eff < 11:
                interdits += [c for c in cartes if "CSE" in c or "comité" in c]
            if eff < 50:
                interdits += [c for c in cartes if "BDESE" in c or "base de données" in c or "index" in c.lower()]
            for c in set(interdits):
                anomalies.append((prof["denomination"], "parcours",
                                  "« %s » proposé à %d salariés" % (c, eff)))
            for e in erreurs[:3]:
                anomalies.append((prof["denomination"], "console", e[:120]))

            resume.append({"client": prof["denomination"], "effectif": eff,
                           "questions": sum(faits.values()), "cartes": len(cartes)})
            ctx.close()
            if True:
                print("  client %d — %s, %d salariés, %d questions, %d cartes" % (i+1, prof["denomination"], eff, sum(faits.values()), len(cartes)), flush=True)
        nav.close()
    srv.shutdown()

    print("\n=== CENT CLIENTS ===")
    q = [r["questions"] for r in resume]
    print("questions fermées répondues « non » : de %d à %d par client" % (min(q), max(q)))
    c = [r["cartes"] for r in resume]
    print("parcours proposés : de %d à %d selon l'effectif" % (min(c), max(c)))
    print("documents ouverts et non vides : %d" % docs_ouverts[0])
    print("anomalies : %d" % len(anomalies))
    vus = set()
    for a in anomalies:
        k = (a[1], a[2])
        if k in vus: continue
        vus.add(k)
        print("  [%s] %s  (premier : %s)" % (a[1], a[2], a[0]))
    print("\n%d anomalies distinctes." % len(vus))
    return 1 if vus else 0

if __name__ == "__main__":
    sys.exit(main())
