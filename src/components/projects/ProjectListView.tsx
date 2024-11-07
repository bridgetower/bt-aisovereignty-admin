import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useProject } from '@/context/ProjectProvider';
import {
  IProjectAttributes,
  projectColors,
  ProjectStageEnum,
  ProjectStageLabel,
} from '@/types/ProjectData';

import { Skeleton } from '../ui/skeleton';

type Props = {
  projects: IProjectAttributes[];
  isLoading?: boolean;
};
export const ProjectListView: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const { projects, isLoading } = props;
  const { setSelectedProject, selectedProject } = useProject();
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * projectColors.length);
    return projectColors[randomIndex];
  };

  const onProjectSelect = (project: IProjectAttributes) => {
    setSelectedProject(project);
    navigate('/projects/details/' + project.id, { replace: true });
  };
  return (
    <>
      {isLoading ? (
        <>
          <div>
            <Skeleton className="h-20" />
            {[...Array(7)].map((_, idx) => (
              <div className="" key={idx}>
                <div className="flex justify-between mt-2 gap-3">
                  <Skeleton className="h-10 w-1/2" />
                  <Skeleton className="h-10 w-1/4" />
                  <Skeleton className="h-10 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Table className="text-[#334E68]">
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Project State</TableHead>
              <TableHead>Hash Records</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.length ? (
              projects.map((project, i) => (
                <TableRow
                  key={project.id}
                  className={`cursor-pointer ${selectedProject?.id === project.id ? 'bg-[#1677FF1A] hover:bg-[#1677FF1A]' : ''}`}
                  onClick={() => onProjectSelect(project)}
                >
                  <TableCell className="">
                    <div className="flex items-center gap-1 max-w-2xl">
                      <div
                        className={`text-xs p-1 mt-1 px-2 rounded-md w-fit text-[#004440] bg-${getRandomColor()}-200`}
                      >
                        {project.name}
                      </div>
                      {project.hasAlert && (
                        <AlertCircle size={20} stroke="white" fill="#fa8b14" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div
                        className={`bg-${getRandomColor()}-300 rounded-md h-5 w-5 flex items-center justify-center`}
                      >
                        <div className="h-[5px] w-[5px] bg-card rounded-full"></div>
                      </div>
                      <div>
                        {
                          ProjectStageLabel[
                            project.projectstage as ProjectStageEnum
                          ]
                        }
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <div className="bg-[#F0F4F8] h-6 w-6 rounded-md flex items-center justify-center">
                        <div className="text-[#627D98] font-medium">H</div>
                      </div>
                      <div className="bg-[#F0F4F8] h-6 w-6 rounded-md flex items-center justify-center">
                        <div className="text-[#627D98] font-medium">H</div>
                      </div>
                      <div className="bg-[#F0F4F8] h-6 w-6 rounded-md flex items-center justify-center">
                        <div className="text-[#627D98] font-medium">H</div>
                      </div>
                      <div className="bg-[#F0F4F8] h-6 w-6 rounded-md flex items-center justify-center">
                        <div className="text-[#627D98] font-medium">H</div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="py-6 text-center">
                  No projects currently
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
};
