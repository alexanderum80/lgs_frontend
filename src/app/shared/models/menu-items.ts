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
      label: 'Table Types',
      icon: 'mdi mdi-table-settings',
      routerLink: 'concilia-contabilidad',
      disabled: false,
      title: 'Manage Table Types.',
    },
    {
      label: 'Players',
      icon: 'mdi mdi-gamepad-up',
      routerLink: 'concilia-contabilidad',
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
  ]},
];

