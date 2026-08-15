"""Accès Judilibre. La clé n'est jamais écrite dans le code : elle est lue
dans un fichier local, hors dépôt."""
import json, os, time, urllib.parse, urllib.request
CLE = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".jk")).read().strip()
BASE = "https://api.piste.gouv.fr/cassation/judilibre/v1.0"

def appel(chemin, params, essais=4):
    url = BASE + chemin + "?" + urllib.parse.urlencode(params, doseq=True)
    req = urllib.request.Request(url, headers={"KeyId": CLE, "accept": "application/json"})
    for i in range(essais):
        try:
            with urllib.request.urlopen(req, timeout=90) as r:
                return json.load(r)
        except Exception as e:
            if i == essais - 1:
                return {"erreur": str(e)}
            time.sleep(2 * (i + 1))

def chercher(q, **kw):
    p = {"query": q, "operator": "exact", "jurisdiction": "cc",
         "publication": ["b", "r"], "page_size": 50}
    p.update(kw)
    return appel("/search", p)
