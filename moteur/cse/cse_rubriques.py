"""Classement des 164 arrêts sur les rubriques du plan. Le rattachement se fait
d'abord par le visa — c'est le texte que la Cour a elle-même appliqué — puis, à
défaut, par le titrage. Un arrêt sans rattachement est signalé, non deviné."""
import json, re
from collections import Counter, defaultdict

RUB = [
 ("A", "Mise en place, périmètre, établissements distincts et unité économique et sociale",
  [(2313,1,9),(2311,1,2)], r"unité économique et sociale|établissements distincts|périmètre|mise en place"),
 ("B", "Élections professionnelles",
  [(2314,1,40)], r"élection|protocole d'accord préélectoral|collège|candidat|électorat|éligibilité|liste"),
 ("C", "Attributions générales et consultations ponctuelles",
  [(2312,1,16),(2312,37,84)], r"consultation ponctuelle|marche générale|activités sociales|restructuration"),
 ("D", "Consultations récurrentes et base de données",
  [(2312,17,36)], r"orientations stratégiques|situation économique et financière|politique sociale|base de données"),
 ("E", "Fonctionnement, moyens et heures de délégation",
  [(2315,1,35)], r"heures de délégation|ordre du jour|procès-verbal|règlement intérieur|réunion|personnalité civile"),
 ("F", "Commission santé, sécurité et conditions de travail et représentants de proximité",
  [(2315,36,45),(2313,7,7)], r"santé, sécurité et conditions de travail|représentant de proximité"),
 ("G", "Budgets — fonctionnement et activités sociales et culturelles",
  [(2315,61,77)], r"budget|subvention de fonctionnement|masse salariale|activités sociales et culturelles"),
 ("H", "Expertises",
  [(2315,78,96)], r"expert|expertise"),
 ("I", "Comité central, comités d'établissement et conseil d'entreprise",
  [(2316,1,30),(2321,1,12)], r"comité social et économique central|comité .{0,20}d'établissement|conseil d'entreprise"),
 ("J", "Délit d'entrave",
  [(2317,1,6)], r"entrave"),
 ("K", "Statut protecteur des élus et désignations syndicales",
  [(2411,1,30),(2421,1,20),(2143,1,25),(2142,1,10)], r"salarié protégé|délégué syndical|section syndicale|désignation"),
]
D = json.load(open("cse_corpus.json"))
def refs(d):
    """Le visa d'abord ; à défaut, le sommaire, où la Cour énonce les textes appliqués."""
    v = " ".join(filter(None, [d.get("visa"), " · ".join(d.get("themes") or []), d.get("sommaire")]))
    return [(int(a), int(b)) for _, a, b in re.findall(r"\b([LRD])\.? ?(2[0-9]{3})-(\d+)", v)]
def rubrique(d):
    r = refs(d); score = Counter()
    for code, lib, plages, mot in RUB:
        for (t, n) in r:
            for (pt, a, b) in plages:
                if t == pt and a <= n <= b: score[code] += 3
        champ = " ".join(filter(None, [d.get("sommaire"), " ".join(d.get("themes") or [])]))
        if re.search(mot, champ or "", re.I): score[code] += 1
    return score.most_common(1)[0][0] if score else None
out = defaultdict(list); orphelins = []
for i, d in D.items():
    c = rubrique(d)
    (out[c] if c else orphelins).append(d)
    d["rubrique"] = c
json.dump(D, open("cse_corpus.json", "w"), ensure_ascii=False)
tot = 0
for code, lib, _, _ in RUB:
    n = len(out.get(code, [])); tot += n
    print(f"  {code}  {n:>4}  {lib}")
print(f"\n  classés : {tot} · orphelins : {len(orphelins)} · total {len(D)}")
for d in orphelins[:8]:
    print("   orphelin :", d["date"], d["num"], "|", (d.get("sommaire") or "(sans sommaire)")[:110])
