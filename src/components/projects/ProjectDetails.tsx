import { ColumnDef } from '@tanstack/react-table';
import {
  AlertCircle,
  CircleHelp,
  Edit3,
  MoreVertical,
  Share2,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
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
import { MiniPagination } from '../common/MiniPagination';
import { SidepanelSkeleton } from '../common/SidepanelSkeleton';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Select, SelectTrigger } from '../ui/select';
import { convertFilesToBase64 } from './sharedFunction';

// Dummy data for the transaction (can also be passed as props)
const tableColumnDef: ColumnDef<any>[] = [
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
  const rowLimit: number = 4;
  const topRef = useRef<HTMLDivElement | null>(null);
  const { id } = props;
  const navigate = useNavigate();
  const [filesData, setFilesData] = useState<IFileContent[]>([]);
  // const [hashData, setHashData] = useState<any[]>([]);
  const [project, setProject] = useState<IProjectAttributes | null>(null);
  const memoizedFilesData = React.useMemo(() => filesData, [filesData]);
  const [saving, setSaving] = useState(false);
  const [docPage, setDocPage] = useState(1);
  const [totalPages, setTotalPages] = useState({ refs: 1, hash: 1 });
  const { showLoader, hideLoader } = useLoader();
  const {
    getProjectDetails,
    refetchProjects,
    deleteDocReference,
    updateKnowledgebase,
  } = useProject();
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth' });
    console.log('ProjectId-', id);
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    getProjectDetailsById();
  }, [id, docPage]);

  const getProjectDetailsById = () => {
    showLoader();
    getProjectDetails({ projectId: id, page: docPage, limit: rowLimit })
      .then((res: any) => {
        if (res.data?.GetProjectById?.data) {
          setProject(res.data.GetProjectById.data?.project);
          const files = res.data?.GetProjectById?.data?.references?.refs.map(
            (file: any) => ({
              id: file.id,
              name: file.name,
              updatedon: new Date().toDateString(),
              isLocal: false,
              ...file,
            }),
          );
          setTotalPages((prev) => ({
            ...prev,
            refs: res.data?.GetProjectById?.data?.references?.totalPages,
          }));
          setFilesData(files || []);
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
  };
  const onDrop = async (acceptedFiles: File[]) => {
    const base64Files = await convertFilesToBase64(acceptedFiles);
    if (base64Files.length > 0) {
      const newFiles = base64Files.map((file, i) => ({
        id: file.fileName + i,
        name: file.fileName,
        updatedon: new Date().toDateString(),
        reftype: 'DOCUMENT',
        isLocal: true,
      }));

      setFilesData((prevFiles: any) =>
        [...newFiles, ...prevFiles].length > 4
          ? [...newFiles, ...prevFiles].filter((e) => e.name)
          : [...newFiles, ...prevFiles],
      );
    }
    saveFiles(base64Files);
  };
  const saveFiles = (base64Files: IFileContent[]) => {
    if (!saving) {
      setSaving(true);
      showLoader();
      const files = base64Files.map((file) => ({
        fileName: file.fileName,
        fileContent: file.fileContent,
        contentType: file.contentType,
      }));
      updateKnowledgebase({ projectId: id, files })
        .then((res: any) => {
          if (res.data?.AddRefToKnowledgeBase?.status === 200) {
            refetchProjects();
            getProjectDetails({
              projectId: id,
              page: docPage,
              limit: rowLimit,
            });
            toast.success('Reference doc addes!');
          }
        })
        .catch((error: any) => {
          toast.error(error?.message || 'Failed to add!');
        })
        .finally(() => {
          setSaving(false);
          hideLoader();
        });
    }
  };
  const { getRootProps: getRootProps, getInputProps: getInputProps } =
    useDropzone({
      onDrop,
    });
  const onActionMenuClick = (dataSet: any, action: string) => {
    if (action === 'remove') {
      if (dataSet.isLocal) {
        setFilesData((prevFiles: any) =>
          prevFiles.filter((file: any) => file.name !== dataSet.name),
        );
      } else {
        removeDocs(dataSet.id);
      }
    }
  };
  const removeDocs = (refId: string) => {
    if (!saving) {
      setSaving(true);
      showLoader();
      deleteDocReference(refId)
        .then((res: any) => {
          if (res.data?.DeleteRefToKnowledgeBase?.status === 200) {
            refetchProjects();
            getProjectDetailsById();
            toast.success('Reference doc removed!');
          }
        })
        .catch((error: any) => {
          toast.error(error?.message || 'Failed to remove!');
        })
        .finally(() => {
          setSaving(false);
          hideLoader();
        });
    }
  };
  const paginationChangeHandler = (page: number) => {
    setDocPage(page);
  };
  const actionMenuColDef = {
    id: 'actions',
    cell: ({ row }: any) => {
      const dataSet = row.original;

      return (
        <>
          {dataSet.name ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex gap-1"
                  onClick={() => onActionMenuClick(dataSet, 'remove')}
                >
                  <Trash2 className="text-destructive" size={20} /> Remove
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <></>
          )}
        </>
      );
    },
  };
  return (
    <div className="px-6 " ref={topRef}>
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
            {project.hasAlert && (
              <AlertCircle
                size={20}
                stroke="white"
                fill="#fa8b14"
                className="mt-0.5"
              />
            )}
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
            <div className={`text-white`}>
              File upload issue, please upload again.
            </div>
            <Button className="uppercase " variant={'secondary'} size={'sm'}>
              Take action
            </Button>
          </div>
          <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold ">Description</div>{' '}
            <p className="text-sm font-normal">{project.description}</p>
          </div>
          <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold flex justify-between items-center">
              <div>Attachments ({filesData.length} items)</div>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button type="button" variant={'link'}>
                  Add Item
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <Dropzone
                onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
                noClick
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <DataTable
                        columns={[...tableColumnDef, actionMenuColDef]}
                        data={memoizedFilesData}
                        rowSeletable={true}
                        actionMenu={true}
                        onActionMenuClick={() => {}}
                        noDataText=" Drag & Drop files here"
                      />
                    </div>
                  </section>
                )}
              </Dropzone>
              <MiniPagination
                currentPage={docPage}
                totalPages={totalPages.refs}
                onPageChange={paginationChangeHandler} // Custom page change function
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
                data={dummyData}
                actionMenu={true}
                onActionMenuClick={() => {}}
              />
            </div>
          </div>
        </>
      ) : (
        <SidepanelSkeleton />
      )}
    </div>
  );
};

export default ProjectDetails;
