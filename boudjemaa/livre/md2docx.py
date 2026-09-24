# -*- coding: utf-8 -*-
"""Transforme livre.md en liste d'elements pour word_py.py."""
import json, re, sys

src = open(sys.argv[1], encoding='utf-8').read().split("\n")
out = []
i = 0
premier_titre = True
bloc_cit = []
bloc_puce = []

def vider_cit():
    global bloc_cit
    if bloc_cit:
        out.append({"k": "cit", "t": " ".join(bloc_cit).strip()})
        bloc_cit = []

def vider_puce():
    global bloc_puce
    for t in bloc_puce:
        out.append({"k": "puce", "t": t})
    bloc_puce = []

para = []
def vider_para():
    global para
    if para:
        out.append({"k": "p", "t": " ".join(para).strip()})
        para = []

for ligne in src:
    l = ligne.rstrip()
    if l.startswith("> "):
        vider_para(); vider_puce()
        txt = l[2:].strip()
        if txt == "":
            vider_cit()
        else:
            bloc_cit.append(txt)
        continue
    if l.strip() == ">":
        vider_cit(); continue
    vider_cit()
    if l.startswith("- "):
        vider_para()
        bloc_puce.append(l[2:].strip())
        continue
    if l.startswith("  ") and bloc_puce:
        bloc_puce[-1] += " " + l.strip()
        continue
    vider_puce()
    if l.strip() == "":
        vider_para(); continue
    if l.strip() == "---":
        vider_para()
        out.append({"k": "saut"})
        continue
    if l.startswith("### "):
        vider_para(); out.append({"k": "h3", "t": l[4:].strip()}); continue
    if l.startswith("## "):
        vider_para()
        t = l[3:].strip()
        if premier_titre and out and out[-1]["k"] == "t1":
            out.append({"k": "sur", "t": t}); continue
        out.append({"k": "h2", "t": t}); continue
    if l.startswith("# "):
        vider_para()
        t = l[2:].strip()
        if premier_titre:
            out.append({"k": "t1", "t": t}); premier_titre = False
        else:
            out.append({"k": "h1", "t": t})
        continue
    m = re.match(r"^\*\*(.+?)\*\*(.*)$", l.strip())
    if m:
        vider_para()
        out.append({"k": "h3", "t": m.group(1).strip().rstrip(".")})
        reste = m.group(2).strip()
        if reste:
            para.append(reste)
        continue
    m = re.match(r"^(\d+)\.\s+(.*)$", l.strip())
    if m:
        vider_para()
        out.append({"k": "puce", "t": m.group(1) + ". " + m.group(2).strip()})
        continue
    para.append(l.strip())

vider_para(); vider_puce(); vider_cit()

# un saut de page avant chaque titre de chapitre, jamais deux de suite
net = []
for e in out:
    if e["k"] == "saut" and net and net[-1]["k"] == "saut":
        continue
    net.append(e)
while net and net[-1]["k"] == "saut":
    net.pop()

def nettoyer(t):
    t = t.replace("**", "")
    t = re.sub(r"\s+", " ", t)
    return t.strip()

for e in net:
    for cle in ("t", "titre"):
        if cle in e and isinstance(e[cle], str):
            e[cle] = nettoyer(e[cle])

json.dump(net, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(net), "elements")
