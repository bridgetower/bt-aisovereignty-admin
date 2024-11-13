import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import { CircleHelp, Loader2, MoreVertical, Save, Share2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { useLoader } from '@/context/LoaderProvider';
import { IFileContent, useProject } from '@/context/ProjectProvider';
import {
  IProjectAttributes,
  ProjectStageEnum,
  ProjectStageLabel,
  ProjectType,
  stepData,
} from '@/types/ProjectData';

import { ISteperData, Stepper } from '../common/Stepper';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

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

const emptyData = [
  {
    id: '01',
    name: '',
    updatedon: '',
    fileName: '',
    fileContent: '',
    contentType: '',
  },
  {
    id: '02',
    name: '',
    updatedon: '',
    fileName: '',
    fileContent: '',
    contentType: '',
  },
];

// interface FileData {
//   id: string;
//   name: string;
//   description: string;
//   projecttype: string;
// }
const formSchema = z.object({
  name: z.string().optional(),
  projecttype: z.string().optional(),
  description: z.string().optional(),
});
type FormInputs = z.infer<typeof formSchema>;
let tempStepsData: ISteperData[] = [];
export const UpdateProject: React.FC<{ id: string }> = (props) => {
  const rowLimit: number = 1;
  const { id } = props;
  const navigate = useNavigate();
  const {
    getProjectDetails,
    refetchProjects,
    // deleteDocReference,
    updateKnowledgebase,
  } = useProject();
  const { showLoader, hideLoader } = useLoader();
  const [project, setProject] = useState<IProjectAttributes | null>(null);
  const [saving, setSaving] = useState(false);
  const [base64Files, setBase64Files] = useState<IFileContent[]>([]);
  const [filesData, setFilesData] = useState<IFileContent[]>([]);
  const [stepperData, setStepperData] = useState<ISteperData[]>([]);
  const memoizedStepperData = React.useMemo(() => stepperData, [stepperData]);
  const [docPage, setDocPage] = useState(1);

  useEffect(() => {
    tempStepsData = stepData;
    setDocPage(1);
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }
    getProjectDetailsById();
  }, [id, docPage]);

  useEffect(() => {
    if (base64Files.length > 0) {
      const newFiles = base64Files.map((file, i) => ({
        id: file.fileName + i,
        name: file.fileName,
        updatedon: new Date().toDateString(),
        isLocal: true,
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
          updateFormData(res.data?.GetProjectById?.data?.project);
          setProject(res.data.GetProjectById.data?.project);
          // const files = res.data?.GetProjectById?.data?.map((file: any) => ({
          //   id: file.id,
          //   name: file.name,
          //   updatedon: new Date().toDateString(),
          //   isLocal: false,
          //   ...file,
          // }));
          // setTotalPages((prev) => ({
          //   ...prev,
          //   refs: res.data?.GetProjectById?.data?.references?.totalPages,
          // }));
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
          toast.error(res?.error?.message);
        }
      })
      .catch((error: any) => {
        toast.error(error?.message || 'Failed to fetch project details!');
      })
      .finally(() => {
        // hideLoader();
      });
  };
  const updateFormData = (data: any) => {
    setProject(data);
    form.setValue('name', data.name);
    form.setValue('description', data.description);
    form.setValue('projecttype', data.projecttype);
  };
  const ProjectTypeArray: { key: string; value: string }[] = Object.entries(
    ProjectType,
  ).map(([key, value]) => ({ key, value }));

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit: SubmitHandler<FormInputs> = () => {
    if (!saving && base64Files.length > 0) {
      setSaving(true);

      const files = base64Files.map((file) => ({
        fileName: file.fileName,
        fileContent: file.fileContent,
        contentType: file.contentType,
      }));
      setFilesData((previous) => [...files, ...previous]);
      updateKnowledgebase({ projectId: id, files })
        .then((res: any) => {
          if (res.data?.AddRefToKnowledgeBase?.status === 200) {
            refetchProjects();
            getProjectDetails({ projectId: id, page: 1, limit: 100 });
            toast.success('Reference doc updated!');
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
  // Dropzone file handler
  // const onDrop = (acceptedFiles: File[]) => {
  //   convertFilesToBase64(acceptedFiles);
  // };

  // const convertFilesToBase64 = (files: File[]) => {
  //   const promises = files.map((file) => {
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();
  //       reader.readAsDataURL(file);
  //       reader.onload = () =>
  //         resolve({
  //           fileName: file.name,
  //           fileContent: replaceBase64(reader.result as string),
  //           contentType: file.type,
  //           isLocal: true,
  //           reftype: 'DOCUMENT',
  //         });
  //       reader.onerror = reject;
  //     });
  //   });

  //   Promise.all(promises).then((base64Files) => {
  //     setBase64Files(() => [...(base64Files as IFileContent[])]);
  //   });
  // };

  // const replaceBase64 = (base64: string) => {
  //   const newstr = base64.replace(/^data:[^;]+;base64,/, '');
  //   return newstr;
  // };

  // const { getRootProps: getRootProps, getInputProps: getInputProps } =
  //   useDropzone({
  //     onDrop,
  //   });

  // const actionMenuColDef = {
  //   id: 'actions',
  //   cell: ({ row }: any) => {
  //     const dataSet = row.original;

  //     return (
  //       <>
  //         {dataSet.name ? (
  //           <DropdownMenu>
  //             <DropdownMenuTrigger asChild>
  //               <Button variant="ghost" className="h-8 w-8 p-0">
  //                 <span className="sr-only">Open menu</span>
  //                 <MoreVertical className="h-4 w-4" />
  //               </Button>
  //             </DropdownMenuTrigger>
  //             <DropdownMenuContent align="end">
  //               <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //               <DropdownMenuSeparator />
  //               <DropdownMenuItem
  //                 className="flex gap-1"
  //                 onClick={() => onActionMenuClick(dataSet, 'remove')}
  //               >
  //                 <Trash2 className="text-destructive" size={20} /> Remove
  //               </DropdownMenuItem>
  //             </DropdownMenuContent>
  //           </DropdownMenu>
  //         ) : (
  //           <></>
  //         )}
  //       </>
  //     );
  //   },
  // };

  // const onActionMenuClick = (dataSet: any, action: string) => {
  //   if (action === 'remove') {
  //     if (dataSet.isLocal) {
  //       setFilesData((prevFiles: any) =>
  //         prevFiles.filter((file: any) => file.name !== dataSet.name),
  //       );
  //     } else {
  //       removeDocs(dataSet.id);
  //     }
  //   }
  // };
  // const removeDocs = (refId: string) => {
  //   if (!saving) {
  //     setSaving(true);
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
  //       });
  //   }
  // };
  const onStepClick = (index: number) => {
    if (stepData[index].data) {
      return;
    }
    setDocPage(index + 1);
  };
  return (
    <Form {...form}>
      <Toaster />
      <div className="px-6 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between">
            <div className="text-sm text-foreground">
              <span className="font-bold ">Project State:</span>{' '}
              {ProjectStageLabel[project?.projectstage as ProjectStageEnum]}
            </div>
            <div className="flex items-center gap-4">
              <Save
                size={20}
                className="cursor-pointer"
                onClick={() => onSubmit(form.getValues())}
              />
              <Share2 size={20} className="cursor-pointer" />
              <MoreVertical size={20} className="cursor-pointer" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="font-bold ">Project name:</span>{' '}
            <div className="text-2xl font-bold text-foreground font-roboto">
              <FormField
                control={form.control}
                name="name"
                disabled
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        tabIndex={0}
                        className="h-8 rounded-lg font-normal
                  border-neutral-300 bg-transparent placeholder:text-muted-foreground
                  focus:outline-none"
                        placeholder="Project name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="text-sm text-foreground mt-4">
            <div className="flex items-center gap-2">
              <span className="font-bold ">Type:</span>{' '}
              <span>
                <CircleHelp size={16} />
              </span>
              <span>
                <FormField
                  control={form.control}
                  name="projecttype"
                  disabled
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <SelectTrigger
                            className="h-8 rounded-lg font-normal
                  border-neutral-300 bg-transparent placeholder:text-muted-foreground
                  focus:outline-none"
                          >
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ProjectTypeArray.map((type, i) => (
                              <SelectItem value={type.value} key={i}>
                                {type.key}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span className="text-xs bg-muted text-info font-medium rounded py-1 px-2 ">
              Start Date: NA
            </span>
            <span className="text-xs bg-muted text-info font-medium rounded py-1 px-2 ">
              Est. End Date: NA
            </span>
          </div>
          <div className="text-sm text-foreground mt-4 font-roboto ">
            <div className="font-semibold ">Description</div>{' '}
            <FormField
              control={form.control}
              name="description"
              disabled
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      rows={6}
                      className="rounded-lg font-normal mt-2
                  border-neutral-300 bg-transparent placeholder:text-muted-foreground
                  focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <div className="text-sm text-foreground mt-4 font-roboto relative">
            <div className="font-semibold flex justify-between items-center">
              <div>Attachments ({filesData.length} items)</div>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button type="button" variant={'link'}>
                  Add Item
                </Button>
              </div>
            </div>
          </div>{' '} */}
          <div className="">
            {/* <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles)} noClick>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()}>
                    <input {...getInputProps()} />

                    <DataTable
                      key={filesData.length}
                      columns={[...tableColumnDef, actionMenuColDef]}
                      data={memoizedFilesData}
                      rowSeletable={true}
                      actionMenu={true}
                      onActionMenuClick={() => {}}
                      noDataText="Drag & Drop files here"
                    />
                  </div>
                </section>
              )}
            </Dropzone> */}
            <div className="text-sm text-foreground mt-4 font-roboto ">
              <div className="font-semibold mt-4">Project Stage History</div>
            </div>
            <Stepper
              steps={memoizedStepperData}
              renderContent={() => null}
              animationDuration={0.5}
              className="bg-card rounded-2xl"
              onStepClick={onStepClick}
            />
          </div>
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button
              type="button"
              variant={'outline'}
              size={'sm'}
              onClick={() => navigate('/projects', { replace: true })}
            >
              Cancel
            </Button>
            <Button
              size={'sm'}
              className={
                Object.keys(errors).length > 0
                  ? `bg-secondary text-neutral-400 cursor-not-allowed`
                  : ''
              }
            >
              {saving ? (
                <div className="flex items-center gap-1">
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};
