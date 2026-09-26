# -*- coding: utf-8 -*-
"""Construit le livre : page de gauche le texte, page de droite le document."""
import os
from docx import Document
from docx.enum.section import WD_SECTION
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Pt, RGBColor, Cm, Emu
from PIL import Image

import pages

BLEU = RGBColor(0x1F, 0x38, 0x64)
GRIS = RGBColor(0x5F, 0x68, 0x74)
ENCRE = RGBColor(0x16, 0x18, 0x1D)

LARGEUR_UTILE = Cm(16.6)
HAUTEUR_IMAGE = Cm(17.5)

ANNEXE = [
 ("PetitParisien-1939-portrait.jpg",
  "Le portrait en pied, sans la légende du journal.",
  "Le Petit Parisien, 27 avril 1939, page 6. Gallica, ark:/12148/bpt6k6836529."),
 ("SR-Colmar-1938-equipe.jpg",
  "S. R. Colmar, la photographie seule, sans la page.",
  "Le Miroir des sports, 25 octobre 1938, page 7. Gallica, ark:/12148/bpt6k97963516."),
]

RESTE = [
 ("L'acte de décès de Colmar, numéro 464 de l'année 1947",
  "Photocopie certifiée conforme le 29 novembre 2012 par Pauline Beringer. Dossier de l'auteur, fichier « Boudjemaa acte de deces.jpg »."),
 ("La notice numéro 54 du répertoire des joueurs de l'A.S. Saint-Étienne",
  "D'après l'ouvrage de Jean Vieillard. Dossier de l'auteur, fichier « ASSE.jpg »."),
 ("L'Éclaireur du Soir, Nice, 1er août 1936, « La justice et le droit ont eu raison dans l'affaire Boudjemaa »",
  "Signé Émile Laurence. Dossier de l'auteur, fichier « affaire Boudjemaa EC Soir 1-8-1936.jpg »."),
 ("L'Éclaireur de Nice, 13 septembre 1936, « Boudjemaa demeure qualifié à l'O.G.C. Nice »",
  "Dossier de l'auteur, fichier « affaire Boudjemaa (qualifie EC 13 09 1936).jpg »."),
 ("L'Éclaireur de Nice, 6 octobre 1936, « L'affaire du joueur Boudjema »",
  "Signé Raoul Sabatié. Dossier de l'auteur, fichier « affaire Boudjemaa EC 06 10 1936.jpg »."),
 ("La fiche de l'OGC Nice",
  "Communiquée par Monsieur Serge Gloumeaud. Nom exact, date et lieu de naissance, club formateur."),
 ("Le Mémorial, Saint-Étienne, 14 juillet 1936, 21 août 1937, 8 et 23 mai 1938, 23 juin et 2 juillet 1938",
  "Gallica refuse la reproduction en image de ce titre : les pages reviennent en erreur 403. Le texte seul est reproductible. Arks : bpt6k4880497m, bpt6k48808955, bpt6k4881151w, bpt6k4881169k, bpt6k4881200x, bpt6k4881209n."),
 ("L'Auto-vélo, 8 mars 1937, « Boudjemaa a été demandé par un club écossais »",
  "Page 8. Fac-similé à refabriquer à partir de liste.json."),
 ("L'Auto-vélo, 7 mai 1941, Tunisie contre France",
  "« Djema Djema », la « vedette locale ». Fac-similé à refabriquer à partir de liste.json."),
 ("Ce soir, 28 juin 1945, « rentré de captivité »",
  "Fac-similé à refabriquer à partir de liste.json."),
 ("La carte de Tunisie au 1/50 000, feuille Béja numéro 18",
  "Army Map Service, War Office, 1942, d'après une carte française de 1936. Perry-Castañeda Map Collection, université du Texas."),
 ("La page des résultats du football tunisien du 24 octobre 1949",
  "Elle porte l'U.S. Béja et l'Olympique de Béja le même jour. Dossier de l'auteur, fichier « Tunisie-France_ 24 octobre 1949 US beja et OB deux equipes différentes.pdf »."),
]

A_FOURNIR = [
 "Les noms des joueurs de son enfance à Béja.",
 "Ce que l'auteur sait de Mounir Ben Sakhria.",
 "Ce qu'il a sur le tournoi Boudjemaa et sur Hamadi Agrebi.",
]

A_CHERCHER = [
 "Sa carrière en Tunisie avant 1935, au-delà du match de Souk-Ahras du 30 juillet 1932.",
 "Le prénom de Martinelli, et son départ pour les Amériques.",
 "La composition de l'équipe de Saint-Étienne à chacun de ses matchs.",
 "Où et quand il a été fait prisonnier.",
 "La localisation d'El Henaïa, par l'acte de naissance, le registre foncier tunisien ou les listes de bureaux de vote de l'ISIE.",
 "Les photographies que détient Yvan Beck : les originaux et une caricature. Et la photographie d'effectif 1937-1938 de l'A.S.S.E.",
 "La copie de sa lettre en arabe à la Fédération.",
 "Le lieu de sa sépulture.",
]


def par(doc, texte="", taille=11, gras=False, italique=False, couleur=None,
        avant=0, apres=6, align=None, interligne=1.15):
    p = doc.add_paragraph()
    pf = p.paragraph_format
    pf.space_before = Pt(avant)
    pf.space_after = Pt(apres)
    pf.line_spacing = interligne
    pf.widow_control = True
    if align is not None:
        p.alignment = align
    r = p.add_run(texte)
    r.font.size = Pt(taille)
    r.bold = gras
    r.italic = italique
    r.font.color.rgb = couleur if couleur is not None else ENCRE
    return p


def barre_gauche(p):
    pr = p._p.get_or_add_pPr()
    bd = OxmlElement("w:pBdr")
    g = OxmlElement("w:left")
    g.set(qn("w:val"), "single")
    g.set(qn("w:sz"), "12")
    g.set(qn("w:space"), "10")
    g.set(qn("w:color"), "1F3864")
    bd.append(g)
    pr.append(bd)


def cadre(p, fond="F4F6FB"):
    pr = p._p.get_or_add_pPr()
    sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear")
    sh.set(qn("w:fill"), fond)
    pr.append(sh)
    bd = OxmlElement("w:pBdr")
    for cote in ("top", "left", "bottom", "right"):
        e = OxmlElement("w:" + cote)
        e.set(qn("w:val"), "single")
        e.set(qn("w:sz"), "6")
        e.set(qn("w:space"), "10")
        e.set(qn("w:color"), "BFC6D4")
        bd.append(e)
    pr.append(bd)


def filet(p):
    pr = p._p.get_or_add_pPr()
    bd = OxmlElement("w:pBdr")
    b = OxmlElement("w:bottom")
    b.set(qn("w:val"), "single")
    b.set(qn("w:sz"), "6")
    b.set(qn("w:space"), "6")
    b.set(qn("w:color"), "1F3864")
    bd.append(b)
    pr.append(bd)


def numeros_de_page(section):
    p = section.footer.paragraphs[0]
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run()
    for instr in ("begin", "instrText", "end"):
        e = OxmlElement("w:fldChar" if instr != "instrText" else "w:instrText")
        if instr == "instrText":
            e.set(qn("xml:space"), "preserve")
            e.text = " PAGE "
        else:
            e.set(qn("w:fldCharType"), instr)
        r._r.append(e)
    r.font.size = Pt(9)
    r.font.color.rgb = GRIS


def page_image(doc, fichier, legende, source):
    im = Image.open(fichier)
    l, h = im.size
    larg = LARGEUR_UTILE
    haut = Emu(int(larg * h / l))
    if haut > HAUTEUR_IMAGE:
        haut = HAUTEUR_IMAGE
        larg = Emu(int(haut * l / h))
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(10)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.keep_with_next = True
    p.add_run().add_picture(fichier, width=larg)
    q = par(doc, legende, taille=10, gras=True, couleur=BLEU,
            align=WD_ALIGN_PARAGRAPH.CENTER, apres=3)
    q.paragraph_format.keep_with_next = True
    par(doc, source, taille=8.5, couleur=GRIS,
        align=WD_ALIGN_PARAGRAPH.CENTER, apres=14)


def page_reserve(doc, legende, source):
    p = par(doc, "Document à insérer", taille=10, gras=True, couleur=BLEU,
            align=WD_ALIGN_PARAGRAPH.CENTER, avant=14, apres=4)
    cadre(p)
    p = par(doc, legende, taille=11, align=WD_ALIGN_PARAGRAPH.CENTER, apres=4)
    cadre(p)
    p = par(doc, source, taille=8.5, couleur=GRIS,
            align=WD_ALIGN_PARAGRAPH.CENTER, apres=14)
    cadre(p)


def construire(sortie="Boudjemaa-livre.docx"):
    doc = Document()
    n = doc.styles["Normal"]
    n.font.name = "Calibri"
    n.font.size = Pt(11)
    n.font.color.rgb = ENCRE

    s = doc.sections[0]
    s.left_margin = s.right_margin = Cm(2.2)
    s.top_margin = Cm(2.0)
    s.bottom_margin = Cm(1.8)
    numeros_de_page(s)

    # page de titre
    par(doc, "BOUDJEMAA", taille=34, gras=True, couleur=ENCRE,
        align=WD_ALIGN_PARAGRAPH.CENTER, apres=6)
    p = par(doc, "Mohamed Boudjemaa, de Béja à Colmar", taille=14, couleur=GRIS,
            align=WD_ALIGN_PARAGRAPH.CENTER, apres=20)
    filet(p)
    par(doc, "Mounir CHIKHAOUI", taille=13, gras=True,
        align=WD_ALIGN_PARAGRAPH.CENTER, avant=30, apres=0)

    # dédicace
    par(doc, "À Mounir Ben Sakhria,", taille=13, italique=True,
        align=WD_ALIGN_PARAGRAPH.CENTER, avant=34, apres=2)
    par(doc, "désigné président, décédé en juin 2025.", taille=13, italique=True,
        align=WD_ALIGN_PARAGRAPH.CENTER, apres=0)

    # avertissement
    par(doc, "AVERTISSEMENT", taille=10, couleur=GRIS, avant=34, apres=2)
    p = par(doc, "Comment ce livre est fait", taille=16, gras=True, couleur=BLEU,
            avant=0, apres=12)
    filet(p)
    for t in [
        "Le texte court d'un bout à l'autre, sans interruption. Chaque fois qu'il s'appuie sur une pièce, la copie de l'article ou la photographie vient juste après, à sa place dans la lecture, avec sa légende et sa référence complète.",
        "Rien n'est affirmé ici qui n'ait été lu à la source. Chaque citation porte son journal, sa date, sa page et, quand la pièce est numérisée, l'identifiant qui permet de la retrouver.",
        "Quand un cadre remplace une image, c'est que le document existe mais n'est pas reproductible en l'état : soit il est dans le dossier de l'auteur et non dans le fonds numérisé, soit la Bibliothèque nationale de France en refuse la reproduction. La référence est alors donnée telle quelle, pour que la pièce soit insérée à cet endroit.",
        "Les documents qui ne sont pas exploités dans le texte sont reportés à l'annexe, à la fin du volume, avec leurs références.",
        "Trois parties de l'introduction restent à écrire par l'auteur, et elles sont signalées à leur place : les joueurs de son enfance à Béja, Mounir Ben Sakhria, et le tournoi Boudjemaa.",
    ]:
        par(doc, t, align=WD_ALIGN_PARAGRAPH.JUSTIFY, apres=8)

    chapitre_courant = None
    vus = set()
    for sp in pages.SPREADS:
        if sp["ch"] != chapitre_courant and sp["ch"] not in vus:
            chapitre_courant = sp["ch"]
            vus.add(sp["ch"])
            p = par(doc, chapitre_courant, taille=20, gras=True, couleur=BLEU,
                    avant=30, apres=16)
            filet(p)
            p.paragraph_format.keep_with_next = True

        p = par(doc, sp["titre"], taille=14, gras=True, couleur=BLEU,
                avant=16, apres=8)
        p.paragraph_format.keep_with_next = True
        for t in sp["t"]:
            if t.startswith("> "):
                q = par(doc, t[2:], taille=10.5, avant=4, apres=8,
                        align=WD_ALIGN_PARAGRAPH.JUSTIFY)
                q.paragraph_format.left_indent = Cm(0.9)
                q.paragraph_format.right_indent = Cm(0.4)
                barre_gauche(q)
            else:
                par(doc, t, align=WD_ALIGN_PARAGRAPH.JUSTIFY, apres=8)

        if sp["fac"]:
            page_image(doc, os.path.join("fac", sp["fac"]), sp["leg"], sp["src"])
        else:
            page_reserve(doc, sp["leg"], sp["src"])

    # annexe
    p = par(doc, "ANNEXE", taille=20, gras=True, couleur=BLEU, avant=32, apres=6)
    filet(p)
    p.paragraph_format.keep_with_next = True
    p = par(doc, "Les documents qui ne sont pas exploités en regard du texte",
            taille=11, couleur=GRIS, apres=10)
    p.paragraph_format.keep_with_next = True

    for fichier, legende, source in ANNEXE:
        chemin = os.path.join("fac", fichier)
        if not os.path.exists(chemin):
            chemin = os.path.join("..", "photos", fichier)
        page_image(doc, chemin, legende, source)

    p = par(doc, "Les pièces à insérer, et où elles sont", taille=14, gras=True,
            couleur=BLEU, avant=16, apres=8)
    p.paragraph_format.keep_with_next = True
    filet(p)
    for titre, source in RESTE:
        p = par(doc, titre, taille=11, gras=True, apres=2)
        p.paragraph_format.keep_with_next = True
        par(doc, source, taille=9.5, couleur=GRIS, apres=10)

    p = par(doc, "Ce que l'auteur doit donner", taille=14, gras=True,
            couleur=BLEU, avant=16, apres=8)
    p.paragraph_format.keep_with_next = True
    for t in A_FOURNIR:
        par(doc, "- " + t, apres=5)
    p = par(doc, "Ce qui reste à chercher", taille=14, gras=True, couleur=BLEU,
            avant=16, apres=8)
    p.paragraph_format.keep_with_next = True
    for t in A_CHERCHER:
        par(doc, "- " + t, apres=5)

    p = par(doc, "État de la lecture au 26 septembre 2026", taille=14,
            gras=True, couleur=BLEU, avant=16, apres=8)
    p.paragraph_format.keep_with_next = True
    for t in [
        "312 pages de journaux lues ligne par ligne.",
        "382 numéros des Colmarer neueste Nachrichten, juillet 1938 - décembre 1939, interrogés un par un ; quinze le nomment, quatre articles lui sont consacrés, tous lus sur l'image et traduits.",
        "937 numéros du Mémorial, quotidien de Saint-Étienne, juin 1936 - janvier 1939, interrogés un par un ; quarante et un le nomment. La reproduction en image de ce titre est refusée par la Bibliothèque nationale de France.",
        "150 numéros du Forez sportif, 1936-1939, interrogés ; sept le nomment.",
        "114 numéros de L'Alsace et des Dernières Nouvelles d'Alsace autour de sa mort : aucune mention.",
        "20 numéros de La Tribune de l'Aube, Troyes, portent le nom ; quatorze sont bien lui, six sont des homonymes de la rubrique des tribunaux. La reproduction en image de ce titre est refusée : le texte a été reconstitué par fenêtres de recherche, et non lu sur la page.",
        "La presse niçoise n'est pas numérisée : ni L'Éclaireur de Nice ni Le Petit Niçois ne sont accessibles pour 1935-1937. Les citations niçoises de ce livre viennent des coupures communiquées par l'OGC Nice et par l'auteur.",
    ]:
        par(doc, "- " + t, apres=5)

    # repertoire complet des articles
    import re as _re
    rep = open("../repertoire-des-articles.md", encoding="utf-8").read().split("\n")
    p = par(doc, "RÉPERTOIRE DE TOUS LES ARTICLES", taille=20, gras=True,
            couleur=BLEU, avant=32, apres=6)
    filet(p)
    p.paragraph_format.keep_with_next = True
    p = par(doc, "Tous ceux où son nom figure, dans l'ordre du temps",
            taille=11, couleur=GRIS, apres=10)
    p.paragraph_format.keep_with_next = True
    attente = None
    for ligne in rep:
        l = ligne.rstrip()
        if l.startswith("## "):
            p = par(doc, l[3:].strip(), taille=13, gras=True, couleur=BLEU,
                    avant=12, apres=6)
            filet(p)
            p.paragraph_format.keep_with_next = True
            continue
        m = _re.match(r"\*\*(.+)\*\*$", l)
        if m:
            attente = m.group(1)
            continue
        if attente and l.strip():
            q = doc.add_paragraph()
            q.paragraph_format.space_before = Pt(6)
            q.paragraph_format.space_after = Pt(2)
            q.paragraph_format.line_spacing = 1.1
            r = q.add_run(attente)
            r.font.size = Pt(9.5); r.bold = True; r.font.color.rgb = ENCRE
            q.paragraph_format.keep_with_next = True
            w = par(doc, l.strip(), taille=9.5, couleur=GRIS, apres=4,
                    align=WD_ALIGN_PARAGRAPH.JUSTIFY, interligne=1.05)
            w.paragraph_format.left_indent = Cm(0.5)
            attente = None

    c = doc.core_properties
    c.author = "Mounir CHIKHAOUI"
    c.last_modified_by = "Mounir CHIKHAOUI"
    c.title = "Boudjemaa"
    c.subject = "Mohamed Boudjemaa, de Béja à Colmar"
    c.comments = ""
    c.category = ""
    c.keywords = ""
    doc.save(sortie)
    return sortie


if __name__ == "__main__":
    f = construire()
    print(f, "écrit")
