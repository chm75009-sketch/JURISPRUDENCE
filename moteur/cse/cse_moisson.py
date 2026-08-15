"""Moisson : on ratisse par référence d'article — c'est le seul filet à la fois
large et précis — puis par les expressions propres à l'institution.
Toute requête « relaxed » est écartée sans exception."""
import jl, json, sys

def blocs():
    q = []
    plages = [("2311", 3), ("2312", 90), ("2313", 12), ("2314", 40),
              ("2315", 100), ("2316", 30), ("2317", 6), ("2321", 12)]
    for tete, n in plages:
        for i in range(1, n + 1):
            q.append(f"L. {tete}-{i}")
    q += ["R. 2312-1", "R. 2314-1", "R. 2315-1", "R. 2316-1",
          "comité social et économique", "comité social et économique central",
          "comité social et économique d'établissement", "conseil d'entreprise",
          "représentant de proximité", "commission santé, sécurité et conditions de travail"]
    return q

REQ = blocs()
res, rel, vide = {}, [], 0
for k, q in enumerate(REQ):
    page = 0
    while True:
        d = jl.chercher(q, page_size=50, page=page)
        if "erreur" in d:
            print("ERREUR", q, d["erreur"][:60], flush=True); break
        if d.get("relaxed"):
            rel.append(q); break
        tot = d.get("total", 0)
        if not tot:
            vide += 1; break
        for r in d.get("results", []):
            e = res.setdefault(r["id"], {"num": r.get("number"), "date": r.get("decision_date"),
                 "ch": r.get("chamber"), "sol": r.get("solution"), "pub": r.get("publication"),
                 "form": r.get("formation"), "req": []})
            e["req"].append(q)
        page += 1
        if page * 50 >= tot or page > 40: break
    if k % 40 == 0:
        print(f"{k+1}/{len(REQ)} — {len(res)} décisions", flush=True)
json.dump(res, open("cse_ids.json", "w"), ensure_ascii=False)
print(f"\nrequêtes : {len(REQ)} · relaxed écartées : {len(rel)} · sans résultat : {vide}")
print(f"décisions distinctes : {len(res)}")
