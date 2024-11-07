// KnowledgeBaseWrapper.tsx
import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { DocKnowledgeBaseProvider } from '@/context/DocKnowledgeBaseProvider';

type KnowledgeBaseWrapperProps = {
  children?: ReactNode;
};

const KnowledgeBaseWrapper: React.FC<KnowledgeBaseWrapperProps> = ({
  children,
}) => {
  return (
    <DocKnowledgeBaseProvider>
      {children ?? <Outlet />}
    </DocKnowledgeBaseProvider>
  );
};

export default KnowledgeBaseWrapper;
