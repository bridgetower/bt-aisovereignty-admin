// src/components/Card.tsx
import React from 'react';

import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader } from '../ui/card';

interface CardProps {
  title: string;
  description: string;
  status: string;
  projecttype: string;
  onClick?: () => void;
}

const ProjectCard: React.FC<CardProps> = ({
  title,
  description,
  projecttype,
  status,
  onClick = () => {},
}) => {
  return (
    <Card
      className="bg-card shadow rounded-2xl border-none cursor-pointer mt-4"
      onClick={() => onClick()}
    >
      <CardContent>
        <CardHeader className="pt-4 pb-0 px-0">{title}</CardHeader>
        <div className="flex py-3">
          <Badge variant="success">{status}</Badge>
          <Badge variant="info" className="ml-2">
            {projecttype.replace('_', ' ')}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground ">{description}</p>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
