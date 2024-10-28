// src/types.ts
export interface IProjectAttributes {
  id: number;
  name: string;
  description: string;
  projecttype: string;
  projectstatus: string;
  projectstage: ProjectStageEnum;
  organizationsd: number;
  createdby: string;
  createdat: Date;
  isactive: boolean;
  hashRecorded: any[];
}
export enum ProjectType {
  'ON PREM' = 'ON_PREM',
  HYBRID = 'HYBRID',
  CLOUD = 'CLOUD',
  'CUSTOM CLOUD' = 'CUSTOM_CLOUD',
}

export enum ProjectStageEnum {
  DATA_SELECTION = 'DATA_SELECTION',
  DATA_INGESTION = 'DATA_INGESTION',
  DATA_STORAGE = 'DATA_STORAGE',
  DATA_PREPARATION = 'DATA_PREPARATION',
  LLM_FINE_TUNING = 'LLM_FINE_TUNING',
  VERSIONING = 'VERSIONING',
  RAG = 'RAG',
  PUBLISHED = 'PUBLISHED',
}

export const getProjectStageEnumValue = (key: string): string => {
  return ProjectStageEnum[key as keyof typeof ProjectStageEnum];
};
export const ProjectStageLabel = {
  DATA_SELECTION: 'Source Data',
  DATA_INGESTION: 'Data Ingestion',
  DATA_STORAGE: 'Data Storage',
  DATA_PREPARATION: 'Data Preparation',
  LLM_FINE_TUNING: 'LLM Fine Tuning',
  VERSIONING: 'Versioning',
  RAG: 'RAG',
  PUBLISHED: 'Published',
};

export enum ProjectStatusEnum {
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
}

export const ProjectStatusKeyValueArray: { key: string; value: string }[] =
  Object.entries(ProjectStatusEnum).map(([key, value]) => ({
    key: key.replace('_', ' '),
    value,
  }));

export const projectColors = [
  'red',
  'yellow',
  'green',
  'blue',
  'indigo',
  'purple',
  'pink',
  // 'slate',
  // 'zinc',
  // 'stone',
  // 'orange',
  // 'amber',
  // 'lime',
  // 'emerald',
  // 'cyan',
  // 'sky',
  // 'violet',
  // 'fuchsia',
];
