import { MenuItem } from 'primeng/api';

export const MenuItems: MenuItem[] = [
  { label: 'Reports', items: [
    {
      label: 'Audit Report',
      icon: 'mdi mdi-clipboard-text-outline',
      routerLink: 'concilia-interna-dwh',
      disabled: false,
      title: 'See Audit Report.',
    },
  ]},
  { label: 'Settings', icon: 'mdi mdi-settings-outline', items: [
    {
      label: 'Casino Information',
      icon: 'mdi mdi-warehouse',
      routerLink: 'casino-info',
      disabled: false,
      title: 'Manage Casino Information.',
    },
    { label: 'Tables', icon: 'mdi mdi-table-chair', items: [
      {
        label: 'Tables Games',
        icon: 'mdi mdi-gamepad-variant-outline',
        routerLink: 'tables-game',
        disabled: false,
        title: 'Manage Table Games.',
      },
      {
        label: 'Tables',
        icon: 'mdi mdi-table-settings',
        routerLink: 'tables',
        disabled: false,
        title: 'Manage Table.',
      },
    ]},
    {
      label: 'Players',
      icon: 'mdi mdi-gamepad-up',
      routerLink: 'players',
      disabled: false,
      title: 'Manage Players.',
    },
    {
      label: 'Users',
      icon: 'mdi mdi-account-supervisor',
      routerLink: 'users',
      disabled: false,
      title: 'Manage Users.',
    },
    {
      label: 'Countries',
      icon: 'mdi mdi-map-check-outline',
      routerLink: 'countries',
      disabled: false,
      title: 'Manage Countries.',
    },
    {
      label: 'Cities',
      icon: 'mdi mdi-map-marker-outline',
      routerLink: 'cities',
      disabled: false,
      title: 'Manage Cities.',
    },
    {
      label: 'Coins',
      icon: 'mdi mdi-cash-multiple',
      routerLink: 'coins',
      disabled: false,
      title: 'Manage Coins.',
    },
    {
      label: 'Lenders',
      icon: 'mdi mdi-account-cash-outline',
      routerLink: 'lenders',
      disabled: false,
      title: 'Manage Lenders.',
    },
  ]},
];

