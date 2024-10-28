// src/components/Card.tsx
import { MoreVertical } from 'lucide-react';
import React from 'react';

import { projectColors } from '@/types/ProjectData';

import { Badge } from '../ui/badge';
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
      className={`shadow rounded-xl cursor-pointer w-56 relative ${isSelectd ? 'border-primary border-4 bg-blue-200' : 'bg-card border-4 border-card'}`}
      onClick={() => onClick()}
    >
      <CardContent className="p-0 pt-4 pb-10">
        <div className="flex justify-between">
          <div
            className={`ml-4 h-20 rounded-md w-1 bg-${getRandomColor()}-300`}
          ></div>
          <div>
            <div className="flex">
              <div className="p-0 text-[#243B53] text-md font-semibold">
                {title}
              </div>
              {data.length ? (
                <Badge variant="outline" className="ml-3">
                  {data.length}
                </Badge>
              ) : null}
            </div>
            {data && data.length ? (
              data.map((project, i) => (
                <div
                  className={`text-xs p-1 mt-1 px-2 rounded-md w-fit text-info bg-${getRandomColor()}-200`}
                  key={i}
                >
                  {project.name}
                </div>
              ))
            ) : (
              <div className="text-[#486581] text-sm mt-4">
                No projects currently
              </div>
            )}
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
        <div className="h-9 w-full mt-2 border-t border-muted absolute bottom-0" />
      </CardContent>
    </Card>
  );
};
