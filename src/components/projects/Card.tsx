// src/components/Card.tsx
import { AlertCircle, MoreVertical } from 'lucide-react';
import React from 'react';

import { IProjectAttributes, projectColors } from '@/types/ProjectData';

import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

interface CardProps {
  data: any[];
  title: string;
  onClick?: () => void;
  isSelectd: boolean;
}

export const ProjectCard: React.FC<CardProps> = ({
  title,
  data,
  isSelectd,
  onClick = () => {},
}) => {
  const getRandomColor = () => {
    const randomIndex = Math.floor(Math.random() * projectColors.length);
    return projectColors[randomIndex];
  };
  return (
    <Card
      className={`shadow rounded-xl cursor-pointer w-56 relative hover:border-[#D9E2EC] border-4 hover:bg-[#1677FF1A] ${isSelectd ? 'border-[#D9E2EC] border-4 bg-[#1677FF1A]' : 'bg-card border-4 border-card'}`}
      onClick={() => onClick()}
    >
      <CardContent className="p-0 pt-4">
        <div className="flex justify-between">
          <div
            className={`ml-4 h-20 rounded-md w-1 bg-${getRandomColor()}-300`}
          ></div>
          <div>
            <div className="flex">
              <div className="p-0 text-[#243B53] text-md font-semibold">
                {title}
              </div>
              {/* {data.length ? (
                <Badge variant="outline" className="ml-3">
                  {data.length}
                </Badge>
              ) : null} */}
            </div>
            <div className="flex items-baseline gap-1">
              <div className="text-4xl text-[#486581]">{data.length}</div>
              <div>Project</div>
            </div>
          </div>
          <div className="-mt-3">
            <Button
              variant={'link'}
              className="text-muted-foreground"
              size={'sm'}
            >
              <MoreVertical />
            </Button>
          </div>
        </div>
        <div className="w-full mt-2 border-t border-neutral-300  pl-6">
          {/* {data.map((project, i) => (
            <div
              className={`text-xs p-1 mt-1 px-2 rounded-md w-fit text-info bg-${getRandomColor()}-200`}
              key={i}
            >
              {project.name}
            </div>
          ))} */}
          {data.length
            ? data.map(
                (project: IProjectAttributes, i) =>
                  project.hasAlert && (
                    <div className="flex items-center gap-1" key={i}>
                      <div
                        className={`text-xs p-1 my-2 px-2 rounded-md w-fit text-info bg-${getRandomColor()}-200`}
                      >
                        {project.name}
                      </div>
                      <span>
                        <AlertCircle size={20} className="text-warning" />
                      </span>
                    </div>
                  ),
              )
            : null}
        </div>
      </CardContent>
    </Card>
  );
};
