import { Loader2 } from 'lucide-react';
import React from 'react';

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
  loading: boolean;
};
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (
  props,
) => {
  const { open, description, onConfirm, onCancel, loading } = props;
  return (
    <Dialog open={open} onOpenChange={() => onCancel()} modal>
      <DialogContent>
        <DialogHeader>Confirm</DialogHeader>
        <p className="text-primary font-normal text-sm">{description}</p>
        <DialogFooter>
          <Button size={'sm'} variant={'secondary'} onClick={() => onCancel()}>
            Cancel
          </Button>
          <Button size={'sm'} onClick={() => onConfirm()} disabled={loading}>
            Confirm{' '}
            {loading && <Loader2 size={16} className="ml-2 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
