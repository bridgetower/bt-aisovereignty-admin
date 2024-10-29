import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import { CircleHelp, Loader2, MoreVertical, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
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
} from '@/types/ProjectData';

import { DataTable } from '../common/dataTable';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
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

export const UpdateProject: React.FC<{ id: string }> = (props) => {
  const { id } = props;
  const navigate = useNavigate();
  const {
    getProjectDetails,
    refetchProjects,
    deleteDocReference,
    updateKnowledgebase,
  } = useProject();
  const { showLoader, hideLoader } = useLoader();
  const [project, setProject] = useState<IProjectAttributes | null>(null);
  const [saving, setSaving] = useState(false);
  const [base64Files, setBase64Files] = useState<IFileContent[]>([]);
  const [filesData, setFilesData] = useState<IFileContent[]>([]);
  const memoizedFilesData = React.useMemo(() => filesData, [filesData]);
  useEffect(() => {
    showLoader();
    getProjectDetails({ projectId: id })
      .then((res: any) => {
        if (res.data?.GetProjectById?.data) {
          updateFormData(res.data?.GetProjectById?.data?.project);
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
  }, []);
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

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    if (!saving) {
      setSaving(true);
      const files = base64Files.map((file) => ({
        fileName: file.fileName,
        fileContent: file.fileContent,
        contentType: file.contentType,
      }));
      updateKnowledgebase({ projectId: id, files })
        .then((res: any) => {
          if (res.data?.DeleteRefToKnowledgeBase?.status === 200) {
            refetchProjects();
            toast.success('Reference doc removed!');
          }
        })
        .catch((error: any) => {
          toast.error(error?.message || 'Failed to remove!');
        })
        .finally(() => {
          setSaving(false);
        });
    }
  };
  // Dropzone file handler
  const onDrop = (acceptedFiles: File[]) => {
    convertFilesToBase64(acceptedFiles);
  };

  const convertFilesToBase64 = (files: File[]) => {
    const promises = files.map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () =>
          resolve({
            fileName: file.name,
            fileContent: replaceBase64(reader.result as string),
            contentType: file.type,
            isLocal: true,
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

  const { getRootProps: getRootProps, getInputProps: getInputProps } =
    useDropzone({
      onDrop,
    });

  const actionMenuColDef = {
    id: 'actions',
    cell: ({ row }: any) => {
      const dataSet = row.original;

      return (
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
      );
    },
  };

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
      deleteDocReference(refId)
        .then((res: any) => {
          if (res.data?.DeleteRefToKnowledgeBase?.status === 200) {
            refetchProjects();
            toast.success('Reference doc removed!');
          }
        })
        .catch((error: any) => {
          toast.error(error?.message || 'Failed to remove!');
        })
        .finally(() => {
          setSaving(false);
        });
    }
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
              {/* <Edit3 size={20} className="cursor-pointer" /> */}
              {/* <Share2 size={20} className="cursor-pointer" /> */}
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
          <div className="text-sm text-foreground mt-4 font-roboto relative">
            <div className="font-semibold flex justify-between items-center">
              <div>Attachments ({filesData.length} items)</div>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button type="button" variant={'link'}>
                  Add Item
                </Button>
                <div
                  className={`${memoizedFilesData?.length ? 'opacity-0' : 'opacity-100'} absolute top-20 left-1/2 -translate-x-1/2 translate-y-4  bg-card p-10  text-center cursor-pointer z-10 w-2/3`}
                >
                  <p className="text-muted-foreground hover:opacity-80 ">
                    Drag & Drop files here, or click to select files
                  </p>
                </div>
              </div>
            </div>
          </div>{' '}
          <div className="">
            <DataTable
              key={filesData.length}
              columns={[...tableColumnDef, actionMenuColDef]}
              data={memoizedFilesData}
              rowSeletable={true}
              actionMenu={true}
              onActionMenuClick={() => {}}
              // key={Date.now()}
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
