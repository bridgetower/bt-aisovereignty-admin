import {
  Bell,
  ClockArrowDown,
  IndentDecrease,
  PanelRightDashed,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  useLocalStorage,
  useMediaQuery,
  useReadLocalStorage,
} from 'usehooks-ts';

import { mainNavigationList, secondaryNavigationList } from '@/utils/data/nav';

import { SearchInput } from '../ui/searchInput';
import { NotificationDrawer } from './NotificationDrawer';
import { SidebarDrawer } from './SidebarDrawer';
import ThemeSwitcher from './ThemeSwitcher';

interface NavbarProps {
  setSideOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNavOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar = ({ setNavOpen, setSideOpen }: NavbarProps) => {
  const location = useLocation();

  const matches = useMediaQuery('(min-width: 1080px)');
  const [value, setValue] = useLocalStorage<
    {
      name: string;
      path: string;
    }[]
  >('favourite-pages', []);

  const favoritePages = useReadLocalStorage('favourite-pages') as {
    name: string;
    path: string;
  }[];

  const isCurrentPageFavorite = favoritePages?.some(
    (item) => item.path === location.pathname,
  );

  const allNavList = [...mainNavigationList, ...secondaryNavigationList];

  function findMenuItemByPath(items: any, targetPath: string) {
    for (const item of items) {
      // Check if the current item matches the path
      if (item.path === targetPath) {
        return { primaryPathName: item.label, path: item.path };
      }

      // If the item has subItems, search recursively in the subItems array
      if (item.subItems && item.subItems.length > 0) {
        const result = findMenuItemByPath(item.subItems, targetPath) as any;

        if (result) {
          return {
            primaryPathname: item.label,
            secondaryPathname: result.primaryPathName,
            path: result.path,
          };
        }
      }
    }
    // Return null if no match is found
    return null;
  }

  const handleUpdateFavoriteStatus = () => {
    if (isCurrentPageFavorite) {
      const updatedFavoritePages = favoritePages?.filter(
        (item) => item.path !== location.pathname,
      );
      setValue(updatedFavoritePages);
    } else {
      const updatedFavoritePages = [
        ...(value ?? []),
        { name: location.pathname, path: location.pathname },
      ];
      setValue(updatedFavoritePages);
    }
  };

  return (
    <div className="flex w-full flex-col">
      <header className="flex  flex-row text-foreground justify-between items-center shadow-md bg-navbackground py-5 px-7 h-16 w-full ">
        <div className="flex items-center gap-6">
          {matches ? (
            <IndentDecrease
              className="cursor-pointer"
              onClick={() => {
                setNavOpen((v) => !v);
              }}
              size={20}
            />
          ) : (
            <SidebarDrawer />
          )}
          {/* <Star
            className="cursor-pointer"
            onClick={handleUpdateFavoriteStatus}
            fill={isCurrentPageFavorite ? 'yellow' : ''}
            size={14}
          /> */}
          <div className="flex items-center gap-x-2">
            <Link to="/" className="text-sm text-muted-foreground">
              {findMenuItemByPath(allNavList, location.pathname)
                ?.primaryPathname ?? 'Dashboard'}
            </Link>
            <p className="text-muted-foreground">/</p>
            <Link to="/" className="text-sm text-foreground">
              {findMenuItemByPath(allNavList, location.pathname)
                ?.secondaryPathname ?? 'Default'}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <SearchInput />
          <ThemeSwitcher />
          <ClockArrowDown size={20} />
          <Bell size={20} />
          {matches ? (
            <PanelRightDashed
              className="cursor-pointer"
              onClick={() => {
                setSideOpen((v) => !v);
              }}
              size={20}
            />
          ) : (
            <NotificationDrawer />
          )}
        </div>
      </header>
    </div>
  );
};

export default Navbar;
