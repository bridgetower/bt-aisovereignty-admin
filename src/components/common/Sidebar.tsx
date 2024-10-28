import { useAuth } from '@/context/CoginitoAuthProvider';
import {
  admintNavigationList,
  mainNavigationList,
  projectNavigationList,
  TNavItem,
} from '@/utils/data/nav';

import { Accordion } from '../ui/accordion';
import { Button } from '../ui/button';
import SidebarCollapsible from './SidebarCollapsible';

const Sidebar = () => {
  const { logout } = useAuth();
  // const favoritePages = useReadLocalStorage('favourite-pages') as {
  //   name: string;
  //   path: string;
  // }[];

  // const recentPages = useReadLocalStorage('recent-pages') as string[];

  // const allNavList = [...mainNavigationList, ...secondaryNavigationList];

  // function findMenuItemByPath(items: any, targetPath: string) {
  //   for (const item of items) {
  //     // Check if the current item matches the path
  //     if (item.path === targetPath) {
  //       return { label: item.label, path: item.path };
  //     }

  //     // If the item has subItems, search recursively in the subItems array
  //     if (item.subItems && item.subItems.length > 0) {
  //       const result = findMenuItemByPath(item.subItems, targetPath) as any;

  //       if (result) {
  //         return { label: `${item.label}/${result.label}`, path: result.path };
  //       }
  //     }
  //   }
  //   // Return null if no match is found
  //   return null;
  // }

  return (
    <aside
      id="sidebar"
      aria-label="Sidebar"
      className="fixed h-full  w-[212px] flex flex-col pl-5 py-6 overflow-y-auto text-foreground "
    >
      <h5 className="text-xl font-semibold mb-6">LLM Admin</h5>

      <span className="text-foreground text-xs p-4 pb-3">MAIN MENU</span>
      <NavList data={mainNavigationList} />

      <span className="text-foreground text-xs p-4 pb-3">PROJECTS</span>
      <NavList data={projectNavigationList} />

      <span className="text-foreground text-xs p-4 pb-3">ADMIN MENU</span>
      <NavList data={admintNavigationList} />

      {/* <Accordion type="single" collapsible className="w-full my-4 px-3">
        {secondaryNavigationList.map((data, i) => (
          <NavListAccordion data={data} key={i} />
        ))}
      </Accordion> */}

      <div className="mt-auto flex flex-col gap-2">
        {/* <Button variant="outline">Settings</Button> */}
        <Button onClick={logout} variant="outline">
          Logout
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

function NavList({ data }: TNavList) {
  return (
    <Accordion
      type="single"
      defaultValue={data.find((v) => v.path === location.pathname)?.path}
      collapsible
      className="pr-2 py-2"
    >
      {data.map((v, i) => (
        <SidebarCollapsible data={v} key={i} />
      ))}
    </Accordion>
  );
}

type TNavList = {
  data: TNavItem[];
};
