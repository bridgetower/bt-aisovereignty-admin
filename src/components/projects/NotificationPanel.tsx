import React from 'react';

import { ActionStatus, statusColor } from '@/types/ProjectData';

import { Badge } from '../ui/badge';

interface NotificationCardProps {
  title: string;
  alertType: ActionStatus;
  message: string;
  time: string;
  isRead: boolean;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  alertType,
  message,
  time,
  isRead,
}) => {
  return (
    <div
      className={`bg-background text-foreground rounded-lg shadow-md p-4 mb-4 cursor-pointer ${isRead ? 'opacity-70' : 'opacity-100'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className={`w-2.5 h-2.5 bg-${statusColor[alertType].text.replace('text-', '')} rounded-full mr-2`}
          ></div>
          <span className="font-bold text-lg">{title}</span>
        </div>
        <Badge
          className={`text-sm ${statusColor[alertType].text + ' ' + statusColor[alertType].bg} hover:${statusColor[alertType].bg}`}
        >
          {alertType}
        </Badge>
      </div>
      <p className="my-4 text-foreground text-sm">
        <span className="font-semibold">Description :</span> {message}
      </p>
      <div className="flex items-center justify-between mt-3 text-sm text-card-foreground">
        <span>{time}</span>
      </div>
    </div>
  );
};

export const NotificationsList: React.FC = () => {
  return (
    <div className="flex items-center justify-center px-6 py-4">
      <div className="w-full">
        <NotificationCard
          title="Project Name 1"
          alertType="ERROR"
          message="Project Name 1 file error"
          time="Today, 02:26 PM"
          isRead={false}
        />
        <NotificationCard
          title="Project Name 2"
          alertType="CANCELLED"
          message="Project Name 2 moved to next stage"
          time="Today, 02:26 PM"
          isRead={false}
        />
        <NotificationCard
          title="Project Name 2"
          alertType="COMPLETED"
          message="Project Name 2 moved to next stage"
          time="Today, 02:26 PM"
          isRead={true}
        />
        <NotificationCard
          title="Project Name 2"
          alertType="INITIATED"
          message="Project Name 2 moved to next stage"
          time="Today, 02:26 PM"
          isRead={true}
        />
        <NotificationCard
          title="Project Name 2"
          alertType="ACTIVE"
          message="Project Name 2 moved to next stage"
          time="Today, 02:26 PM"
          isRead={true}
        />
      </div>
    </div>
  );
};
