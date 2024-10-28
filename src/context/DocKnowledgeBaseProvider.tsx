import { ApolloError, useMutation, useQuery } from '@apollo/client';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import toast from 'react-hot-toast';

import {
  CREATE_DOC_REFERENCE,
  DELETE_DOC_REFERENCE,
  FETCH_DOC_REFERENCES,
} from '@/apollo/schemas/knowledgeBaseSchemas';

import { useLoader } from './LoaderProvider';

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
  error?: ApolloError;
  createDoc: (content: any) => Promise<void>;
  deleteDoc: (id: string) => Promise<void>;
  refetchDocs: (variables?: Record<string, any>) => Promise<any>;
  totalPages: number;
  docType: string;
  setDocType: (docType: string) => void;
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
  const [docType, setDocType] = useState('DOCUMENT');

  const { isLoading, showLoader, hideLoader } = useLoader();
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
    variables: {
      pageNo: page,
      limit,
      refType: docType,
      projectId: '00a1ee91-b2f1-41e6-94f5-0201fd127a01',
    },
    context: {
      headers: {
        identity: idToken,
      },
    },
  });

  useEffect(() => {
    if (initialLoding) {
      showLoader();
    } else {
      hideLoader();
    }
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
      showLoader(); // Show loader
      await refetch({ pageNo: page, limit, refType: docType }); // Await the refetch call to complete
    } catch (err) {
      console.error('Error refetching data:', err);
    } finally {
      hideLoader(); // Hide loader
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
      if (data?.AddRefToKnowledgeBase?.status === 200) {
        toast.success('File uploaded successfully');
        handleRefetch();
      } else {
        toast.error(data?.AddRefToKnowledgeBase?.error);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error in creating document:');
    }
  };

  const deleteDoc = async (id: string): Promise<void> => {
    try {
      const resp = await deleteDocMutation({
        variables: { refId: id },
        context: {
          headers: {
            identity: idToken,
          },
        },
      });
      if (resp.data?.DeleteRefToKnowledgeBase?.status === 200) {
        setDocs((prev) => prev.filter((doc) => doc.id !== id));
      } else {
        toast.error(resp.data?.DeleteRefToKnowledgeBase?.error);
      }
    } catch (err: any) {
      toast.error(err?.message || 'Error in deleting document:');
    }
  };

  return (
    <DocKnowledgeBaseContext.Provider
      value={{
        docs,
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
