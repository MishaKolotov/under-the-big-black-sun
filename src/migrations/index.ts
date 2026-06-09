import * as migration_20260609_113933_initial from './20260609_113933_initial';

export const migrations = [
  {
    up: migration_20260609_113933_initial.up,
    down: migration_20260609_113933_initial.down,
    name: '20260609_113933_initial'
  },
];
