import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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

import { Button } from '../ui/button';
import { Input } from '../ui/input';

// Define Zod schema for validation
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty({ message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

// TypeScript type inferred from Zod schema
type ForgotPasswordFormInput = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const { forgotPassword, isLoading } = useAuth();

  const form = useForm<ForgotPasswordFormInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { handleSubmit } = form;

  // Form submission handler
  const onSubmit: SubmitHandler<ForgotPasswordFormInput> = (data) => {
    forgotPassword(data.email);
  };

  return (
    <Form {...form}>
      <div className="w-full max-w-[680px] py-[104px] px-[148px]  rounded-3xl dark:bg-[#222222] mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center">
          Forgot Password ?
        </h2>
        <p className="text-sm text-white/40 text-center mt-2">
          Enter your email to reset your password.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center mt-7"
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
                    placeholder="Please enter your email address"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="default" className="w-full mt-7" type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit
          </Button>
        </form>
        <Link to="/sign-in">
          <p className="text-sm text-indigo-400 text-center mt-7">Back</p>
        </Link>
      </div>
    </Form>
  );
};

export default ForgotPasswordForm;
