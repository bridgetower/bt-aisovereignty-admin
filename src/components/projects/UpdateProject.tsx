import { ColumnDef } from '@tanstack/react-table';
import {
  AlertCircle,
  CircleHelp,
  Edit3,
  MoreVertical,
  Share2,
} from 'lucide-react';
import React from 'react';

import {
  IProjectAttributes,
  ProjectStageEnum,
  ProjectStageLabel,
} from '@/types/ProjectData';

import { DataTable } from '../common/dataTable';
import { Button } from '../ui/button';
import { Select, SelectTrigger } from '../ui/select';

// Dummy data for the transaction (can also be passed as props)
const knoledgeBaseColums: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: 'File name',
  },
  {
    accessorKey: 'updatedon',
    header: 'Last updated on',
  },
];

const dummyData = [
  {
    id: '728ed523f',
    name: 'data/datafile.csv',
    updatedon: 'Jan 4, 2024',
    icon: <AlertCircle className="text-warning" type="solid" size={15} />,
  },
  {
    id: '728ed25f',
    name: 'https://github.com/mlabonne/llm-course',
    updatedon: 'Jan 4, 2024',
  },
];

type Props = {
  project: IProjectAttributes | null;
};
export const UpdateProject: React.FC<Props> = (props) => {
  const { project } = props;

  return (
    <div className="px-6 ">
      {project ? (
        <>
          <div className="flex justify-between">
            <div className="text-sm text-foreground">
              <span className="font-bold ">Project State:</span>{' '}
              {ProjectStageLabel[project.projectstage as ProjectStageEnum]}
            </div>
            <div className="flex items-center gap-4">
              <Edit3 size={20} className="cursor-pointer" />
              <Share2 size={20} className="cursor-pointer" />
              <MoreVertical size={20} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="text-2xl font-bold text-foreground font-roboto">
              {project.name}
            </div>
            <AlertCircle className="text-warning mt-1" />
          </div>
          <div className="text-sm text-foreground mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold ">Type:</span>{' '}
              <span>
                <CircleHelp size={16} />
              </span>
              <span>
                <Select>
                  <SelectTrigger className="bg-card h-6">
                    {' '}
                    {project.projecttype.replace('_', ' ')}
                  </SelectTrigger>
                </Select>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-[#FFC954] rounded py-1 px-2 ">
              High Priority
            </span>
            <span className="text-xs bg-muted rounded py-1 px-2 ">
              Start Date: 10/23/2024
            </span>
            <span className="text-xs bg-muted rounded py-1 px-2 ">
              Est. End Date: 10/31/2024
            </span>
          </div>
          <div className="bg-[#C6F7E9] p-6 flex justify-between items-center rounded-md mt-4">
            <div className={`text-accent`}>Time Spent on this project</div>
            <div className="text-accent font-semibold text-xl">12:45:56</div>
          </div>
          <div className="bg-warning p-6 flex justify-between items-center rounded-md mt-4">
            <div className={`text-white`}>Time Spent on this project</div>
            <Button className="uppercase " variant={'secondary'} size={'sm'}>
              Take action
            </Button>
          </div>
          <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold ">Description</div>{' '}
            <p className="text-sm font-normal">
              This project aims to develop and train a state-of-the-art Large
              Language Model (LLM) capable of understanding and generating
              human-like text across a wide range of tasks and domains. The
              ultimate goal is to create a model that can perform at a high
              level on various natural language processing (NLP) tasks,
              including text generation, summarization, translation, question
              answering, and more.
            </p>
          </div>
          <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold ">
              Attachments ({dummyData.length} items)
            </div>{' '}
            <div className="mt-2">
              <DataTable
                columns={knoledgeBaseColums}
                data={dummyData}
                rowSeletable={true}
                actionMenu={true}
                onActionMenuClick={() => {}}
              />
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};
