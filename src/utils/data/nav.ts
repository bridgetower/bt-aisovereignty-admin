import dynamicIconImports from 'lucide-react/dynamicIconImports';
export const favorites = ['Overview', 'Projects'];

export const mainNavigationList: TNavItem[] = [
  {
    icon: 'book-open',
    label: 'Knowledge base',
    path: '/',
    defaultOpen: false,
    subItems: [
      { label: 'Documents', path: '/knowledgebase/documents' },
      { label: 'Websites', path: '/knowledgebase/websites' },
    ],
  },
  // {
  //   icon: 'shopping-bag',
  //   label: 'eCommerce',
  //   path: '/ecommerce',
  //   defaultOpen: false,
  //   subItems: [
  //     { label: 'Products', path: '/ecommerce/products' },
  //     { label: 'Sales', path: '/ecommerce/sales' },
  //     { label: 'Expense', path: '/ecommerce/expense' },
  //   ],
  // },
  // {
  //   icon: 'folder-closed',
  //   label: 'NFTS',
  //   path: '/nfts',
  //   defaultOpen: false,
  //   subItems: [
  //     { label: 'In Progress', path: '/nfts/in-progress' },
  //     { label: 'Completed', path: '/nfts/completed' },
  //     { label: 'Pending', path: '/nfts/pending' },
  //     { label: 'Collaborators', path: '/nfts/collaborators' },
  //   ],
  // },
  // {
  //   icon: 'book-open',
  //   label: 'Educational',
  //   path: '/educational',
  //   defaultOpen: false,
  //   subItems: [
  //     { label: 'All', path: '/educational/all' },
  //     { label: 'Featured', path: '/educational/featured' },
  //     { label: 'Categories', path: '/educational/categories' },
  //     { label: 'My Courses', path: '/educational/my-courses' },
  //   ],
  // },
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
  // {
  //   label: 'NFT Management',
  //   path: '/nft-management',
  //   defaultOpen: false,
  //   subItems: [
  //     { label: 'Overview', path: '/nft-management/overview' },
  //     { label: 'Collections', path: '/nft-management/collections' },
  //     { label: 'Minting', path: '/nft-management/minting' },
  //     { label: 'Transfers', path: '/nft-management/transfers' },
  //     { label: 'Activity', path: '/nft-management/activity' },
  //   ],
  // },
  // {
  //   label: 'User Management',
  //   path: '/user-management',
  //   defaultOpen: false,
  //   subItems: [
  //     { label: 'Users', path: '/user-management/users' },
  //     { label: 'Roles', path: '/user-management/roles' },
  //     { label: 'Permissions', path: '/user-management/permissions' },
  //     { label: 'Teams', path: '/user-management/teams' },
  //   ],
  // },
  // {
  //   label: 'Community',
  //   path: '/community',
  //   defaultOpen: false,
  //   subItems: [
  //     { label: 'Discussions', path: '/community/discussions' },
  //     { label: 'Spotlight', path: '/community/spotlight' },
  //     { label: 'Events', path: '/community/events' },
  //     { label: 'Groups', path: '/community/groups' },
  //   ],
  // },
  // {
  //   label: 'Order/Transaction',
  //   path: '/order-transaction',
  //   defaultOpen: false,
  //   subItems: [
  //     { label: 'Order History', path: '/order-transaction/order-history' },
  //     { label: 'Transactions', path: '/order-transaction/transactions' },
  //     { label: 'Invoices', path: '/order-transaction/invoices' },
  //     { label: 'Refunds', path: '/order-transaction/refunds' },
  //   ],
  // },
  // {
  //   label: 'Site Content',
  //   path: '/site-content',
  //   defaultOpen: false,
  //   subItems: [
  //     { label: 'Blog Posts', path: '/site-content/blog-posts' },
  //     { label: 'News', path: '/site-content/news' },
  //     { label: 'FAQs', path: '/site-content/faqs' },
  //     { label: 'Media', path: '/site-content/media' },
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
