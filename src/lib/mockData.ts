import {
  User,
  EntiteMorale,
  Substance,
  Permis,
  Procedure,
  EtapeProcedure,
  Document,
  DecisionComite,
  Actionnaire,
  StructureActionnariale,
  Notification,
  DashboardStats,
  PermisSubstance,
  PerimetrePoint,
} from "@/types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@mines.dz",
    name: "Ahmed Bencheikh",
    role: "administrator",
  },
  {
    id: "2",
    email: "agent@cadastre.dz",
    name: "Fatima Benaissa",
    role: "cadastre_agent",
  },
  {
    id: "3",
    email: "comite@mines.dz",
    name: "Mohamed Zitouni",
    role: "committee_member",
  },
  {
    id: "4",
    email: "contact@minexalgeria.com",
    name: "Jean Dubois",
    role: "operator",
    entiteMoraleId: "1",
  },
];

export const mockEntitesMorales: EntiteMorale[] = [
  {
    id: "1",
    raisonSociale: "MINEX ALGERIA SARL",
    formeJuridique: "SARL",
    numeroRC: "2023B0145789",
    adresse: "Zone Industrielle, Alger",
    email: "contact@minexalgeria.com",
    telephone: "+213 21 45 67 89",
    representantLegal: "Jean Dubois",
    dateCreation: new Date("2023-01-15"),
  },
  {
    id: "2",
    raisonSociale: "GOLD MINES CORPORATION",
    formeJuridique: "SPA",
    numeroRC: "2022B0234567",
    adresse: "Rue des Mines, Oran",
    email: "info@goldmines.dz",
    telephone: "+213 41 23 45 67",
    representantLegal: "Sarah Johnson",
    dateCreation: new Date("2022-03-10"),
  },
  {
    id: "3",
    raisonSociale: "COPPER EXTRACTION SARL",
    formeJuridique: "SARL",
    numeroRC: "2024B0098765",
    adresse: "Boulevard Minier, Constantine",
    email: "direction@copperext.dz",
    telephone: "+213 31 87 65 43",
    representantLegal: "Karim Mansouri",
    dateCreation: new Date("2024-02-20"),
  },
];

export const mockSubstances: Substance[] = [
  { id: "1", nom: "Or", symbole: "Au", famille: "Métaux précieux" },
  { id: "2", nom: "Cuivre", symbole: "Cu", famille: "Métaux de base" },
  { id: "3", nom: "Argent", symbole: "Ag", famille: "Métaux précieux" },
  { id: "4", nom: "Zinc", symbole: "Zn", famille: "Métaux de base" },
  { id: "5", nom: "Plomb", symbole: "Pb", famille: "Métaux de base" },
  { id: "6", nom: "Fer", symbole: "Fe", famille: "Métaux ferreux" },
  {
    id: "7",
    nom: "Phosphate",
    symbole: "PO4",
    famille: "Minéraux industriels",
  },
  {
    id: "8",
    nom: "Calcaire",
    symbole: "CaCO3",
    famille: "Matériaux de construction",
  },
];

export const mockPerimetrePoints: PerimetrePoint[] = [
  { id: "1", permisId: "1", x: 34.52, y: 1.34, z: 0, ordre: 1 },
  { id: "2", permisId: "1", x: 34.53, y: 1.34, z: 0, ordre: 2 },
  { id: "3", permisId: "1", x: 34.53, y: 1.35, z: 0, ordre: 3 },
  { id: "4", permisId: "1", x: 34.52, y: 1.35, z: 0, ordre: 4 },
  { id: "5", permisId: "2", x: 35.12, y: 2.15, z: 0, ordre: 1 },
  { id: "6", permisId: "2", x: 35.14, y: 2.15, z: 0, ordre: 2 },
  { id: "7", permisId: "2", x: 35.14, y: 2.18, z: 0, ordre: 3 },
  { id: "8", permisId: "2", x: 35.12, y: 2.18, z: 0, ordre: 4 },
];

export const mockPermisSubstances: PermisSubstance[] = [
  {
    id: "1",
    permisId: "1",
    substanceId: "1",
    substance: mockSubstances[0],
    dateAjout: new Date("2025-01-01"),
  },
  {
    id: "2",
    permisId: "1",
    substanceId: "2",
    substance: mockSubstances[1],
    dateAjout: new Date("2025-01-01"),
  },
  {
    id: "3",
    permisId: "2",
    substanceId: "3",
    substance: mockSubstances[2],
    dateAjout: new Date("2024-12-15"),
  },
  {
    id: "4",
    permisId: "3",
    substanceId: "4",
    substance: mockSubstances[3],
    dateAjout: new Date("2024-11-10"),
  },
];

export const mockPermis: Permis[] = [
  {
    id: "1",
    code: "PM-2025-001",
    entiteMoraleId: "1",
    entiteMorale: mockEntitesMorales[0],
    statut: "valide",
    dateDelivrance: new Date("2025-01-01"),
    dateExpiration: new Date("2030-01-01"),
    perimetre: mockPerimetrePoints.filter((p) => p.permisId === "1"),
    substances: mockPermisSubstances.filter((s) => s.permisId === "1"),
    procedures: [],
  },
  {
    id: "2",
    code: "PM-2024-028",
    entiteMoraleId: "2",
    entiteMorale: mockEntitesMorales[1],
    statut: "valide",
    dateDelivrance: new Date("2024-12-15"),
    dateExpiration: new Date("2029-12-15"),
    perimetre: mockPerimetrePoints.filter((p) => p.permisId === "2"),
    substances: mockPermisSubstances.filter((s) => s.permisId === "2"),
    procedures: [],
  },
  {
    id: "3",
    code: "PM-2024-015",
    entiteMoraleId: "3",
    entiteMorale: mockEntitesMorales[2],
    statut: "expire",
    dateDelivrance: new Date("2024-11-10"),
    dateExpiration: new Date("2024-12-10"),
    perimetre: [],
    substances: mockPermisSubstances.filter((s) => s.permisId === "3"),
    procedures: [],
  },
];

export const mockEtapesProcedure: EtapeProcedure[] = [
  {
    id: "1",
    procedureId: "1",
    type: "verification_dossier",
    statut: "terminee",
    dateDebut: new Date("2025-01-10"),
    dateFin: new Date("2025-01-12"),
    commentaire: "Dossier complet, tous les documents requis sont présents",
    agentId: "2",
    fichiersSupportant: [],
  },
  {
    id: "2",
    procedureId: "1",
    type: "empietement_check",
    statut: "terminee",
    dateDebut: new Date("2025-01-12"),
    dateFin: new Date("2025-01-14"),
    commentaire: "Aucun empietement détecté",
    agentId: "2",
    fichiersSupportant: [],
  },
  {
    id: "3",
    procedureId: "1",
    type: "rapport_police",
    statut: "en_attente",
    dateDebut: new Date("2025-01-14"),
    agentId: "2",
    fichiersSupportant: [],
  },
];

export const mockDocuments: Document[] = [
  {
    id: "1",
    procedureId: "1",
    type: "registre_commerce",
    nom: "RC_MINEX_ALGERIA.pdf",
    statut: "valide",
    dateUpload: new Date("2025-01-10"),
    cheminFichier: "/documents/rc_minex.pdf",
  },
  {
    id: "2",
    procedureId: "1",
    type: "statuts",
    nom: "Statuts_MINEX_2023.pdf",
    statut: "valide",
    dateUpload: new Date("2025-01-10"),
    cheminFichier: "/documents/statuts_minex.pdf",
  },
  {
    id: "3",
    procedureId: "1",
    type: "note_technique",
    nom: "Note_Technique_Exploitation.pdf",
    statut: "en_attente",
    dateUpload: new Date("2025-01-10"),
    cheminFichier: "/documents/note_tech.pdf",
  },
];

export const mockDecisionsComite: DecisionComite[] = [
  {
    id: "1",
    procedureId: "2",
    decision: "approuve",
    dateDecision: new Date("2024-12-20"),
    membreId: "3",
    commentaire: "Dossier conforme aux exigences réglementaires",
    noteDecision: "Attribution approuvée pour une durée de 5 ans",
  },
];

export const mockProcedures: Procedure[] = [
  {
    id: "1",
    code: "PR-2025-017",
    type: "substitution",
    statut: "en_cours",
    dateCreation: new Date("2025-01-10"),
    permisId: "1",
    permis: mockPermis[0],
    entiteMoraleId: "1",
    entiteMorale: mockEntitesMorales[0],
    etapes: mockEtapesProcedure,
    documents: mockDocuments,
    decisionsComite: [],
  },
  {
    id: "2",
    code: "PR-2024-234",
    type: "demande",
    statut: "terminee",
    dateCreation: new Date("2024-12-01"),
    entiteMoraleId: "2",
    entiteMorale: mockEntitesMorales[1],
    etapes: [],
    documents: [],
    decisionsComite: mockDecisionsComite,
  },
  {
    id: "3",
    code: "PR-2025-045",
    type: "renouvellement",
    statut: "en_cours",
    dateCreation: new Date("2025-01-15"),
    permisId: "2",
    permis: mockPermis[1],
    entiteMoraleId: "2",
    entiteMorale: mockEntitesMorales[1],
    etapes: [],
    documents: [],
    decisionsComite: [],
  },
];

export const mockActionnaires: Actionnaire[] = [
  {
    id: "1",
    entiteMoraleId: "1",
    nom: "Jean Dubois",
    type: "physique",
    participationPourcentage: 60,
    dateEntree: new Date("2023-01-15"),
  },
  {
    id: "2",
    entiteMoraleId: "1",
    nom: "INVEST CORP",
    type: "morale",
    participationPourcentage: 40,
    dateEntree: new Date("2023-01-15"),
  },
];

export const mockStructuresActionnairiales: StructureActionnariale[] = [
  {
    id: "1",
    entiteMoraleId: "1",
    dateEffective: new Date("2023-01-15"),
    actionnaires: mockActionnaires,
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    titre: "Permis expirant bientôt",
    message: "3 permis expireront dans les 30 prochains jours",
    type: "warning",
    dateCreation: new Date("2025-01-20"),
    lu: false,
  },
  {
    id: "2",
    userId: "2",
    titre: "Procédure bloquée",
    message: "La procédure PR-1002 est bloquée: Avis Wali manquant",
    type: "error",
    dateCreation: new Date("2025-01-19"),
    lu: false,
  },
  {
    id: "3",
    userId: "1",
    titre: "Nouveau permis créé",
    message: "Le permis PM-100 a été créé le 2025-01-01",
    type: "success",
    dateCreation: new Date("2025-01-01"),
    lu: true,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalPermits: 127,
  activeProcedures: 23,
  expiredPermits: 8,
  suspendedPermits: 3,
  permitsByRegion: [
    { region: "Alger", count: 35 },
    { region: "Oran", count: 28 },
    { region: "Constantine", count: 22 },
    { region: "Annaba", count: 18 },
    { region: "Ouargla", count: 24 },
  ],
  proceduresByType: [
    { type: "demande", count: 8 },
    { type: "renouvellement", count: 6 },
    { type: "transfert", count: 4 },
    { type: "substitution", count: 3 },
    { type: "extension_perimetre", count: 2 },
  ],
  permitsByStatus: [
    { status: "valide", count: 116 },
    { status: "expire", count: 8 },
    { status: "suspendu", count: 3 },
  ],
};

// Helper functions to simulate API calls
export const getPermits = () => Promise.resolve(mockPermis);
export const getProcedures = () => Promise.resolve(mockProcedures);
export const getEntitesMorales = () => Promise.resolve(mockEntitesMorales);
export const getSubstances = () => Promise.resolve(mockSubstances);
export const getDashboardStats = () => Promise.resolve(mockDashboardStats);
export const getNotifications = (userId: string) =>
  Promise.resolve(mockNotifications.filter((n) => n.userId === userId));
export const getUserByEmail = (email: string) =>
  Promise.resolve(mockUsers.find((u) => u.email === email));
