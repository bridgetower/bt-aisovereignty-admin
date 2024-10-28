import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import RightDrawer from '@/components/common/rightDrawer';
import Board from '@/components/projects/Board';
import { CreateProject } from '@/components/projects/CreateProject';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { useProject } from '@/context/ProjectProvider';

export const ProjectList: React.FC = () => {
  const { id, action } = useParams();
  const navigate = useNavigate();
  const [activeRightPanel, setActiveRightPanel] = useState<
    string | null | undefined
  >(action);

  const { selectedProject } = useProject();
  useEffect(() => {
    setActiveRightPanel(action);
  }, [action]);
  const closePanel = () => {
    navigate('/projects', { replace: true });
  };
  return (
    <>
      <RightDrawer onClose={closePanel} isOpen={!!activeRightPanel} title="">
        {action === 'create' ? (
          <CreateProject />
        ) : (
          <ProjectDetails project={selectedProject} />
        )}
      </RightDrawer>

      <div className="min-h-full p-4 rounded-t-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-sm font-semibold text-foreground flex items-center">
            <ArrowLeft size={20} /> Projects
          </h1>
          {/* <CreateNewProject /> */}
        </div>
        <Board />
      </div>
    </>
  );
};
