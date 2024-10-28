import {
  ApolloError,
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
import toast from 'react-hot-toast';

import {
  CREATE_NEW_PROJECT,
  FETCH_PROJECT_BY_ID,
  FETCH_PROJECT_LIST,
} from '@/apollo/schemas/projectSchemas';
import { IProjectAttributes } from '@/types/ProjectData';

import { useLoader } from './LoaderProvider';

// Define types for the context state

export interface IFileContent {
  fileName: string;
  fileContent: string;
  contentType: string;
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
  createNewProject: (content: ICreateProjectPayload) => Promise<void>;
  refetchProjects: (variables?: Record<string, any>) => Promise<any>;
  totalPages: number;
  organizationId: string;
  setOrganizationId: (organizationId: string) => void;
  selectedProject: IProjectAttributes | null;
  setSelectedProject: (project: IProjectAttributes | null) => void;
  getProjectDetails: (content: { projectId: string }) => Promise<any>;
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
  const [selectedProject, setSelectedProject] =
    useState<IProjectAttributes | null>(null);
  const [organizationId, setOrganizationId] = useState(
    process.env.REACT_APP_ORGANIZATION_ID || '',
  ); // State for organization ID

  const { showLoader, hideLoader } = useLoader();
  const idToken = localStorage.getItem('idToken');
  useEffect(() => {
    console.log(projects);
  }, [projects]);

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
      // showLoader();
    } else {
      hideLoader();
    }
  }, [initialLoding]);

  useEffect(() => {
    if (data && data.ListProject?.data?.projects) {
      setProject(data.ListProject?.data?.projects || []);
      setTotalPages(data.ListProject?.data.total);
    }
  }, [data]);
  // Function to handle refetch and update loading status
  const handleRefetch = async () => {
    try {
      // showLoader(); // Show loader
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
  useEffect(() => {
    if (page && limit && idToken) {
      handleRefetch();
    }
  }, [page, limit, idToken]);

  const [createProjectMutation] = useMutation(CREATE_NEW_PROJECT);
  const [getProjectById] = useLazyQuery(FETCH_PROJECT_BY_ID);

  const createNewProject = async (
    content: ICreateProjectPayload,
  ): Promise<void> => {
    try {
      const { data } = await createProjectMutation({
        variables: { ...content },
        context: {
          headers: {
            identity: idToken,
          },
        },
      });
      if (data.CreateProject?.status === 200) {
        handleRefetch();
      } else {
        toast.error(data.CreateProject?.error);
      }
    } catch (err) {
      console.error('Error creating document:', err);
    }
  };
  const getProjectDetails = async (content: {
    projectId: string;
  }): Promise<any> => {
    return getProjectById({
      variables: { ...content, limit: 1, pageNo: 1 },
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
