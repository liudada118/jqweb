import * as migration_20260401_082648_init from './20260401_082648_init';

export const migrations = [
  {
    up: migration_20260401_082648_init.up,
    down: migration_20260401_082648_init.down,
    name: '20260401_082648_init'
  },
];
