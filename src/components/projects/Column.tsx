// src/components/Column.tsx
import React, { ReactNode } from 'react';

import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

interface ColumnProps {
  title: string;
  children: ReactNode;
}

const Column: React.FC<ColumnProps> = ({ title, children }) => {
  return (
    <div className="bg-black rounded-2xl shadow-md w-80 p-4 mx-2">
      <h2 className="font-medium text-base mb-4  whitespace-nowrap ">
        {title ? (
          title.replace('_', ' ')
        ) : (
          <Skeleton className="h-4 w-[200px]" />
        )}
      </h2>
      <Separator />
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export default Column;
