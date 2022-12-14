import type { BaseSettings } from 'onyx-ui/models';

export type Settings = BaseSettings & {
  appListDisplay: 'grid' | 'list';
};
