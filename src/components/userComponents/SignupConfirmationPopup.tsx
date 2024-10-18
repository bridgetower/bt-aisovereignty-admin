// src/components/ConfirmSignup.tsx
import React, { useState } from 'react';

import { useAuth } from '@/context/CoginitoAuthProvider';

import { OtpVerification } from '../signin/otpInput/OtpVerification';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from '../ui/dialog';
import { Separator } from '../ui/separator';

interface ConfirmSignupProps {
  isOpen: boolean;
  onClose: () => void;
  username: string;
}

const SignupConfirmSignup: React.FC<ConfirmSignupProps> = ({
  isOpen,
  onClose,
  username,
}) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  // const [loading, setLoading] = useState<boolean>(false);
  // const navigate = useNavigate()
  const { resendConfirmationCode, verifyConfirmationCode, isLoading } =
    useAuth();

  const onConfirm = () => {
    verifyConfirmationCode(username, confirmationCode, onClose);
  };
  const onInputChange = (value: string) => {
    setConfirmationCode(value);
  };
  const resendCode = () => {
    resendConfirmationCode(username);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-foreground dark:text-white">
        <DialogHeader>Confirm Signup</DialogHeader>
        <DialogClose />
        <Separator />
        <div className="py-5">
          <OtpVerification
            onOtpChange={onInputChange}
            resendOtp={resendCode}
            timer={60000}
            user={{ email: username }}
          />
        </div>
        <DialogFooter className="flex w-full">
          <Button onClick={onConfirm}>Confirm</Button>
          <Button className="ml-1" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupConfirmSignup;
