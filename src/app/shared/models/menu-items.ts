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
      label: 'Table',
      icon: 'mdi mdi-table-chair',
      routerLink: '',
      disabled: false,
      title: 'Manage Table Types.',
    },
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
      icon: 'mdi mdi-map-marker-outline',
      routerLink: 'countries',
      disabled: false,
      title: 'Manage Countries.',
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

