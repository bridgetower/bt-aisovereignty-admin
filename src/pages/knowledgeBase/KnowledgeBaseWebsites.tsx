import { useEffect } from 'react';

import { KnowledgeBaseWebsites } from '@/components/KnowledgeBaseWebsites/KnowledgeBaseWebsites';
import { useDocKnowledgeBase } from '@/context/DocKnowledgeBaseProvider';

export const KnowledgeBaseWebsitesContainer = () => {
  const { setDocType } = useDocKnowledgeBase();
  useEffect(() => {
    setDocType('WEBSITE');
  }, []);
  return (
    <>
      <KnowledgeBaseWebsites />
    </>
  );
};
