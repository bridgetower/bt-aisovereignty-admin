import { Loader2 } from 'lucide-react';
import React from 'react';

import { useLoader } from '@/context/LoaderProvider';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '../ui/dialog';

type ConfirmationDialogProps = {
  open: boolean;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
};
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (
  props,
) => {
  const { isLoading } = useLoader();
  const { open, description, onConfirm, onCancel } = props;
  return (
    <Dialog open={open} onOpenChange={() => onCancel()} modal>
      <DialogContent>
        <DialogHeader>Confirm</DialogHeader>
        <p className="text-primary font-normal text-sm">{description}</p>
        <DialogFooter>
          <Button size={'sm'} variant={'secondary'} onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button size={'sm'} onClick={() => onConfirm()} disabled={isLoading}>
            Confirm{' '}
            {isLoading && <Loader2 size={16} className="ml-2 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
