import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import CryptoJS from 'crypto-js';
import { CircleHelp, Loader2, MoreVertical, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { IFileContent, useProject } from '@/context/ProjectProvider';
import { ProjectType } from '@/types/ProjectData';

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
const knoledgeBaseColums: ColumnDef<any>[] = [
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

interface FormData {
  name: string;
  description: string;
  projecttype: string;
}
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  projecttype: z.string().min(1, { message: 'Project Type is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});
type FormInputs = z.infer<typeof formSchema>;

export const CreateProject: React.FC = () => {
  const navigate = useNavigate();
  const { createNewProject, refetchProjects, updateProjectStatusMutation } =
    useProject();
  const [saving, setSaving] = useState(false);
  const [base64Files, setBase64Files] = useState<IFileContent[]>([]);
  const [filesData, setFilesData] = useState<any>([]);
  const memoizedFilesData = React.useMemo(() => filesData, [filesData]);
  const [hideActionButtons, setHideActionButtons] = useState(false);
  useEffect(() => {
    if (base64Files.length > 0) {
      const newFiles = base64Files.map((file, i) => ({
        id: file.fileName + i,
        name: file.fileName,
        doctype: 'File',
        updatedon: new Date().toDateString(),
        status: 'Pending',
      }));

      setFilesData((prevFiles: any) =>
        [...newFiles, ...prevFiles].length > 4
          ? [...newFiles, ...prevFiles].filter((e) => e.name)
          : [...newFiles, ...prevFiles],
      );
    }
  }, [base64Files]);

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
  const onSubmit: SubmitHandler<FormInputs> = async (data: FormData) => {
    if (!saving) {
      setSaving(true);
      const hashedFiles = base64Files.map(async (file) => ({
        fileName: file.fileName,
        hash: await getHashedFile(file),
        fileSize: formatFileSize(Number(file.fileSize) || 0),
        contentType: file.contentType,
      }));
      const hashedFilesData = await Promise.all(hashedFiles);
      try {
        const res = await createNewProject({
          name: data.name,
          description: data.description,
          projectType: data.projecttype,
          organizationId: process.env.REACT_APP_ORGANIZATION_ID || '',
          files: hashedFilesData,
          // files: base64Files.map((file) => ({
          //   fileName: file.fileName,
          //   fileContent: file.fileContent,
          //   contentType: file.contentType,
          // })),
        });
        if (res.data?.AddProjectAndReference?.status === 200) {
          setHideActionButtons(true);
          const projectId =
            res.data?.AddProjectAndReference?.data?.project?.project?.id;
          const respData = res.data?.AddProjectAndReference?.data?.urls;
          for (const element of respData) {
            const file = base64Files.find(
              (file) => file.fileName === element.key,
            );
            const tempFileData = filesData.map((fileData: any) => {
              if (fileData.name === element.key) {
                return {
                  ...fileData,
                  status: 'Processing',
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
                'Content-Type': file.contentType, //'application/octet-stream',
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
                    status: 'Uploaded',
                  };
                }
                return fileData;
              });
              setFilesData(tempFileData1);
            }
          }
          setSaving(false);
          // form.reset();
          // setFilesData([]);
          refetchProjects();
          toast.success('Project created successfully!');

          await updateProjectStatusMutation({
            projectId,
          });
          setHideActionButtons(false);
          navigate('/projects/details/' + projectId, { replace: true });
        } else {
          setSaving(false);
          toast.error(res.data?.AddProjectAndReference?.error);
        }
      } catch (error: any) {
        console.log(error);
        setSaving(false);
        toast.error('Failed to create project');
      }
    }
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

  // const convertFilesToBase64 = (files: File[]) => {
  //   const promises = files.map((file) => {
  //     console.log('file', file);
  //     return new Promise((resolve, reject) => {
  //       const reader = new FileReader();

  //       // Read file content as text
  //       reader.readAsText(file);

  //       reader.onload = () => {
  //         // Trim the text content
  //         const content = reader.result as string;
  //         const trimmedContent = content.trim(); // Trim the file content

  //         // Convert trimmed content to base64
  //         const base64Content = btoa(
  //           unescape(encodeURIComponent(trimmedContent)),
  //         );

  //         resolve({
  //           fileName: file.name,
  //           fileContent: replaceBase64(base64Content), // Apply your replaceBase64 function
  //           contentType: file.type,
  //           fileSize: file.size,
  //         });
  //       };

  //       reader.onerror = reject;
  //     });
  //   });

  //   Promise.all(promises).then((base64Files) => {
  //     setBase64Files(() => [...(base64Files as IFileContent[])]);
  //   });
  // };
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

  const onActionMenuClick = (dataSet: any, action: string) => {
    if (action === 'remove') {
      setFilesData((prevFiles: any) =>
        prevFiles.filter((file: any) => file.name !== dataSet.name),
      );
    }
  };

  // Instead of: import * as crypto from 'crypto';
  // const crypto = window.crypto;

  // And update your hash function to use the Web Crypto API:
  const getHashedFile = async (file: IFileContent) => {
    const metadata = JSON.stringify({
      fileName: file.fileName,
      fileContent: file.fileContent,
    });
    const hash = CryptoJS.SHA256(metadata).toString(CryptoJS.enc.Hex);
    console.log('hash', metadata);

    return hash;
  };
  // const getHashedFile = (file: IFileContent) => {
  //   const hash = crypto
  //     .createHash('sha256')
  //     .update(
  //       JSON.stringify({
  //         fileName: file.fileName,
  //         fileContent: file.fileContent,
  //       }),
  //     )
  //     .digest('hex');
  //   return hash;
  // };
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
    <Form {...form}>
      <div className="px-6 ">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between">
            <div className="text-sm text-foreground">
              <span className="font-bold ">Project State:</span> {'Not started'}
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
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Select
                          {...field}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
              <div>
                Attachments ({filesData.filter((e: any) => e.name).length}{' '}
                items)
              </div>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <Button type="button" variant={'link'}>
                  Add Item
                </Button>
              </div>
            </div>
          </div>{' '}
          <Dropzone onDrop={(acceptedFiles) => onDrop(acceptedFiles)} noClick>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <DataTable
                    key={filesData.length}
                    columns={[...knoledgeBaseColums, actionMenuColDef]}
                    data={memoizedFilesData}
                    rowSeletable={true}
                    actionMenu={true}
                    onActionMenuClick={() => {}}
                    // key={Date.now()}
                    noDataText="Drag and drop files here"
                  />
                </div>
              </section>
            )}
          </Dropzone>
          {!hideActionButtons && (
            <div className="flex justify-end items-center gap-2 mt-12">
              <Button
                type="button"
                variant={'outline'}
                size={'sm'}
                onClick={() => navigate('/projects', { replace: true })}
              >
                Cancel
              </Button>
              <Button
                disabled={saving || Object.keys(errors).length > 0}
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
          )}
        </form>
      </div>
    </Form>
  );
};
