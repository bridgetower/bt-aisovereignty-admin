import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface StageTypeData {
  name: string;
  description: string;
}
const formSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
});

// TypeScript type inferred from Zod schema
type FormInputs = z.infer<typeof formSchema>;
type AddEditSatgeTypeProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const AddEditSatgeType: React.FC<AddEditSatgeTypeProps> = (props) => {
  const { isOpen, onClose } = props;
  const [saving, setSaving] = useState(false);
  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit } = form;
  const onSubmit: SubmitHandler<FormInputs> = (data: StageTypeData) => {
    if (!saving) {
      setSaving(true);
      //   createDoc({
      //     name: data.name,
      //     description: data.description,
      //   })
      //     .then(() => {
      //       toast.success('File uploaded successfully');
      //       onClose();
      //       refetchDocs();
      //     })
      //     .catch((error: any) => {
      //       toast.error('Failed to save!');
      //     })
      //     .finally(() => {
      //       setSaving(false);
      //     });
    }
  };
  // Toggle modal visibility
  const toggleModal = () => {
    if (!isOpen) {
      form.reset();
    }
    onClose();
  };

  return (
    <Form {...form}>
      <Toaster />
      {/* Modal */}
      <Dialog open={isOpen} onOpenChange={toggleModal}>
        <DialogContent className="">
          <DialogHeader className="text-primary">
            Add new stage type
          </DialogHeader>

          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4 justify-center items-center mt-8"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        className="rounded-md
                  focus:outline-none"
                        placeholder="Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        rows={5}
                        className="rounded-md
                  focus:outline-none"
                        placeholder="Description"
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
