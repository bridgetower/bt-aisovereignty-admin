import React from 'react';
import { useRouteError } from 'react-router-dom';

// Define the props and state types

export const ErrorFallback: React.FC = () => {
  const error: any = useRouteError();
  console.error(error); // Log the error

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-6 text-center text-red-500">
        <h1 className="text-4xl font-semibold">Oops! Got an error</h1>
        <p className="mt-2 text-2xl">{error?.message}</p>
      </div>
    </div>
  );
};
