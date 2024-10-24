import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/CoginitoAuthProvider';

import MFAInput from '../common/MfaInput';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import SignupConfirmSignup from '../userComponents/SignupConfirmationPopup';
import { TwoFaSetting } from '../userComponents/TwoFASetting';

// Define Zod schema for validation
const signInSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
  password: z
    .string()
    .nonempty({ message: 'Password is required' })
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

// TypeScript type inferred from Zod schema
type SignInFormInputs = z.infer<typeof signInSchema>;

const SignInForm = () => {
  const [username, setUsername] = useState('');
  const [mfaCode, setMfaCode] = useState('');

  const {
    signInWithEmail,
    showVerifyOtp,
    setShowVerifyOtp,
    verifyTOTP,
    showMfaSettingModal,
    setShowMfaSettingModal,
    showVerifySignupModal,
    setShowVerifySignupModal,
    isLoading,
  } = useAuth();

  const form = useForm<SignInFormInputs>({
    resolver: zodResolver(signInSchema),
  });

  const { handleSubmit } = form;

  // Form submission handler
  const onSubmit: SubmitHandler<SignInFormInputs> = (data) => {
    setUsername(data.email);
    signInWithEmail(data.email, data.password);
  };

  const onCloseConfirmationPopup = () => {
    setShowVerifySignupModal(false);
  };

  const onMFAInputChange = (code: string) => {
    setMfaCode(code);
  };

  return (
    <Form {...form}>
      <MFAInput
        onSubmit={() => verifyTOTP(mfaCode)}
        onOtpChange={onMFAInputChange}
        isOpen={showVerifyOtp}
        onClose={() => setShowVerifyOtp(false)}
      />
      <TwoFaSetting
        is2FaEnabled={false}
        open={showMfaSettingModal}
        onClose={() => setShowMfaSettingModal(false)}
      />
      <SignupConfirmSignup
        isOpen={showVerifySignupModal}
        onClose={onCloseConfirmationPopup}
        username={username}
      />
      <div className="w-full max-w-[680px] py-[104px] px-[148px] rounded-3xl bg-background mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center">
          Sign In
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 justify-center items-center mt-8"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    className="rounded-xl
                  border-white/10 bg-white/5 placeholder:text-white/20 dark:text-white
                  focus:outline-none"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    type="password"
                    className="rounded-xl
                  border-white/10 bg-white/5 placeholder:text-white/20 dark:text-white
                  focus:outline-none"
                    placeholder="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end w-full">
            <Link to="/forgot-password" className="text-sm text-indigo-400">
              Forgot Password?
            </Link>
          </div>

          <Button
            disabled={isLoading}
            variant="default"
            className="w-full mt-3"
            type="submit"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default SignInForm;
