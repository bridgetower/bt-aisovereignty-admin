// src/components/Column.tsx
import React, { ReactNode } from 'react';

interface ColumnProps {
  children: ReactNode;
}

const Column: React.FC<ColumnProps> = ({ children }) => {
  return (
    <div className="w-80 p-4 mx-2">
      <div className="space-y-2">{children}</div>
    </div>
  );
};

export default Column;
