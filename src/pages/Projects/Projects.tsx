import React from 'react';

import Board from '@/components/projects/Board';
import CreateNewProject from '@/components/projects/CreateNewProject';

export const ProjectList: React.FC = () => {
  return (
    <>
      <div className="bg-background min-h-full p-4 rounded-2xl">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">Projects</h1>
          <CreateNewProject />
        </div>
        <Board />
      </div>
    </>
  );
};
