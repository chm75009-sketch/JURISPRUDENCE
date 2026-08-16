"""Moissonner le vocabulaire de la Cour, une fois pour toutes.

   L'assistant interrogeait l'API à chaque recherche pour deviner les mots des
   juges : lent, et tributaire d'un échantillon tiré sur les mots de
   l'utilisateur — lesquels sont précisément ceux qu'il ne faut pas employer.

   On fait donc l'analyse UNE FOIS, ici : pour chacune des rubriques du titrage
   officiel, on lit un échantillon de décisions et l'on relève les mots qui la
   caractérisent. Le dictionnaire obtenu est versé au dépôt et chargé avec la
   page : la correspondance « mots de tous les jours → rubrique de la Cour »
   devient instantanée, et ne dépend plus du hasard d'un échantillon.
"""
import os, json, subprocess, tempfile, urllib.parse, unicodedata, re, sys, time
from collections import Counter

CLE = sys.argv[1]        # la clé se passe en argument : jamais dans le code, jamais au dépôt
API = "https://api.piste.gouv.fr/cassation/judilibre/v1.0"
ICI = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "docs") + os.sep

def api(chemin, **kw):
    u = API + chemin + "?" + urllib.parse.urlencode(kw, doseq=True)
    for essai in range(3):
        r = subprocess.run(["curl", "-s", "--max-time", "40", "-H", "KeyId: " + CLE, u],
                           capture_output=True, text=True).stdout
        try: return json.loads(r)
        except Exception: time.sleep(2)
    return {}

def net(s):
    s = ''.join(c for c in unicodedata.normalize('NFD', str(s).lower()) if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', ' ', s).strip()

VIDES = set("le la les un une des du de au aux et ou en dans par pour sur sous avec sans que qui dont est sont etre ete avoir eu il elle ils elles on ne pas plus ce cet cette ces son sa ses leur leurs se s y l n c qu si mais donc or ni car cas lors alors ainsi tout tous toute toutes meme aussi tres bien peut peuvent doit doivent article articles cour appel arret arrets chambre civile sociale commerciale criminelle pourvoi cassation demande demandeur defendeur societe monsieur madame juge tribunal instance premiere seconde alinea code loi decret".split())

themes = api("/taxonomy", id="theme", context_value="cc").get("result", [])
print(len(themes), "rubriques du titrage", flush=True)

voc = {}
for i, t in enumerate(themes, 1):
    d = api("/search", query=t, operator="exact", field="themes", page_size=10, jurisdiction=["cc", "ca"])
    if d.get("relaxed"): d = {"results": []}
    mots = Counter()
    for r in d.get("results", []):
        texte = " ".join([r.get("summary") or ""] + (r.get("themes") or []))
        for m in net(texte).split():
            if len(m) > 3 and m not in VIDES: mots[m] += 1
    voc[t] = {"n": d.get("total", 0), "mots": [m for m, _ in mots.most_common(25)]}
    if i % 50 == 0:
        print(f"  {i}/{len(themes)}", flush=True)
        json.dump(voc, open(os.path.join(tempfile.gettempdir(), "voc-partiel.json"), "w"),
                  ensure_ascii=False)
    time.sleep(0.15)

# Ce qui est versé au dépôt : les rubriques sur lesquelles l'échantillon a
# effectivement porté. Une rubrique sans décision lue n'apprend rien et ne doit
# pas figurer — la page ne proposerait qu'un intitulé vide de tout relevé.
retenu = {k: {"n": v["n"], "m": v["mots"][:20]} for k, v in voc.items() if v["n"] and v["mots"]}
json.dump(retenu, open(ICI + "vocabulaire.json", "w"), ensure_ascii=False, separators=(",", ":"))
print(f"terminé : {len(retenu)} rubriques retenues sur {len(voc)} lues", flush=True)
