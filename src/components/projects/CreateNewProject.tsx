import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import { useProject } from '@/context/ProjectProvider';
import { ProjectType } from '@/types/ProjectData';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog';
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

interface FileData {
  name: string;
  description: string;
  projectType: string;
}
const formSchema = z.object({
  name: z.string().min(1, { message: 'URL is required' }),
  projectType: z.string().min(1, { message: 'Project Type is required' }),
  description: z.string().min(1, { message: 'Website name is required' }),
});

// TypeScript type inferred from Zod schema
type FormInputs = z.infer<typeof formSchema>;

const CreateNewProject: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { createNewProject, refetchProjects } = useProject();

  const ProjectTypeArray: { key: string; value: string }[] = Object.entries(
    ProjectType,
  ).map(([key, value]) => ({ key, value }));

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit } = form;
  const onSubmit: SubmitHandler<FormInputs> = (data: FileData) => {
    if (!saving) {
      setSaving(true);
      createNewProject({
        name: data.description,
        description: data.name,
        projectType: data.projectType,
        organizationId: process.env.REACT_APP_ORGANIZATION_ID || '',
      })
        .then((res: any) => {
          refetchProjects();
          toast.success('Project created successfully!');
          toggleModal();
        })
        .catch((error: any) => {
          toast.error('Failed to create!');
        })
        .finally(() => {
          setSaving(false);
        });
    }
  };
  // Toggle modal visibility
  const toggleModal = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <Toaster />
      <Button variant={'default'} size={'sm'} onClick={toggleModal}>
        <Plus size={20} />
        Create Project
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={toggleModal}>
        <DialogContent className="bg-background">
          <DialogHeader className="text-primary">
            Create new project
          </DialogHeader>

          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 justify-center items-center mt-8"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        className="rounded-xl
                  border-white/10 bg-white/5 placeholder:text-white/20 dark:text-white
                  focus:outline-none"
                        placeholder="Project name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        className="rounded-xl
                  border-white/10 bg-white/5 placeholder:text-white/20 dark:text-white
                  focus:outline-none"
                        placeholder="Project description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectType"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Select
                        {...field}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="">
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
                      {/* <Input
                        type="number"
                        className="rounded-xl
                  border-white/10 bg-white/5 placeholder:text-white/20 dark:text-white
                  focus:outline-none"
                        placeholder="projectType"
                        {...field}
                      /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={saving}
                variant="default"
                className="w-full mt-3 flex justify-center items-center"
                type="submit"
              >
                {saving ? 'Saving' : 'Save'}
                {saving && <Loader2 size={16} className="ml-2 animate-spin" />}
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </Form>
  );
};

export default CreateNewProject;
