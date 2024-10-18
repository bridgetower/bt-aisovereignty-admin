import { useEffect } from 'react';

import { Loader } from '@/components/common/Loader';
import { KnowledgeBaseWebsites } from '@/components/KnowledgeBaseWebsites/KnowledgeBaseWebsites';
import { useDocKnowledgeBase } from '@/context/DocKnowledgeBaseProvider';

export const KnowledgeBaseWebsitesContainer = () => {
  const { loading, setDocType } = useDocKnowledgeBase();
  useEffect(() => {
    setDocType('WEBSITE');
  }, []);
  return (
    <>
      <Loader show={loading} />
      <KnowledgeBaseWebsites />
    </>
  );
};
