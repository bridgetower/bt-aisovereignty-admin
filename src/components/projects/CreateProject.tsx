import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDef } from '@tanstack/react-table';
import { CircleHelp, Loader2, MoreVertical } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { IFileContent, useProject } from '@/context/ProjectProvider';
import { ProjectType } from '@/types/ProjectData';

import { DataTable } from '../common/dataTable';
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
  const { createNewProject, refetchProjects } = useProject();
  const [saving, setSaving] = useState(false);
  const [base64Files, setBase64Files] = useState<IFileContent[]>([]);
  const [filesData, setFilesData] = useState<any>([]);
  const memoizedFilesData = React.useMemo(() => filesData, [filesData]);
  useEffect(() => {
    if (base64Files.length > 0) {
      const newFiles = base64Files.map((file, i) => ({
        id: file.fileName + i,
        name: file.fileName,
        doctype: 'File',
        updatedon: new Date().toDateString(),
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
  const onSubmit: SubmitHandler<FormInputs> = (data: FormData) => {
    if (!saving) {
      setSaving(true);
      createNewProject({
        name: data.name,
        description: data.description,
        projectType: data.projecttype,
        organizationId: process.env.REACT_APP_ORGANIZATION_ID || '',
        files: base64Files.map((file) => ({
          fileName: file.fileName,
          fileContent: file.fileContent,
          contentType: file.contentType,
        })),
      })
        .then((res: any) => {
          console.log(res);
          form.reset();
          setFilesData([]);
          refetchProjects();
          toast.success('Project created successfully!');
        })
        .catch((error: any) => {
          toast.error('Failed to create!');
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

  return (
    <Form {...form}>
      <Toaster />
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
                <div
                  className={`${memoizedFilesData?.length ? 'opacity-0' : 'opacity-100'} absolute top-20 left-1/2 -translate-x-1/2 translate-y-4 border-2 border-dashed rounded-lg border-muted-foreground bg-background p-10 mt-3 text-center cursor-pointer z-10 w-2/3`}
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
              columns={knoledgeBaseColums}
              data={memoizedFilesData}
              rowSeletable={true}
              actionMenu={true}
              onActionMenuClick={() => {}}
              // key={Date.now()}
            />
          </div>
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
        </form>
      </div>
    </Form>
  );
};
