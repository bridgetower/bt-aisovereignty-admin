import React from 'react';

import { TActivitiesItem, TNotificationItem } from '@/utils/data/notifications';

import { Avatar, AvatarImage } from '../ui/avatar';
import Icon from './Icon';

interface NotificationsProps {
  notificationData: TNotificationItem[];
  activitiesData: TActivitiesItem[];
}

const Notifications: React.FC<NotificationsProps> = ({
  notificationData,
  activitiesData,
}) => {
  return (
    <div className="p-5 text-white">
      <h3 className="text-sm font-semibold justify-start text-start">
        Notifications
      </h3>
      <div className="mt-4 flex flex-col gap-y-4">
        {notificationData.map((notifications, index) => (
          <div key={index} className="flex gap-2">
            <div className="flex justify-center items-center rounded-lg w-6 h-6 bg-white">
              <Icon
                name={notifications.icon}
                color="black"
                height={16}
                width={16}
              />
            </div>
            <div>
              <p className="text-sm font-normal">{notifications.title}</p>
              <p className="text-xs text-white/40">
                {notifications.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="text-sm font-semibold justify-start text-start mt-9">
        Activities
      </h3>
      <div className="mt-4 flex flex-col gap-y-2">
        {activitiesData.map((activies, index) => (
          <div key={index} className="flex gap-5">
            <div className="flex flex-col items-center">
              <Avatar className="w-6 h-6">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
              </Avatar>
              <div className="mt-2 text-white/10">|</div>
            </div>
            <div>
              <p className="text-sm font-normal">{activies.title}</p>
              <p className="text-xs text-white/40">{activies.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
