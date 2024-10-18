import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/context/CoginitoAuthProvider';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../ui/input-otp';
import { Label } from '../ui/label';

// type ResetPasswordProps = {
//   isOpen: boolean;
//   onClose: () => void;
// };

// Define Zod schema for validation
const signUpSchema = z
  .object({
    code: z.string().nonempty({ message: 'code is required' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/\d/, { message: 'Password must contain at least one number' })
      .regex(/[\W_]/, {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// TypeScript type inferred from Zod schema
type SignUpFormInputs = z.infer<typeof signUpSchema>;

// Define default values matching SignUpFormInputs
const defaultValues: SignUpFormInputs = {
  code: '',
  password: '',
  confirmPassword: '',
};

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();

  const username = searchParams.get('username');

  const { resetPassword, isLoading } = useAuth();
  const form = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
    defaultValues,
  });

  const { handleSubmit, control } = form;

  // Form submission handler
  const onSubmit: SubmitHandler<SignUpFormInputs> = (data) => {
    if (username) {
      resetPassword(username, data.code, data.confirmPassword);
    }
  };

  return (
    <div className="w-full">
      <Form {...form}>
        <div className="w-full max-w-[680px] py-[104px] px-[148px] rounded-3xl dark:bg-[#222222] mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center">
            Reset Password
          </h2>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 justify-center items-center mt-8"
          >
            <FormField
              control={control}
              name="code"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <Label className="text-white">Code</Label>
                  <InputOTP
                    className="mx-auto"
                    value={field.value}
                    onChange={field.onChange}
                    maxLength={6}
                  >
                    <InputOTPGroup className="dark:text-white">
                      <InputOTPSlot className="border-white/10" index={0} />
                      <InputOTPSlot className="border-white/10" index={1} />
                      <InputOTPSlot className="border-white/10" index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup className="dark:text-white">
                      <InputOTPSlot className="border-white/10" index={3} />
                      <InputOTPSlot className="border-white/10" index={4} />
                      <InputOTPSlot className="border-white/10" index={5} />
                    </InputOTPGroup>
                  </InputOTP>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="password"
                      className="rounded-xl border-white/10/10 bg-white/5 placeholder:text-white/20 dark:text-white focus:outline-none"
                      placeholder="Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repeat Password"
                      className="rounded-xl border-white/10/10 bg-white/5 placeholder:text-white/20 dark:text-white focus:outline-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button variant="default" className="w-full mt-3" type="submit">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Password
            </Button>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
