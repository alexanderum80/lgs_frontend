import { MenuItem } from 'primeng/api';

export const MenuItems: MenuItem[] = [
  { id: 'operations', label: 'Cage Operations', items: [
    {
      id: 'initialization',
      label: 'Initialization',
      icon: 'mdi mdi-restart',
      routerLink: 'operations/initialization',
      disabled: false,
      title: 'Initialize values for Cage and Tables.',
    },
    {
      id: 'deposit',
      label: 'Deposit',
      icon: 'mdi mdi-bank-plus',
      routerLink: 'operations/deposit',
      disabled: false,
      title: 'Make deposits in cash.',
    },
    {
      id: 'extraction',
      label: 'Extraction',
      icon: 'mdi mdi-bank-minus',
      routerLink: 'operations/extraction',
      disabled: false,
      title: 'Make extraction from cash.',
    },
    {
      id: 'refund',
      label: 'Refund',
      icon: 'mdi mdi-bank-transfer',
      routerLink: 'operations/refund',
      disabled: false,
      title: 'Make refund from table to cash.',
    },
    {
      id: 'credit',
      label: 'Credit',
      icon: 'mdi mdi-bank-transfer-out',
      routerLink: 'operations/credit',
      disabled: false,
      title: 'Make credit approved for player.',
    },
    {
      id: 'close',
      label: 'Close',
      icon: 'mdi mdi-bank-remove',
      routerLink: 'operations/close',
      disabled: false,
      title: 'Make declaration to close the Casino.',
    },
  ]},
  { id: 'reports', label: 'Reports', items: [
    {
      id: 'todayPlayerTracking',
      label: `Today's Players Tracking`,
      icon: 'mdi mdi-clipboard-text-outline',
      routerLink: 'reports/today-player-tracking',
      disabled: false,
      title: `See Today's Players Tracking.`,
    },
    {
      id: 'masterTracking',
      label: `Master Tracking`,
      icon: 'mdi mdi-clipboard-text-outline',
      routerLink: 'reports/master-tracking',
      disabled: false,
      title: `See Master Tracking.`,
    },
    {
      id: 'finalPlayerSessions',
      label: `Final Players Sessions`,
      icon: 'mdi mdi-clipboard-text-outline',
      routerLink: 'reports/final-player-sessions',
      disabled: false,
      title: `See Final Players Results by Date.`,
    },
    {
      id: 'dropResults',
      label: `Drop Results`,
      icon: 'mdi mdi-clipboard-text-outline',
      routerLink: 'reports/drop-results',
      disabled: false,
      title: `See Drop Results by Date.`,
    },
  ]},
  { id: 'settings', label: 'Settings', icon: 'mdi mdi-settings-outline', items: [
    {
      id: 'casinoInfo',
      label: 'Casino Information',
      icon: 'mdi mdi-warehouse',
      routerLink: 'casino-info',
      disabled: false,
      title: 'Manage Casino Information.',
    },
    { separator: true },
    { id: 'tables', label: 'Tables', icon: 'mdi mdi-table-chair', items: [
      {
        id: 'tablesGames',
        label: 'Tables Games',
        icon: 'mdi mdi-gamepad-variant-outline',
        routerLink: 'tables-game',
        disabled: false,
        title: 'Manage Table Games.',
      },
      {
        id: 'tables',
        label: 'Tables',
        icon: 'mdi mdi-table-settings',
        routerLink: 'tables',
        disabled: false,
        title: 'Manage Table.',
      },
    ]},
    {
      id: 'users',
      label: 'Users',
      icon: 'mdi mdi-account-supervisor',
      routerLink: 'users',
      disabled: false,
      title: 'Manage Users.',
    },
    { separator: true },
    {
      id: 'countries',
      label: 'Countries',
      icon: 'mdi mdi-map-check-outline',
      routerLink: 'countries',
      disabled: false,
      title: 'Manage Countries.',
    },
    {
      id: 'cities',
      label: 'Cities',
      icon: 'mdi mdi-map-marker-outline',
      routerLink: 'cities',
      disabled: false,
      title: 'Manage Cities.',
    },
    { separator: true },
    {
      id: 'coins',
      label: 'Coins',
      icon: 'mdi mdi-cash-multiple',
      routerLink: 'coins',
      disabled: false,
      title: 'Manage Coins.',
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: 'mdi mdi-poker-payment',
      routerLink: 'payments',
      disabled: false,
      title: 'Manage Payments.',
    },
    { separator: true },
    {
      id: 'players',
      label: 'Players',
      icon: 'mdi mdi-gamepad-up',
      routerLink: 'players',
      disabled: false,
      title: 'Manage Players.',
    },
  ]},
];

