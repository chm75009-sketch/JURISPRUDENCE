"""Récupération de tous les articles du champ, un par un, depuis Légifrance.
Aucune règle ne sera écrite sur un article qui n'a pas été lu ici."""
import json, os, time, urllib.request

URL = "https://jurisprudence-recherche.netlify.app/.netlify/functions/legifrance"
CODE = "LEGITEXT000006072050"
DATE = "2026-08-15"

def art(num):
    d = json.dumps({"action": "article", "numero": num, "code": CODE, "date": DATE}).encode()
    r = urllib.request.Request(URL, data=d, headers={"content-type": "application/json"})
    for i in range(3):
        try:
            with urllib.request.urlopen(r, timeout=60) as f:
                return json.load(f)
        except Exception:
            time.sleep(2 * (i + 1))
    return {"erreur": True}

NUMS = []
for t, n in [("L2311", 3), ("L2312", 90), ("L2313", 12), ("L2314", 40), ("L2315", 100),
             ("L2316", 30), ("L2317", 6), ("L2321", 12),
             ("R2312", 12), ("R2313", 6), ("R2314", 30), ("R2315", 60), ("R2316", 12)]:
    NUMS += [f"{t}-{i}" for i in range(1, n + 1)]
NUMS += ["L2411-1","L2411-5","L2411-8","L2421-3","L1111-2","L1111-3","L2232-12",
         "L2143-3","L2143-6","L2143-22","L2142-1","L4131-1","L4132-2","L2312-5","L2312-8"]

try: T = json.load(open("textes_cse.json"))
except Exception: T = {}
reste = [n for n in NUMS if n not in T]
print(len(NUMS), "visés ·", len(T), "déjà lus ·", len(reste), "à lire", flush=True)
for k, n in enumerate(reste):
    d = art(n)
    if d.get("trouve"):
        T[n] = {"id": d.get("id"), "texte": d.get("texte"), "elargi": d.get("elargi", False)}
    else:
        T[n] = None
    if k % 25 == 0:
        json.dump(T, open("textes_cse.json", "w"), ensure_ascii=False)
        print(f"{k+1}/{len(reste)} — {sum(1 for v in T.values() if v)} trouvés", flush=True)
json.dump(T, open("textes_cse.json", "w"), ensure_ascii=False)
print("terminé :", sum(1 for v in T.values() if v), "articles trouvés sur", len(T), "essayés")
