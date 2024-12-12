import { ColumnDef } from '@tanstack/react-table';
import CryptoJS from 'crypto-js';
import {
  AlertCircle,
  CircleHelp,
  Edit3,
  Loader2,
  MoreVertical,
  Share2,
  Trash2,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

import { IFileContent, useProject } from '@/context/ProjectProvider';
import {
  IProjectAttributes,
  ProjectStageEnum,
  ProjectStageLabel,
  stepData,
} from '@/types/ProjectData';

import { SidepanelSkeleton } from '../common/SidepanelSkeleton';
import { ISteperData } from '../common/Stepper';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AddWebUrls } from './addWeburlComponent';
import { Sources } from './Sources';

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
  {
    accessorKey: 'status',
    header: 'Status',
  },
];

// const hashItemColumns: ColumnDef<any>[] = [
//   {
//     accessorKey: 'name',
//     header: 'File name',
//   },
//   {
//     accessorKey: 'updatedon',
//     header: 'Last updated on',
//   },
// ];

// const dummyData = [
//   {
//     id: '728ed52f',
//     name: 'Data Source Hash',
//     updatedon: 'Jan 4, 2024',
//   },
//   {
//     id: '728ed5f',
//     name: 'Data Source Hash',
//     updatedon: 'Jan 4, 2024',
//   },
// ];

let tempStepsData: ISteperData[] = [];
const ProjectDetails: React.FC<{ id: string }> = (props) => {
  const rowLimit: number = 1;
  // const topRef = useRef<HTMLDivElement | null>(null);
  const { id } = props;
  const navigate = useNavigate();
  const [stepperData, setStepperData] = useState<ISteperData[]>([]);
  // const [hashData, setHashData] = useState<any[]>([]);
  const [project, setProject] = useState<IProjectAttributes | null>(null);
  const memoizedStepperData = React.useMemo(() => stepperData, [stepperData]);
  const [saving, setSaving] = useState(false);
  const [docPage, setDocPage] = useState(1);
  // const [totalPages, setTotalPages] = useState({ refs: 1, hash: 1 });
  // const { showLoader, hideLoader } = useLoader();
  const [loadingProject, setLoadingProject] = useState(true);
  const [base64Files, setBase64Files] = useState<IFileContent[]>([]);
  const [refType, setRefType] = useState('DOCUMENT');
  const [filesData, setFilesData] = useState<any>([]);
  const memoizedFilesData = React.useMemo(() => filesData, [filesData]);
  const [refUrls, setRefUrls] = useState<IFileContent[]>([]);
  const [urlErrors, setUrlErrors] = useState<any>(null);
  const [webUrlsList, setWebUrlsList] = useState<any[]>([]);
  const [refStageDetails, setRefStageDetails] = useState<any[]>([]);
  const {
    getProjectDetails,
    refetchProjects,
    updateReferenceStatusByAdminMutation,
    addFileToProject,
    getStagebyRefId,
  } = useProject();
  useEffect(() => {
    // topRef.current?.scrollIntoView({ behavior: 'smooth' });
    tempStepsData = stepData;
    setDocPage(1);
    setLoadingProject(true);
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    // Initial call
    getProjectDetailsById();
    // if (docPage !== 6) {
    //   // Set up the interval
    //   const intervalId = setInterval(() => {
    //     getProjectDetailsById();
    //   }, 30000); // 30 seconds = 30000 milliseconds

    // return () => {
    //   clearInterval(intervalId);
    // };
    // }
  }, [id, docPage]);

  useEffect(() => {
    if (base64Files.length > 0) {
      const newFiles = base64Files.map((file, i) => ({
        id: (file.fileName || 'refdoc') + i,
        name: file.fileName,
        doctype: 'File',
        updatedon: new Date().toDateString(),
        status: 'PENDING',
      }));

      setFilesData((prevFiles: any) =>
        [...newFiles, ...prevFiles].length > 4
          ? [...newFiles, ...prevFiles].filter((e) => e.name)
          : [...newFiles, ...prevFiles],
      );
    }
  }, [base64Files]);

  const getProjectDetailsById = () => {
    // showLoader();
    getProjectDetails({ projectId: id, page: docPage, limit: rowLimit })
      .then((res: any) => {
        if (res.data?.GetProjectById?.data) {
          setProject(res.data.GetProjectById.data?.project);
          const files = res.data?.GetProjectById?.data?.project?.references
            ?.filter?.((e: any) => e.reftype === 'DOCUMENT')
            .map((file: any) => ({
              updatedon: new Date().toDateString(),
              isLocal: false,
              ...file,
            }));
          setFilesData(files);
          const urls = res.data?.GetProjectById?.data?.project?.references
            ?.filter?.((e: any) => e.reftype === 'WEBSITE')
            .map((file: any) => ({
              createdOn: file.createdat,
              isLocal: false,
              // ...file,
              id: file.id,
              fileName: file.name || '',
              hash: file.hash || '',
              referencestage: file.referencestage,
              fileSize: file.size,
              contentType: file.contentType || '',
              depth: file.depth,
              refType: file.refType as 'WEBSITE',
              status: file.status,
              websiteName: file.websiteName,
              websiteUrl: file.websiteUrl,
            }));

          setWebUrlsList(urls);
          const lastCompletedStage =
            res.data.GetProjectById.data?.project?.projectstage;
          let stepCompleted = true;
          tempStepsData = tempStepsData.map((step) => {
            const stage = res.data?.GetProjectById?.data?.stagedata?.stages;
            const data: any[] =
              stage?.filter((s: any) => s.name === step.label) || [];
            const finalData = {
              ...step,
              data: step.data ? step.data : data.length ? data[0] : null,
              completed: stepCompleted,
              dataLoading: false,
            };
            if (
              step.label ===
              ProjectStageLabel[lastCompletedStage as ProjectStageEnum]
            ) {
              stepCompleted = false;
            }
            return finalData;
          });
          setStepperData(tempStepsData);
        } else {
          toast.error(res?.data?.GetProjectById?.error);
        }
      })
      .catch((error: any) => {
        toast.error(error?.message || 'Failed to fetch project details!');
      })
      .finally(() => {
        // hideLoader();
        setLoadingProject(false);
      });
  };

  const getStageDetailByRef = (refId: string) => {
    console.log(refId, 'deifh3i');

    getStagebyRefId({ refId: refId })
      .then((res: any) => {
        if (res.data?.GetStepsByRefId?.data) {
          console.log('res', res.data?.GetStepsByRefId?.data);

          // tempStepsData = tempStepsData.map((step) => {
          //   const data = res.data?.GetStepsByRefId?.data?.stages;
          //   // const data: any[] =
          //   //   stage?.filter((s: any) => s.name === step.label) || [];
          //   const finalData = {
          //     ...step,
          //     data: step.data ? step.data : data.length ? data[0] : null,
          //     completed: true,
          //     dataLoading: false,
          //   };

          //   return finalData;
          // });
          const data = (res.data?.GetStepsByRefId?.data?.stages || []).map(
            (stage: ISteperData) => ({
              data: stage,
              completed: stage.status === 'COMPLETED',
              label: stage.name,
              //     dataLoading: false
            }),
          );

          setRefStageDetails(data);
        }
      })
      .catch((error: any) => {
        toast.error(
          error?.message || 'Failed to fetch reference stages details!',
        );
      });
  };

  const onStepClick = (index: number) => {
    if (stepData[index].data) {
      return;
    }
    setDocPage(index + 1);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

    // Math.floor(Math.log(bytes) / Math.log(k)) finds the appropriate unit
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    // Convert to the appropriate unit and round to 2 decimal places
    const finalSize = parseFloat((bytes / Math.pow(k, i)).toFixed(2));

    return `${finalSize} ${sizes[i]}`;
  };
  // Dropzone file handler
  const onDrop = (acceptedFiles: File[]) => {
    convertFilesToBase64(acceptedFiles);
  };
  const convertFilesToBase64 = (files: File[]) => {
    const promises = files.map((file) => {
      console.log('file', file);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          resolve({
            fileName: file.name,
            fileContent: replaceBase64(reader.result as string),
            contentType: file.type,
            fileSize: file.size,
            isLocal: true,
            refType: 'DOCUMENT',
          });
        reader.onerror = reject;
      });
    });

    Promise.all(promises).then((base64Files) => {
      setBase64Files(() => [...(base64Files as IFileContent[])]);
    });
  };

  const replaceBase64 = (base64: string) => {
    const newstr = base64.replace(/^data:[^;]+;base64,/, '');
    return newstr;
  };
  // Dropzone settings
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const saveFiles = async () => {
    if (!saving) {
      setSaving(true);
      // showLoader();
      const files = base64Files
        .filter((e) => e.isLocal)
        .map(async (file) => ({
          fileName: file.fileName || '',
          hash: await getHashedFile({
            fileName: file.fileName,
            fileContent: file.fileContent,
          }),
          fileSize: formatFileSize(Number(file.fileSize) || 0),
          contentType: file.contentType || '',
          depth: 0,
          refType: 'DOCUMENT' as const,
          websiteName: '',
          websiteUrl: '',
          // isLocal: file.isLocal,
        }));
      const hashedFilesData = await Promise.all(files);
      const refUrlData = await Promise.all(
        refUrls.map(async (data) => ({
          fileName: '',
          hash: await getHashedFile({
            fileName: data.websiteName,
            fileContent: data.websiteUrl,
            depth: data.depth,
          }),
          fileSize: '',
          contentType: '',
          depth: data.depth,
          refType: 'WEBSITE',
          websiteName: data.websiteName,
          websiteUrl: data.websiteUrl,
          // id: '',
        })),
      );
      addFileToProject({
        projectId: id,
        files: [...hashedFilesData, ...refUrlData] as any[],
      })
        .then(async (res: any) => {
          if (res.data?.AddFileToProjectByAdmin?.status === 200) {
            const respData = res.data?.AddFileToProjectByAdmin?.data?.urls;
            for (const element of respData) {
              const file = base64Files.find(
                (file) => file.fileName === element.key,
              );
              const tempFileData = filesData.map((fileData: any) => {
                if (fileData.name === element.key) {
                  return {
                    ...fileData,
                    status: 'UPLOADED',
                  };
                }
                return fileData;
              });
              setFilesData(tempFileData);
              const url = element.url;
              if (!file) {
                continue;
              }
              const binaryData = Uint8Array.from(
                atob(file.fileContent || ''),
                (c) => c.charCodeAt(0),
              );
              const fileUploadRes = await fetch(url, {
                method: 'PUT',
                headers: {
                  'Content-Type':
                    file.contentType || 'application/octet-stream',
                },
                body: binaryData, // Direct string content
              });
              if (!fileUploadRes.ok) {
                const tempFileData = filesData.map((fileData: any) => {
                  if (fileData.name === element.key) {
                    return {
                      ...fileData,
                      status: 'Error',
                    };
                  }
                  return fileData;
                });
                setFilesData(tempFileData);
                // throw new Error('file upload failed');
              } else {
                const tempFileData1 = filesData.map((fileData: any) => {
                  if (fileData.name === element.key) {
                    return {
                      ...fileData,
                      status: 'PROCESSING',
                    };
                  }
                  return fileData;
                });
                setFilesData(tempFileData1);
                const filRefId =
                  res.data?.AddFileToProjectByAdmin?.data?.refs?.find(
                    (ref: any) => ref.name === element.key,
                  )?.id;
                await updateReferenceStatusByAdminMutation({
                  fileId: filRefId || '',
                  status: 'UPLOADED',
                });
              }
            }
            setSaving(false);
            refetchProjects();
            toast.success('Project updated successfully!');
          } else {
            setSaving(false);
            toast.error(res.data?.AddProjectAndReference?.error);
          }
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
          // hideLoader();
        });
    }
  };

  const onActionMenuClick = (dataSet: any, action: string) => {
    if (action === 'remove') {
      setFilesData((prevFiles: any) =>
        prevFiles.filter((file: any) => file.name !== dataSet.name),
      );
    }
  };
  // const removeDocs = (refId: string) => {
  //   if (!saving) {
  //     setSaving(true);
  //     // showLoader();
  //     deleteDocReference(refId)
  //       .then((res: any) => {
  //         if (res.data?.DeleteRefToKnowledgeBase?.status === 200) {
  //           refetchProjects();
  //           getProjectDetailsById();
  //           toast.success('Reference doc removed!');
  //         }
  //       })
  //       .catch((error: any) => {
  //         toast.error(error?.message || 'Failed to remove!');
  //       })
  //       .finally(() => {
  //         setSaving(false);
  //         hideLoader();
  //       });
  //   }
  // };
  // const paginationChangeHandler = (page: number) => {
  //   setDocPage(page);
  // };
  const getHashedFile = async (data: any) => {
    const metadata = JSON.stringify(data);
    const hash = CryptoJS.SHA256(metadata).toString(CryptoJS.enc.Hex);
    console.log('hash', metadata);

    return hash;
  };
  const onAddingNewWebsite = (data: any) => {
    console.log('data', data);
    const urlsData: Promise<any>[] = data.map(async (website: any) => ({
      fileName: '',
      hash: await getHashedFile({
        name: website.websiteName,
        ulr: website.websiteUrl,
        depth: website.depth,
      }),
      fileSize: '',
      contentType: '',
      depth: website.depth,
      refType: 'WEBSITE' as const,
      websiteName: website.websiteName,
      websiteUrl: website.websiteUrl,
      isLocal: true,
    }));
    Promise.all(urlsData).then((data) => {
      setRefUrls(data);
    });
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
    <div className="px-6 ">
      {!loadingProject && project ? (
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
          <div className="text-sm text-foreground mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold ">Blockchain:</span>{' '}
              <div className="flex items-center gap-1">
                <img
                  src={`/images/blockchainIcons/${project.chaintype?.toLowerCase()}.png`}
                  className="w-4 h-4 rounded-full text-foreground"
                  alt={project.chaintype}
                />
                <span>{project.chaintype.replace('_', ' ')}</span>
              </div>
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
          {/* <div className="bg-[#C6F7E9] p-6 flex justify-between items-center rounded-md mt-4">
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
          </div> */}
          <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold ">Description</div>{' '}
            <p className="text-sm font-normal">{project.description}</p>
          </div>
          <div className="text-sm text-foreground mt-4 font-roboto relative">
            <div className="font-semibold flex justify-between items-center">
              <div className="py-4">
                Attachments ({filesData.filter((e: any) => e.name).length}{' '}
                items)
              </div>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {refType === 'DOCUMENT' && (
                  <Button
                    type="button"
                    variant={'link'}
                    className="text-sky-600"
                  >
                    Add Item
                  </Button>
                )}
              </div>
            </div>
          </div>{' '}
          <Tabs defaultValue="document" className="w-full">
            <TabsList>
              <TabsTrigger
                value="document"
                className=""
                onClick={() => setRefType('DOCUMENT')}
              >
                Documents
              </TabsTrigger>
              <TabsTrigger
                value="website"
                onClick={() => setRefType('WEBSITE')}
              >
                Websites
              </TabsTrigger>
            </TabsList>
            <TabsContent value="document">
              <Dropzone
                onDrop={(acceptedFiles) => onDrop(acceptedFiles)}
                noClick
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      {/* <DataTable
                        key={filesData.length}
                        columns={[...tableColumnDef, actionMenuColDef]}
                        data={memoizedFilesData}
                        rowSeletable={false}
                        actionMenu={true}
                        onActionMenuClick={() => {}}
                        // key={Date.now()}
                        noDataText="Drag and drop files here"
                      /> */}
                      <Sources
                        sourceArray={memoizedFilesData}
                        activeIndex={0}
                        onOpen={getStageDetailByRef}
                        stepperData={refStageDetails}
                      />
                    </div>
                  </section>
                )}
              </Dropzone>
            </TabsContent>
            <TabsContent value="website">
              <AddWebUrls
                listData={webUrlsList}
                onAddWebUrls={onAddingNewWebsite}
                setError={(error: any) => {
                  setUrlErrors(error);
                }}
              />
            </TabsContent>
          </Tabs>
          <div className="flex justify-end py-4">
            {base64Files.find((e) => e.isLocal) ? (
              <Button
                disabled={
                  saving || (urlErrors && Object.keys(urlErrors).length > 0)
                }
                size={'sm'}
                className={
                  urlErrors && Object.keys(urlErrors).length > 0
                    ? `bg-secondary text-neutral-400 cursor-not-allowed`
                    : ''
                }
                onClick={() => saveFiles()}
              >
                {saving ? (
                  <div className="flex items-center gap-1">
                    <Loader2 size={16} className="animate-spin" /> Updating...
                  </div>
                ) : (
                  'Update'
                )}
              </Button>
            ) : null}
          </div>
          {/* <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold mt-4">Project Stage History</div>
          </div>
          <Stepper
            steps={memoizedStepperData}
            renderContent={() => null}
            animationDuration={0.5}
            className="bg-card rounded-2xl"
            onStepClick={onStepClick}
          /> */}
        </>
      ) : (
        <SidepanelSkeleton />
      )}
    </div>
  );
};

export default ProjectDetails;
