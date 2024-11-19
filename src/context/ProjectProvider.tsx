import {
  ApolloError,
  FetchResult,
  useLazyQuery,
  useMutation,
  useQuery,
} from '@apollo/client';
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
} from '@/apollo/schemas/knowledgeBaseSchemas';
import {
  CREATE_NEW_PROJECT,
  FETCH_PROJECT_BY_ID,
  FETCH_PROJECT_LIST,
  UPDATE_PROJECT_STATUS,
} from '@/apollo/schemas/projectSchemas';
import { IProjectAttributes } from '@/types/ProjectData';

import { useLoader } from './LoaderProvider';

// Define types for the context state

export interface IFileContent {
  fileName: string;
  contentType: string;
  isLocal?: boolean;
  fileContent?: string;
  id?: string;
  fileSize?: string;
  hash?: string;
}
export interface ICreateProjectPayload {
  name: string;
  description: string;
  projectType: string;
  organizationId: string;
  files: IFileContent[];
}
type ProjectContextType = {
  page: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  projects: IProjectAttributes[];
  error?: ApolloError;
  createNewProject: (
    content: ICreateProjectPayload,
  ) => Promise<FetchResult<any>>;
  refetchProjects: (variables?: Record<string, any>) => Promise<any>;
  totalPages: number;
  organizationId: string;
  setOrganizationId: (organizationId: string) => void;
  selectedProject: IProjectAttributes | null;
  setSelectedProject: (project: IProjectAttributes | null) => void;
  getProjectDetails: (content: {
    projectId: string;
    page: number;
    limit: number;
  }) => Promise<FetchResult<FetchResult<any>>>;
  updateProjectStatusMutation: (content: {
    projectId: string;
  }) => Promise<FetchResult<any>>;
  deleteDocReference: (id: string) => Promise<FetchResult<any>>;
  updateKnowledgebase: (content: {
    projectId: string;
    files: IFileContent[];
  }) => Promise<FetchResult<any>>;
  setNotificationPanel: (value: boolean) => void;
  notificationPanel: boolean;
  loadingProject?: boolean;
};

// Create context with initial empty values
const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [projects, setProject] = useState<IProjectAttributes[]>([]); // State for projects;
  const [page, setPage] = useState(1); // State for page number
  const [limit, setLimit] = useState(1000); // State for limit
  const [totalPages, setTotalPages] = useState(0); // State for total pages
  const [notificationPanel, setNotificationPanel] = useState<boolean>(true);
  const [selectedProject, setSelectedProject] =
    useState<IProjectAttributes | null>(null);
  const [organizationId, setOrganizationId] = useState(
    process.env.REACT_APP_ORGANIZATION_ID || '',
  ); // State for organization ID

  const { showLoader, hideLoader } = useLoader();
  const idToken = localStorage.getItem('idToken');
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchWithoutLoader();
    }, 30000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const {
    loading: initialLoding,
    error,
    refetch,
    data,
  } = useQuery(FETCH_PROJECT_LIST, {
    variables: {
      pageNo: page,
      limit,
      organizationId,
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
    if (data && data.ListProject?.data?.projects?.length) {
      const list = data.ListProject.data.projects.map(
        (project: IProjectAttributes, i: number) => {
          return {
            ...project,
            // hasAlert: i === 0 ? true : false,
          };
        },
      );
      setProject(list);
      setTotalPages(data.ListProject?.data.total);
    }
  }, [data]);
  // Function to handle refetch and update loading status
  const handleRefetch = async () => {
    try {
      showLoader(); // Show loader
      await refetch({
        pageNo: page,
        limit,
        organizationId,
      }); // Await the refetch call to complete
    } catch (err) {
      console.error('Error refetching data:', err);
    } finally {
      hideLoader(); // Hide loader
    }
  };
  const fetchWithoutLoader = async () => {
    try {
      await refetch({
        pageNo: page,
        limit,
        organizationId,
      }); // Await the refetch call to complete
    } catch (err) {
      console.error('Error refetching data:', err);
    }
  };
  useEffect(() => {
    if (page && limit && idToken) {
      handleRefetch();
    }
  }, [page, limit, idToken]);

  const [createProjectMutation] = useMutation(CREATE_NEW_PROJECT);
  const [getProjectById, { loading: loadingDetails }] = useLazyQuery(
    FETCH_PROJECT_BY_ID,
    {
      fetchPolicy: 'network-only',
    },
  );
  const [addDocToknowledgebase] = useMutation(CREATE_DOC_REFERENCE);
  const [updateProjectStatus] = useMutation(UPDATE_PROJECT_STATUS);
  const [deleteDocMutation] = useMutation(DELETE_DOC_REFERENCE);
  const createNewProject = async (
    content: ICreateProjectPayload,
  ): Promise<FetchResult<any>> => {
    return createProjectMutation({
      variables: { ...content },
      context: {
        headers: {
          identity: idToken,
        },
      },
    });
  };
  const getProjectDetails = async (content: {
    projectId: string;
    page: number;
    limit: number;
  }): Promise<any> => {
    return getProjectById({
      variables: {
        projectId: content.projectId,
        limit: content.limit,
        pageNo: content.page,
      },
      context: {
        headers: {
          identity: idToken,
        },
      },
    });
  };
  const updateProjectStatusMutation = async (content: {
    projectId: string;
  }): Promise<FetchResult<any>> => {
    return updateProjectStatus({
      variables: { ...content },
      context: {
        headers: {
          identity: idToken,
        },
      },
    });
  };
  const updateKnowledgebase = async (content: {
    files: IFileContent[];
    projectId: string;
  }): Promise<FetchResult<any>> => {
    return addDocToknowledgebase({
      variables: {
        files: content.files,
        projectId: content.projectId,
        refType: 'DOCUMENT',
      },
      context: {
        headers: {
          identity: idToken,
        },
      },
    });
  };
  const deleteDocReference = async (id: string): Promise<FetchResult<any>> => {
    return deleteDocMutation({
      variables: { refId: id },
      context: {
        headers: {
          identity: idToken,
        },
      },
    });
  };

  return (
    <ProjectContext.Provider
      value={{
        projects,
        error,
        createNewProject,
        refetchProjects: handleRefetch,
        updateProjectStatusMutation,
        page,
        limit,
        setPage,
        setLimit,
        totalPages,
        organizationId,
        setOrganizationId,

        selectedProject,
        setSelectedProject,

        getProjectDetails,
        deleteDocReference,
        updateKnowledgebase,

        setNotificationPanel,
        notificationPanel,
        loadingProject: initialLoding || loadingDetails,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectContextProvider');
  }
  return context;
};
