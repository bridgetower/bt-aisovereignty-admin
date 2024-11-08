import React, { useEffect, useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

import RightDrawer from '@/components/common/rightDrawer';
import Board from '@/components/projects/Board';
import { CreateProject } from '@/components/projects/CreateProject';
import ProjectDetails from '@/components/projects/ProjectDetails';
import { UpdateProject } from '@/components/projects/UpdateProject';
import { useDashboardContext } from '@/context/DashboardProvider';

export const ProjectList: React.FC = () => {
  const navigate = useNavigate();
  const { id, action } = useParams();
  const [activeRightPanel, setActiveRightPanel] = useState<
    string | null | undefined
  >(action);
  const { toggleNotification, isNotificationOpen } = useDashboardContext();
  useEffect(() => {
    setActiveRightPanel(action);
  }, [action]);
  const closePanel = () => {
    navigate('/projects', { replace: true });
    // window.history.back();
  };
  return (
    <>
      <Toaster />
      <RightDrawer onClose={closePanel} isOpen={!!activeRightPanel} title="">
        {action === 'create' ? (
          <CreateProject />
        ) : action === 'edit' ? (
          <UpdateProject id={id || ''} />
        ) : (
          <ProjectDetails id={id || ''} />
        )}
      </RightDrawer>
      <div className="min-h-full rounded-t-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold text-foreground flex items-center">
            Projects
          </div>
          {/* <CreateNewProject /> */}
        </div>
        <Board />
      </div>
    </>
  );
};
