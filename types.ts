
export enum Status {
  PENDING = 'PENDING',
  MET = 'MET',
  BREACHED = 'BREACHED',
  DISPUTED = 'DISPUTED'
}

export enum Category {
  COUPLE = 'Relationship',
  CO_PARENTING = 'Co-Parenting',
  FREELANCE = 'Professional',
  RECOVERY = 'Recovery',
  PERSONAL = 'Personal Growth'
}

export interface Update {
  id: string;
  timestamp: number;
  author: string;
  note: string;
}

export interface Commitment {
  id: string;
  title: string;
  description: string;
  promisor: string; // Who is making the commitment
  promisee: string; // Who is the commitment for
  category: Category;
  createdAt: number;
  deadline?: number;
  definitionOfDone: string;
  status: Status;
  updates: Update[];
}

export interface AnalysisResult {
  reliabilityScore: number;
  summary: string;
  patterns: string[];
  recommendation: string;
}
