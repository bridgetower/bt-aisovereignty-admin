import { useAuth } from '@/context/CoginitoAuthProvider';
import {
  mainNavigationList,
  secondaryNavigationList,
  TNavItem,
} from '@/utils/data/nav';

import { Accordion } from '../ui/accordion';
import { Button } from '../ui/button';
import NavListAccordion from './NavListAccordion';
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
      className="fixed h-full flex flex-col px-5 py-6 overflow-y-auto text-white "
    >
      <h5 className="text-sm">BridgeTower</h5>

      {/* <<<<<<<<<<<Recent favorite items section>>>>>> */}
      {/* <Tabs className="mt-4" defaultValue="favorite">
        <TabsList className="bg-transparent space-x-2 p-0 h-fit">
          <TabsTrigger
            className="text-white/20 data-[state=active]:text-white/40 px-2 py-1"
            value="favorite"
          >
            Favorite
          </TabsTrigger>
          <TabsTrigger
            className="text-white/20 data-[state=active]:text-white/40 px-2 py-1"
            value="recently"
          >
            Recently
          </TabsTrigger>
        </TabsList>
        <TabsContent className="m-0" value="favorite">
          {favoritePages?.length ? (
            favoritePages.reverse().map((v, i) => (
              <Link
                to={v.path}
                key={i}
                className="flex items-center py-1 px-3  gap-x-2 "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <p className="text-sm truncate w-36">
                  {findMenuItemByPath(allNavList, v.path)?.label}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-sm mt-2">No favorite items</p>
          )}
        </TabsContent>
        <TabsContent className="m-0" value="recently">
          {recentPages?.length ? (
            recentPages.reverse().map((recentPath, i) => (
              <Link
                to={recentPath}
                key={i}
                className="flex items-center py-1 px-3  gap-x-2 "
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                <p className="text-sm truncate w-36">
                  {findMenuItemByPath(allNavList, recentPath)?.label}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-sm mt-2">No favorite items</p>
          )}
        </TabsContent>
      </Tabs> */}

      {/* <<<<<<<<<<<Main Dashboard links>>>>>> */}

      <span className="text-white/40 text-sm mt-5 px-3 pb-2">Dashboards</span>

      <NavList data={mainNavigationList} />

      <Accordion type="single" collapsible className="w-full my-4 px-3">
        {secondaryNavigationList.map((data, i) => (
          <NavListAccordion data={data} key={i} />
        ))}
      </Accordion>

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
      className="w-full px-3"
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
