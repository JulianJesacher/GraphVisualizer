export const nodeColorOptions = {
  edit: {
    background: '#D46E26',
  },
  current: {
    background: '#D61111',
  },
  finished: {
    background: '#0E42C7',
  },
  none: {
    background: '#FFFFFF',
  },
  start: {
    background: '#EBC034',
  },
  target: {
    background: '#21781A',
  },
};

export enum ColorState {
  NONE = 'none',
  CURRENT = 'current',
  FINISHED = 'finished',
  EDIT = 'edit',
  START = 'start',
  TARGET = 'target',
}
