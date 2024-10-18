import React from 'react';

import SignInForm from '@/components/signin/SignInForm';

const SignIn = () => {
  return (
    <div className="h-[calc(100vh-160px)] flex items-center justify-center">
      <SignInForm />
    </div>
  );
};

export default SignIn;
