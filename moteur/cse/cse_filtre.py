"""Filtre CSE : on ne garde que les décisions qui appliquent le régime du comité
social et économique. Le critère est textuel — visa, sommaire ou titrage — et non
la date : un arrêt de 2024 peut juger un comité d'entreprise."""
import json, re
D = json.load(open("cse_textes.json"))
# Les expressions ne désignent que le CSE : elles suffisent, quelle que soit la date.
# « conseil d'entreprise » au sens de L. 2321-1 n'existe que depuis 2018 : avant,
# l'expression désigne autre chose (une décision de 1997 visait un cabinet de conseil).
NOM = re.compile(r"comité social et économique|"
                 r"représentant de proximité|conseil d'entreprise|"
                 r"commission santé, sécurité et conditions de travail", re.I)
# Les numéros L. 2311-x à L. 2317-x désignaient d'autres institutions avant 2018 :
# ils ne valent rattachement que pour les décisions postérieures à leur entrée en vigueur.
NUM = re.compile(r"L\.? ?231[1-7]-|L\.? ?2321-", re.I)
BASCULE = "2018-01-01"
ANC = re.compile(r"comité d'entreprise|délégué[s]? du personnel|CHSCT|"
                 r"comité d'hygiène, de sécurité|L\.? ?232[0-9]-|L\.? ?2325-|L\.? ?4612-", re.I)
gard, ecart = {}, {}
for i, d in D.items():
    champ = " \n ".join(filter(None, [d.get("visa"), d.get("sommaire"),
                                      " · ".join(d.get("themes") or [])]))
    if d["date"] >= BASCULE and (NOM.search(champ or "") or NUM.search(champ or "")):
        gard[i] = d
    else:
        # second passage : le texte intégral, moins fiable, mais on trace
        t = d.get("texte") or ""
        d["_via_texte"] = bool(NOM.search(t))
        ecart[i] = d
json.dump(gard, open("cse_corpus.json", "w"), ensure_ascii=False)
print(f"lues        : {len(D)}")
print(f"retenues    : {len(gard)}   (CSE dans le visa, le sommaire ou le titrage)")
print(f"écartées    : {len(ecart)}  dont {sum(1 for d in ecart.values() if d['_via_texte'])} "
      f"ne citent le CSE que dans le corps de l'arrêt")
an = [d for d in gard.values() if ANC.search(" ".join(filter(None,[d.get('visa'),d.get('sommaire')])) or "")]
print(f"retenues citant aussi une institution ancienne : {len(an)}")
ds = sorted(d["date"] for d in gard.values())
print(f"période     : {ds[0]} → {ds[-1]}")
from collections import Counter
print("par année   :", dict(sorted(Counter(d['date'][:4] for d in gard.values()).items())))
print("sans sommaire :", sum(1 for d in gard.values() if not d.get("sommaire")))
