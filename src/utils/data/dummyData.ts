export const orgData = {
  id: '1',
  name: 'Amy Elsner',
  role: 'CEO',
  imgUrl: 'https://via.placeholder.com/64',
  children: [
    {
      id: '2',
      name: 'Anna Fali',
      role: 'CMO',
      imgUrl: 'https://via.placeholder.com/64',
    },
    {
      id: '3',
      name: 'Stephen Shaw',
      role: 'CTO',
      imgUrl: 'https://via.placeholder.com/64',
      children: [
        {
          id: '4',
          name: 'Development',
          role: 'Team',
        },
        {
          id: '5',
          name: 'UI/UX Design',
          role: 'Team',
        },
      ],
    },
  ],
};
export const notificationData = [
  {
    name: 'Proejct',
    title: 'Project Name 2 moved to next stage',
    icon: 'User',
    link: '/projects',
    read: false,
    type: 'info',
  },
  {
    name: 'Proejct',
    title: 'Project Name 2 moved to next stage',
    icon: 'User',
    link: '/projects',
    read: false,
    type: 'info',
  },
  {
    name: 'Proejct',
    title: 'Test project moved to next stage',
    icon: 'User',
    link: '/projects',
    read: false,
    type: 'info',
  },
  {
    name: 'Proejct',
    title: 'Project Name 1 file error',
    icon: 'User',
    link: '/projects',
    read: false,
    type: 'alert',
  },
];
