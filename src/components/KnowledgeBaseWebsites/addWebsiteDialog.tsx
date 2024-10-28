import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import { useDocKnowledgeBase } from '@/context/DocKnowledgeBaseProvider';

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

interface FileData {
  websiteUrl: string;
  websiteName: string;
  depth: string;
}
const formSchema = z.object({
  websiteUrl: z.string().min(1, { message: 'URL is required' }),
  depth: z.string().min(1, { message: 'Depth is required' }),
  websiteName: z.string().min(1, { message: 'Website name is required' }),
});

// TypeScript type inferred from Zod schema
type FormInputs = z.infer<typeof formSchema>;

const AddWebsiteDialog: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { createDoc, refetchDocs } = useDocKnowledgeBase();
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit } = form;
  const onSubmit: SubmitHandler<FormInputs> = (data: FileData) => {
    if (!saving) {
      setSaving(true);
      createDoc({
        projectId: '00a1ee91-b2f1-41e6-94f5-0201fd127a01',
        refType: 'WEBSITE',
        websiteName: data.websiteName,
        websiteUrl: data.websiteUrl,
        depth: data.depth,
        file: {
          fileContent: '',
          fileName: '',
          contentType: '',
        },
      })
        .then(() => {
          toast.success('File uploaded successfully');
          setIsOpen(false);
          refetchDocs();
        })
        .catch((error: any) => {
          toast.error('Failed to save!');
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
      <Button
        variant={'default'}
        className=""
        onClick={toggleModal}
        title="Add new website"
      >
        <Plus size={20} />
        Add new
      </Button>

      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={toggleModal}>
        <DialogContent className="">
          <DialogHeader className="text-primary">Add new website</DialogHeader>

          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 justify-center items-center mt-8"
            >
              <FormField
                control={form.control}
                name="websiteName"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        className="rounded-xl
                  border-white/10 bg-white/5 placeholder:text-white/20 dark:text-white
                  focus:outline-none"
                        placeholder="Website name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        className="rounded-xl
                  border-white/10 bg-white/5 placeholder:text-white/20 dark:text-white
                  focus:outline-none"
                        placeholder="Website url"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="depth"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="number"
                        className="rounded-xl
                  border-white/10 bg-white/5 placeholder:text-white/20 dark:text-white
                  focus:outline-none"
                        placeholder="Depth"
                        {...field}
                      />
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

export default AddWebsiteDialog;
