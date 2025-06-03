export type UserRole =
  | "administrator"
  | "cadastre_agent"
  | "committee_member"
  | "operator";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  entiteMoraleId?: string; // For operators
}

export interface EntiteMorale {
  id: string;
  raisonSociale: string;
  formeJuridique: string;
  numeroRC: string;
  adresse: string;
  email: string;
  telephone: string;
  representantLegal: string;
  dateCreation: Date;
}

export interface Substance {
  id: string;
  nom: string;
  symbole: string;
  famille: string;
}

export interface PerimetrePoint {
  id: string;
  permisId: string;
  x: number;
  y: number;
  z: number;
  ordre: number;
}

export type PermisStatus =
  | "valide"
  | "expire"
  | "suspendu"
  | "annule"
  | "fusionne";

export interface Permis {
  id: string;
  code: string;
  entiteMoraleId: string;
  entiteMorale: EntiteMorale;
  statut: PermisStatus;
  dateDelivrance: Date;
  dateExpiration: Date;
  perimetre: PerimetrePoint[];
  substances: PermisSubstance[];
  procedures: Procedure[];
}

export interface PermisSubstance {
  id: string;
  permisId: string;
  substanceId: string;
  substance: Substance;
  dateAjout: Date;
}

export type ProcedureType =
  | "demande"
  | "transfert"
  | "cession"
  | "renouvellement"
  | "substitution"
  | "fusion"
  | "extension_perimetre"
  | "extension_substance";
export type ProcedureStatus = "en_cours" | "terminee" | "rejetee" | "suspendue";

export interface Procedure {
  id: string;
  code: string;
  type: ProcedureType;
  statut: ProcedureStatus;
  dateCreation: Date;
  permisId?: string;
  permis?: Permis;
  entiteMoraleId: string;
  entiteMorale: EntiteMorale;
  etapes: EtapeProcedure[];
  documents: Document[];
  decisionsComite: DecisionComite[];
}

export type EtapeType =
  | "verification_dossier"
  | "empietement_check"
  | "rapport_police"
  | "avis_wali"
  | "soumission_comite";
export type EtapeStatus = "en_attente" | "terminee" | "rejetee";

export interface EtapeProcedure {
  id: string;
  procedureId: string;
  type: EtapeType;
  statut: EtapeStatus;
  dateDebut: Date;
  dateFin?: Date;
  commentaire?: string;
  agentId?: string;
  fichiersSupportant: string[];
}

export type DocumentType =
  | "annexe_II-11"
  | "rapport_police"
  | "statuts"
  | "carte"
  | "registre_commerce"
  | "note_technique"
  | "carte_cadastrale";
export type DocumentStatus = "en_attente" | "valide" | "rejete";

export interface Document {
  id: string;
  procedureId: string;
  type: DocumentType;
  nom: string;
  statut: DocumentStatus;
  dateUpload: Date;
  commentaire?: string;
  cheminFichier: string;
}

export type DecisionType = "approuve" | "rejete" | "en_attente";

export interface DecisionComite {
  id: string;
  procedureId: string;
  decision: DecisionType;
  dateDecision: Date;
  membreId: string;
  commentaire?: string;
  noteDecision?: string;
}

export interface Actionnaire {
  id: string;
  entiteMoraleId: string;
  nom: string;
  type: "physique" | "morale";
  participationPourcentage: number;
  dateEntree: Date;
  dateSortie?: Date;
}

export interface StructureActionnariale {
  id: string;
  entiteMoraleId: string;
  dateEffective: Date;
  actionnaires: Actionnaire[];
}

export interface Notification {
  id: string;
  userId: string;
  titre: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  dateCreation: Date;
  lu: boolean;
}

export interface DashboardStats {
  totalPermits: number;
  activeProcedures: number;
  expiredPermits: number;
  suspendedPermits: number;
  permitsByRegion: { region: string; count: number }[];
  proceduresByType: { type: ProcedureType; count: number }[];
  permitsByStatus: { status: PermisStatus; count: number }[];
}

export interface SearchFilters {
  code?: string;
  entiteMorale?: string;
  substance?: string;
  statut?: PermisStatus;
  dateDebutPeriode?: Date;
  dateFinPeriode?: Date;
}

export interface CoordinateInput {
  x: number;
  y: number;
  z: number;
}
