"""ÉPREUVE — LE CHEMIN D'UN UTILISATEUR QUI REVIENT SUR SON DOSSIER

Écrite le 31 août 2026 après un défaut qui n'aurait pas dû sortir : la
bascule vers le parcours guidé avait été éprouvée sur la transition — on
répond « non », on part sur la procédure — et pas sur l'état où l'application
se retrouve à la réouverture, la réponse « non » déjà en mémoire. Or c'est le
cas ordinaire : on remplit un audit un jour, on le rouvre le lendemain.
L'utilisatrice est tombée dessus, pas nous.

D'où cette épreuve, qui part de brouillons DÉJÀ ENREGISTRÉS et vérifie que
chaque page rouverte montre, sans défiler, ce qu'il y a à faire.

    cd docs && python3 -m http.server 8325 &
    python3 moteur/commun/epreuve-parcours-reel.py

"""
from playwright.sync_api import sync_playwright
B = "http://localhost:8325/"

PROFIL = {"denomination":"TEC","effectif":74,"secteur":"transport et logistique",
          "conventionCollective":"0016","cseExiste":"non","groupe":"non",
          "etablissementsDistincts":"non"}

# Les brouillons tels qu'ils existent après une première visite où l'on a
# répondu « non » — la situation même de l'utilisatrice.
BROUILLONS = {
 "audit-discipline-brouillon": {"dossier":{"dateAudit":"2026-08-31","ri.existe":"non",
    "ri.dateFranchissementSeuil":"2024-03-31"},"nuances":{},"faits":{},"controles":{},"etape":2},
 "audit-sst-brouillon": {"dossier":{"dateAudit":"2026-08-31","duerp.existe":"non"},
    "nuances":{},"faits":{},"controles":{},"etape":2},
 "audit-cse-brouillon": {"dossier":{"dateAudit":"2026-08-31","comiteExistant":False},
    "nuances":{},"faits":{},"controles":{},"etape":2},
}

PAGES = ["index.html","auditer.html","gerer.html","parcours.html","documents.html",
         "audit-discipline.html","audit-cse.html","audit-bdese.html","audit-sst.html",
         "audit-nao.html","audit-social.html","audit-pse.html","audit.html","agenda.html"]

def main():
    with sync_playwright() as pw:
        n = pw.chromium.launch(executable_path="/opt/pw-browsers/chromium")
        pg = n.new_page(viewport={"width":390,"height":844})
        err = []
        pg.on("pageerror", lambda e: err.append(pg.url.split("/")[-1] + " : " + str(e)))
        pg.on("console", lambda m: err.append("console " + pg.url.split("/")[-1] + " : " + m.text)
              if m.type == "error" else None)

        pg.goto(B + "index.html"); pg.wait_for_load_state("networkidle")
        pg.evaluate("""([p,b])=>{localStorage.clear();
          localStorage.setItem('profil-entreprise', JSON.stringify(p));
          Object.keys(b).forEach(k=>localStorage.setItem(k, JSON.stringify(b[k])));}""",
          [PROFIL, BROUILLONS])

        print("— DOSSIER DÉJÀ COMMENCÉ, ON ROUVRE —")
        for f in PAGES:
            pg.goto(B + f); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(250)
            titre = pg.title()[:34]
            # Y a-t-il quelque chose à faire, visible sans défiler ?
            visible = pg.evaluate("""()=>{
              const h=window.innerHeight;
              const dedans=e=>{const r=e.getBoundingClientRect();return r.top<h && r.bottom>0;};
              const rap=document.querySelector('.bascule-rappel');
              const et=document.querySelector('.etape');
              const q=document.querySelector('#formulaire [name],#formulaire [data-nom]');
              return {rappel: !!(rap&&dedans(rap)), etape: !!(et&&dedans(et)), question: !!(q&&dedans(q))};}""")
            print("  %-24s %-34s %s" % (f, titre, visible))

        print("\n— LE PARCOURS OUVERT DEPUIS L'AUDIT —")
        pg.goto(B + "parcours.html?p=ri"); pg.wait_for_load_state("networkidle"); pg.wait_for_timeout(300)
        print("   première étape à %d px du haut"
              % pg.evaluate("()=>Math.round(document.querySelector('.etape').getBoundingClientRect().top)"))
        print("   étapes :", len(pg.query_selector_all(".etape")),
              "· sanctions :", len(pg.query_selector_all(".risque")),
              "· conseils :", len(pg.query_selector_all(".conseil")),
              "· courriers :", len(pg.query_selector_all("[data-courrier]")))
        print("   dates demandées d'avance :",
              pg.eval_on_selector_all("#zone-dates label .nom","a=>a.map(x=>x.textContent)"))

        print("\nERREURS :", err if err else "aucune")
        n.close()

main()
