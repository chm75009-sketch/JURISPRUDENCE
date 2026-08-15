"""Lecture de chaque décision moissonnée, puis filtre : on ne garde que celles
qui appliquent le régime du comité social et économique. Le critère n'est pas
la date — un arrêt de 2024 peut juger un comité d'entreprise — mais la présence
du CSE dans le visa, le sommaire ou le titrage."""
import jl, json, re, sys, time

IDS = json.load(open("cse_ids.json"))
try:    D = json.load(open("cse_textes.json"))
except Exception: D = {}
reste = [i for i in IDS if i not in D]
print(len(IDS), "moissonnées ·", len(D), "déjà lues ·", len(reste), "à lire", flush=True)
for k, i in enumerate(reste):
    d = jl.appel("/decision", {"id": i, "resolve_references": "true"})
    if "erreur" in d:
        print("ERREUR", i, d["erreur"][:60], flush=True); continue
    visa = d.get("visa")
    if isinstance(visa, list):
        visa = " · ".join(x.get("title", "") if isinstance(x, dict) else str(x) for x in visa)
    D[i] = {"id": i, "num": d.get("number"), "date": d.get("decision_date"),
            "ch": d.get("chamber"), "sol": d.get("solution"), "pub": d.get("publication"),
            "form": d.get("formation"), "themes": d.get("themes") or [],
            "sommaire": d.get("summary"), "visa": visa,
            "texte": d.get("text"), "req": IDS[i]["req"]}
    if k % 50 == 0:
        json.dump(D, open("cse_textes.json", "w"), ensure_ascii=False)
        print(f"{k+1}/{len(reste)}", flush=True)
json.dump(D, open("cse_textes.json", "w"), ensure_ascii=False)
print("lues :", len(D))
