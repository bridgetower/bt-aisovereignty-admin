import dynamicIconImports from 'lucide-react/dynamicIconImports';
export const favorites = ['Overview', 'Projects'];

export const mainNavigationList: TNavItem[] = [
  {
    icon: 'warehouse',
    label: 'Dashboard',
    path: '/dashboard',
    defaultOpen: false,
    subItems: [],
  },
  {
    icon: 'file-text',
    label: 'Transactions',
    path: '#',
    defaultOpen: false,
    subItems: [],
  },
];
export const projectNavigationList: TNavItem[] = [
  {
    icon: 'circle-plus',
    label: 'Add project',
    path: '/projects/create',
    defaultOpen: false,
    subItems: [],
  },
  {
    icon: 'package',
    label: 'Projects',
    path: '/projects',
    defaultOpen: false,
    subItems: [],
  },
  // {
  //   icon: 'book-open',
  //   label: 'Knowledge base',
  //   path: '/knowledgebase',
  //   defaultOpen: false,
  //   subItems: [
  //     { label: 'Documents', path: '/knowledgebase/documents' },
  //     { label: 'Websites', path: '/knowledgebase/websites' },
  //   ],
  // },
];
export const admintNavigationList: TNavItem[] = [
  {
    icon: 'inbox',
    label: 'File Requests',
    path: '/add-file-request',
    defaultOpen: false,
    subItems: [],
  },
  {
    icon: 'list-todo',
    label: 'Stage Types',
    path: '/stage-types',
    defaultOpen: false,
    subItems: [],
  },
  {
    icon: 'list-check',
    label: 'Step Types',
    path: '/step-types',
    defaultOpen: false,
    subItems: [],
  },
];
export const secondaryNavigationList: TSecondaryNavList[] = [
  // {
  //   label: 'Inventory',
  //   path: '/inventory',
  //   defaultOpen: true,
  //   subItems: [
  //     { label: 'Overview', path: '/product/overview' },
  //     { label: 'Projects', path: '/product/projects' },
  //     { label: 'Campaigns', path: '/product/campaigns' },
  //     { label: 'Documents', path: '/product/documents' },
  //     { label: 'Followers', path: '/product/followers' },
  //   ],
  // },
];

export type TSecondaryNavList = {
  label: string;
  path: string;
  defaultOpen: boolean;
  subItems: { label: string; path: string }[];
};

export type TNavItem = {
  icon: keyof typeof dynamicIconImports;
  label: string;
  path: string;
  defaultOpen: boolean;
  subItems: { label: string; path: string }[];
};
