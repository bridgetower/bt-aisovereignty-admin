import dynamicIconImports from 'lucide-react/dynamicIconImports';

export const notificationsData: TNotificationItem[] = [
  {
    icon: 'bug',
    title: 'Typo to be fixed.',
    description: 'Just now',
  },
  {
    icon: 'user-round',
    title: 'New user registered',
    description: '59 minutes ago',
  },
  {
    icon: 'bug',
    title: 'Broken link to be fixed.',
    description: '12 hours ago',
  },
  {
    icon: 'radio',
    title: 'New subscription',
    description: 'Today, 11:59 AM',
  },
];

export const activitiesData = [
  {
    title: 'Updated inventory',
    description: 'Just now',
  },
  {
    title: 'Minted a new NFT',
    description: '59 minutes ago',
  },
  {
    title: 'Submitted a bug',
    description: '12 hours ago',
  },
  {
    title: 'Modified Inventory',
    description: 'Today, 11:59 AM',
  },
  {
    title: 'Posted event',
    description: 'September 2, 2024',
  },
];

export type TNotificationItem = {
  icon: keyof typeof dynamicIconImports;
  title: string;
  description: string;
};
export type TActivitiesItem = {
  title: string;
  description: string;
};
