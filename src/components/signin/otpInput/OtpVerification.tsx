import { REGEXP_ONLY_DIGITS } from 'input-otp';
import React, { useState } from 'react';
import Countdown, { CountdownRenderProps } from 'react-countdown';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { Label } from '@/components/ui/label';

export type OtpVerificationProps = {
  user: {
    email: string;
  };
  resendOtp: () => void;
  timer: string | number;
  onOtpChange: (value: string) => void;
};
export const OtpVerification: React.FC<OtpVerificationProps> = ({
  user,
  resendOtp,
  timer,
  onOtpChange,
}) => {
  const [isOtpExpired, setIsOtpExpired] = useState(false);
  const [duration, setDuration] = useState(Date.now() + +timer);

  const renderer = ({ seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      // Render a completed state
      setIsOtpExpired(true);
      return;
    }

    return <p>Timer {seconds} Sec</p>;
  };
  const onresend = () => {
    resendOtp();
    setDuration(Date.now() + +timer);
    setIsOtpExpired(false);
  };
  return (
    <div className="">
      <div className="flex justify-between">
        <Label>Email verification code</Label>
        <p className="font-normal text-xs text-white">
          {!isOtpExpired ? (
            <Countdown
              className="text-white border-white"
              date={duration}
              renderer={renderer}
              intervalDelay={0}
              precision={3}
            />
          ) : (
            <Button variant={'link'} onClick={() => onresend()}>
              Resend OTP
            </Button>
          )}
        </p>
      </div>

      <div className="w-full flex justify-center">
        <InputOTP
          maxLength={6}
          onChange={(value: string) => onOtpChange(value)}
          pattern={REGEXP_ONLY_DIGITS}
          autoFocus
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
      <p className="mt-2 text-xs">
        Enter the 6 digit code sent to {user?.email}
      </p>
    </div>
  );
};
