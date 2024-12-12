import {
  DatabaseBackup,
  DatabaseZap,
  Factory,
  Rocket,
  TrendingUpDown,
  UploadCloud,
} from 'lucide-react';

import { ISteperData } from '@/components/common/Stepper';

// src/types.ts

export interface IReference {
  id: string;
  name: string;
  datasourceid: string;
  description: string;
  type: string;
  url: string;
  createdby: string;
  createdat: Date;
  isactive: boolean;
  hashRecorded: any[];
  depth: string | number;
  ingested: boolean;
  ingestionjobid: string;
  referencestage: string;
  reftype: string;
  size: string;
  status: string;
}
export interface IProjectAttributes {
  id: string;
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
  references: IReference[];
  chaintype: string;
  hasAlert?: boolean;
}
export enum ProjectType {
  'ON PREM' = 'ON_PREM',
  HYBRID = 'HYBRID',
  CLOUD = 'CLOUD',
  'CUSTOM CLOUD' = 'CUSTOM_CLOUD',
}

export enum ProjectStageEnum {
  DATA_SOURCE = 'DATA_SOURCE',
  DATA_INGESTION = 'DATA_INGESTION',
  DATA_STORAGE = 'DATA_STORAGE',
  DATA_PREPARATION = 'DATA_PREPARATION',
  RAG_INGESTION = 'RAG_INGESTION',
  // VERSIONING = 'VERSIONING',
  // RAG = 'RAG',
  PUBLISHED = 'PUBLISHED',
}

export const getProjectStageEnumValue = (key: string): string => {
  return ProjectStageEnum[key as keyof typeof ProjectStageEnum];
};
export const ProjectStageLabel = {
  DATA_SOURCE: 'Data Source',
  DATA_INGESTION: 'Data Ingestion',
  DATA_STORAGE: 'Data Storage',
  DATA_PREPARATION: 'Data Preparation',
  RAG_INGESTION: 'RAG Ingestion',
  // VERSIONING: 'Versioning',
  // RAG: 'RAG',
  PUBLISHED: 'Published',
};

export enum ProjectStatusEnum {
  STARTED = 'STARTED',
  PAUSED = 'PAUSED',
  CANCELLED = 'CANCELLED',
  ACTIVE = 'ACTIVE',
}
export type ActionStatus =
  | 'INITIATED'
  | 'ACTIVE'
  | 'ERROR'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'UPLOADED';

export const statusColor: Record<ActionStatus, { bg: string; text: string }> = {
  INITIATED: {
    bg: 'bg-blue-100', // Tailwind background color
    text: 'text-blue-600', // Tailwind text color
  },
  ACTIVE: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  ERROR: {
    bg: 'bg-red-100',
    text: 'text-red-600',
  },
  CANCELLED: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
  },
  COMPLETED: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  PENDING: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
  },
  APPROVED: {
    bg: 'bg-green-100',
    text: 'text-green-600',
  },
  REJECTED: {
    bg: 'bg-red-100',
    text: 'text-red-600',
  },
  UPLOADED: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
  },
};

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
export interface SourceReference {
  refType: 'website' | 'document';
  content: string;
  id: number;
}
export const stepData: ISteperData[] = [
  {
    completed: true,
    icon: <UploadCloud className="text-white" />,
    label: ProjectStageLabel.DATA_SOURCE,
    data: null,
    dataLoading: false,
    isExpanded: true,
  },
  {
    completed: false,
    icon: <DatabaseZap className="text-white" />,
    label: ProjectStageLabel.DATA_INGESTION,
    data: null,
    dataLoading: false,
    isExpanded: false,
  },
  {
    completed: false,
    icon: <DatabaseBackup className="text-white" />,
    label: ProjectStageLabel.DATA_STORAGE,
    data: null,
    dataLoading: false,
    isExpanded: false,
  },
  {
    completed: false,
    icon: <TrendingUpDown className="text-white" />,
    label: ProjectStageLabel.DATA_PREPARATION,
    data: null,
    dataLoading: false,
    isExpanded: false,
  },
  {
    completed: false,
    icon: <Factory className="text-white" />,
    label: ProjectStageLabel.RAG_INGESTION,
    data: null,
    dataLoading: false,
    isExpanded: false,
  },
  {
    completed: false,
    icon: <Rocket className="text-white" />,
    label: ProjectStageLabel.PUBLISHED,
    data: null,
    dataLoading: false,
    isExpanded: false,
    isLast: true,
  },
];
