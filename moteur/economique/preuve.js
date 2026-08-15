/* Le niveau de preuve, distinct de l'état du contrôle.
   Un fait peut être exact et non prouvé : ce sont deux questions, et les
   confondre revient à traiter une affirmation comme un document. */
const NIV = {
  PIECE:   "pièce produite",
  DECLARE: "déclaré, non justifié",
  MANQUANT:"donnée manquante",
  PRO:     "à vérifier par un professionnel",
};
/* Le registre : chaque pièce reçue, avec ce qu'elle alimente. */
const REGISTRE = [
 ["P-001","Convention collective, texte intégral à jour","convention",["SOC-06","CTL-CCN-01","CTL-CCN-02"],"Normes conventionnelles"],
 ["P-002","Accords d'entreprise applicables","accordsJoints",["SOC-11","CTL-CCN-01"],"Normes conventionnelles"],
 ["P-003","Liasse fiscale et comptes annuels","liasse",["ECO-1-01","CTL-ECO-01"],"Motif économique"],
 ["P-004","Comptes consolidés du groupe","comptes-groupe",["SOC-02","CTL-PSE-02"],"Périmètre et plan de sauvegarde de l'emploi"],
 ["P-005","État daté des postes disponibles","etat-postes",["SOC-05","CTL-REC-01","CTL-REC-02"],"Reclassement"],
 ["P-006","Attestation d'absence de poste disponible","attestation-absence-poste",["SOC-05","CTL-REC-04"],"Reclassement"],
 ["P-007","Offres de reclassement écrites","offres",["PRO-03","CTL-REC-03"],"Reclassement"],
 ["P-008","Document des sept renseignements au comité, avec décharge","renseignements-cse",["SOC-08","CTL-CSE-03"],"Procédure"],
 ["P-009","Procès-verbaux des réunions du comité","pv-cse",["CTL-CSE-01","CTL-CSE-04"],"Procédure"],
 ["P-010","Projet de plan de sauvegarde de l'emploi","pse",["CTL-PSE-01","CTL-PSE-03"],"Plan de sauvegarde de l'emploi"],
 ["P-011","Décision de validation ou d'homologation","decision-admin",["CTL-PSE-04"],"Plan de sauvegarde de l'emploi"],
 ["P-012","Autorisations de l'inspecteur du travail","autorisations",["CTL-PRT-01"],"Salariés protégés"],
 ["P-013","Grille des critères d'ordre et classement","grille-ordre",["SOC-06","ORD-01"],"Ordre des licenciements"],
 ["P-014","Bulletins de paie des douze derniers mois","bulletins",["IND-01","IND-02"],"Indemnités"],
 ["P-015","Registre unique du personnel","registre",["SOC-08"],"Effectifs et seuils"],
];
const aPiece=(f,c)=>Array.isArray(f.pieces)&&f.pieces.includes(c);
function niveau(f,cle,renseigne){
  if(aPiece(f,cle)) return NIV.PIECE;
  if(renseigne) return NIV.DECLARE;
  return NIV.MANQUANT;
}
function registre(f){
  return REGISTRE.map(([id,lib,cle,regles,rub])=>({
    id, piece:lib, rubrique:rub, regles,
    statut: (f[cle]===true||aPiece(f,cle)) ? "reçue" : "à produire",
    date: (f.datesPieces||{})[cle] || "—",
    version: (f.versionsPieces||{})[cle] || "—",
  }));
}
module.exports={NIV,REGISTRE,niveau,registre,aPiece};
