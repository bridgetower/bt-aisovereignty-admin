import { PanelLeftDashed } from 'lucide-react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';

import Sidebar from './Sidebar';

export function SidebarDrawer() {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <PanelLeftDashed className="cursor-pointer" size={14} />
      </DrawerTrigger>
      <DrawerContent className="left-0 h-screen w-[220px] border-none bg-black">
        <Sidebar />
        <DrawerFooter className="pt-2 fixed top-2 right-2 z-50">
          <DrawerClose className="text-white cursor-pointer" asChild>
            <p className="h-6 w-6 flex items-center justify-center"> X</p>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
