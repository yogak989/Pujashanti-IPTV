export interface EPGProgram {
  title: string;
  desc?: string;
  start: string;
  stop: string;
}

export interface Channel {
  id: string;
  name: string;
  url: string;
  tvgName?: string;
  tvgLogo?: string;
  groupTitle?: string;
  category?: string;
  isFavorite?: boolean;
  key?: any;
  epgProgram?: EPGProgram;
}
