import { ColumnDef } from '@tanstack/react-table';
import {
  AlertCircle,
  CircleHelp,
  Edit3,
  MoreVertical,
  Share2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { useLoader } from '@/context/LoaderProvider';
import { IFileContent, useProject } from '@/context/ProjectProvider';
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

const hashItemColumns: ColumnDef<any>[] = [
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
    icon: (
      <AlertCircle
        className="text-warning"
        size={15}
        // fill="currentColor"
        // stroke="none"
      />
    ),
  },
  {
    id: '728ed25f',
    name: 'https://github.com/mlabonne/llm-course',
    updatedon: 'Jan 4, 2024',
  },
];
const dummyData1 = [
  {
    id: '728ed52f',
    name: 'Data Source Hash',
    updatedon: 'Jan 4, 2024',
  },
  {
    id: '728ed5f',
    name: 'Data Source Hash',
    updatedon: 'Jan 4, 2024',
  },
];

const ProjectDetails: React.FC<{ id: string }> = (props) => {
  const { id } = props;
  const navigate = useNavigate();
  const [filesData, setFilesData] = useState<IFileContent[]>([]);
  const [hashData, setHashData] = useState<any[]>([]);
  const [project, setProject] = useState<IProjectAttributes | null>(null);
  const memoizedFilesData = React.useMemo(() => filesData, [filesData]);
  const { showLoader, hideLoader } = useLoader();
  const { getProjectDetails } = useProject();

  useEffect(() => {
    if (!id) {
      return;
    }
    showLoader();
    getProjectDetails({ projectId: id })
      .then((res: any) => {
        if (res.data?.GetProjectById?.data) {
          setProject(res.data.GetProjectById.data?.project);
          const files = res.data?.GetProjectById?.data?.references?.refs.map(
            (file: any) => ({
              id: file.id,
              name: file.name,
              updatedon: new Date().toDateString(),
              isLocal: false,
            }),
          );
          if (files.length) {
            setFilesData(files);
          }
        } else {
          toast.error(res?.error?.message);
        }
      })
      .catch((error: any) => {
        toast.error(error?.message || 'Failed to fetch project details!');
      })
      .finally(() => {
        hideLoader();
      });
  }, [id]);
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
              <Edit3
                size={20}
                className="cursor-pointer"
                onClick={() =>
                  navigate('/projects/edit/' + project.id, { replace: true })
                }
              />
              <Share2 size={20} className="cursor-pointer" />
              <MoreVertical size={20} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <div className="text-2xl font-bold text-foreground font-roboto">
              {project.name}
            </div>
            {project.hasAlert && <AlertCircle className="text-warning mt-1" />}
          </div>
          <div className="text-sm text-foreground mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold ">Type:</span>{' '}
              <span>
                <CircleHelp size={15} absoluteStrokeWidth />
              </span>
              <span>
                <Select>
                  <SelectTrigger className="bg-card h-6 cursor-default pointer-events-none">
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
              Start Date: {new Date(project.createdat).toLocaleDateString()}
            </span>
            <span className="text-xs bg-muted rounded py-1 px-2 ">
              Est. End Date: NA
            </span>
          </div>
          <div className="bg-[#C6F7E9] p-6 flex justify-between items-center rounded-md mt-4">
            <div className={`text-info`}>Time Spent on this project</div>
            <div className="text-info font-semibold text-xl">12:45:56</div>
          </div>
          <div className="bg-warning p-6 flex justify-between items-center rounded-md mt-4">
            <div className={`text-white`}>Time Spent on this project</div>
            <Button className="uppercase " variant={'secondary'} size={'sm'}>
              Take action
            </Button>
          </div>
          <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold ">Description</div>{' '}
            <p className="text-sm font-normal">{project.description}</p>
          </div>
          <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold ">
              Attachments ({dummyData.length} items)
            </div>{' '}
            <div className="mt-2">
              <DataTable
                columns={knoledgeBaseColums}
                data={memoizedFilesData}
                rowSeletable={true}
                actionMenu={true}
                onActionMenuClick={() => {}}
              />
            </div>
          </div>
          <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold ">
              Hash ({dummyData.length} items)
            </div>{' '}
            <div className="mt-2">
              <DataTable
                columns={hashItemColumns}
                data={dummyData1}
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

export default ProjectDetails;
