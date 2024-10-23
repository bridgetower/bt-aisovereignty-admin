import { ApolloError, useMutation, useQuery } from '@apollo/client';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  CREATE_DOC_REFERENCE,
  DELETE_DOC_REFERENCE,
  FETCH_DOC_REFERENCES,
} from '@/apollo/schemas/knowledgeBaseSchemas';

// Define types for the context state
export interface IDocumentKnowledgeBase {
  createdat: string;
  id: string;
  name: string;
  reftype: string | null;
  url: string | null;
}

type DocKnowledgeBaseContextType = {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  docs: IDocumentKnowledgeBase[];
  loading: boolean;
  error?: ApolloError;
  createDoc: (content: any) => Promise<void>;
  deleteDoc: (id: string) => Promise<void>;
  refetchDocs: (variables?: Record<string, any>) => Promise<any>;
  totalPages: number;
  docType: string;
  setDocType: (docType: string) => void;
  setLoading: (loading: boolean) => void;
};

// Create context with initial empty values
const DocKnowledgeBaseContext = createContext<
  DocKnowledgeBaseContextType | undefined
>(undefined);

// Provider component for the DocKnowledgeBase context
export const DocKnowledgeBaseProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [docs, setDocs] = useState<IDocumentKnowledgeBase[]>([]);
  const [page, setPage] = useState(1); // State for page number
  const [limit, setLimit] = useState(10); // State for limit
  const [totalPages, setTotalPages] = useState(0); // State for total pages
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState('DOCUMENT');

  const idToken = localStorage.getItem('idToken');
  useEffect(() => {
    console.log(docs);
  }, [docs]);

  const {
    loading: initialLoding,
    error,
    refetch,
    data,
  } = useQuery(FETCH_DOC_REFERENCES, {
    variables: { pageNo: page, limit, refType: docType },
    context: {
      headers: {
        identity: idToken,
      },
    },
  });

  useEffect(() => {
    setLoading(initialLoding);
  }, [initialLoding]);
  useEffect(() => {
    if (data && data.ListReference?.data) {
      setDocs(data.ListReference.data.refs || []);
      setTotalPages(data.ListReference?.data.total);
    }
  }, [data]);
  // Function to handle refetch and update loading status
  const handleRefetch = async () => {
    try {
      setLoading(true);
      await refetch({ pageNo: page, limit, refType: docType }); // Await the refetch call to complete
    } catch (err) {
      console.error('Error refetching data:', err);
    } finally {
      setLoading(false); // Ensure loading state is reset
    }
  };
  useEffect(() => {
    if (page && limit && idToken) {
      handleRefetch();
    }
  }, [page, limit, idToken]);

  const [createDocMutation] = useMutation(CREATE_DOC_REFERENCE);
  const [deleteDocMutation] = useMutation(DELETE_DOC_REFERENCE);

  const createDoc = async (content: any): Promise<void> => {
    try {
      const { data } = await createDocMutation({
        variables: { ...content },
        context: {
          headers: {
            identity: idToken,
          },
        },
      });
      if (data) {
        handleRefetch();
      }
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      await deleteDocMutation({
        variables: { refId: id },
        context: {
          headers: {
            identity: idToken,
          },
        },
      });
      setDocs((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  return (
    <DocKnowledgeBaseContext.Provider
      value={{
        docs,
        loading,
        setLoading,
        error,
        createDoc,
        deleteDoc,
        refetchDocs: handleRefetch,
        page,
        limit,
        setPage,
        setLimit,
        totalPages,
        docType,
        setDocType,
      }}
    >
      {children}
    </DocKnowledgeBaseContext.Provider>
  );
};

// Custom hook to use the context
export const useDocKnowledgeBase = () => {
  const context = useContext(DocKnowledgeBaseContext);
  if (context === undefined) {
    throw new Error(
      'useDocKnowledgeBase must be used within a DocKnowledgeBaseProvider',
    );
  }
  return context;
};
