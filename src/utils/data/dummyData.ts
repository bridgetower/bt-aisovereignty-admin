import { ProjectStageLabel } from '@/types/ProjectData';
import { IStepType } from '@/types/StepTypes';

export const orgData = {
  id: '1',
  name: 'Amy Elsner',
  role: 'CEO',
  imgUrl: 'https://via.placeholder.com/64',
  children: [
    {
      id: '2',
      name: 'Anna Fali',
      role: 'CMO',
      imgUrl: 'https://via.placeholder.com/64',
    },
    {
      id: '3',
      name: 'Stephen Shaw',
      role: 'CTO',
      imgUrl: 'https://via.placeholder.com/64',
      children: [
        {
          id: '4',
          name: 'Development',
          role: 'Team',
        },
        {
          id: '5',
          name: 'UI/UX Design',
          role: 'Team',
        },
      ],
    },
  ],
};
// export const notificationData = [
//   {
//     name: 'Proejct',
//     title: 'Project Name 2 moved to next stage',
//     icon: 'User',
//     link: '/projects',
//     read: false,
//     type: 'info',
//   },
//   {
//     name: 'Proejct',
//     title: 'Project Name 2 moved to next stage',
//     icon: 'User',
//     link: '/projects',
//     read: false,
//     type: 'info',
//   },
//   {
//     name: 'Proejct',
//     title: 'Test project moved to next stage',
//     icon: 'User',
//     link: '/projects',
//     read: false,
//     type: 'info',
//   },
//   {
//     name: 'Proejct',
//     title: 'Project Name 1 file error',
//     icon: 'User',
//     link: '/projects',
//     read: false,
//     type: 'alert',
//   },
// ];

// Assuming ProjectStage enum is defined as follows:

export const stages: IStepType[] = [
  {
    id: '1',
    name: ProjectStageLabel.DATA_SOURCE,
    description:
      'This stage involves selecting the data sources for the project.',
  },
  {
    id: '2',
    name: ProjectStageLabel.DATA_INGESTION,
    description:
      'This stage focuses on ingesting data from various sources into the system.',
  },
  {
    id: '3',
    name: ProjectStageLabel.DATA_STORAGE,
    description:
      'In this stage, the ingested data is stored securely and made accessible.',
  },
  {
    id: '4',
    name: ProjectStageLabel.DATA_PREPARATION,
    description:
      'This stage prepares the data for training, including cleaning and formatting.',
  },
  {
    id: '5',
    name: ProjectStageLabel.RAG_INGESTION,
    description:
      'In this stage, the data is used for fine-tuning large language models.',
  },
  // {
  //   id: '6',
  //   name: ProjectStageLabel.VERSIONING,
  //   description:
  //     'This stage handles versioning to manage updates and track changes.',
  // },
  // {
  //   id: '7',
  //   name: ProjectStageLabel.RAG,
  //   description:
  //     'In this stage, Retrieval-Augmented Generation (RAG) is implemented.',
  // },
  {
    id: '8',
    name: ProjectStageLabel.PUBLISHED,
    description:
      'This stage marks the project as published and available for use.',
  },
];
