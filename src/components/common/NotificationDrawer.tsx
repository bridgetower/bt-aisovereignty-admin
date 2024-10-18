import { PanelLeftDashed } from 'lucide-react';

import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { activitiesData, notificationsData } from '@/utils/data/notifications';

import { ScrollArea } from '../ui/scroll-area';
import Notifications from './Notifications';

export function NotificationDrawer() {
  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <PanelLeftDashed className="cursor-pointer" size={20} />
      </DrawerTrigger>
      <DrawerContent className="right-0 bottom-[unset] top-0 mt-0 left-[unset] w-[220px] border-0 bg-black focus-visible:outline-none">
        <ScrollArea className="h-screen">
          <Notifications
            notificationData={notificationsData}
            activitiesData={activitiesData}
          />
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
