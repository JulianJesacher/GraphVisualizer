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

export const edgeColorOptions = {
  none: {
    color: '#000000',
  },
  selectedPath: {
    color: '#ff8c00',
  },
  finalPath: {
    color: '#21781A',
  },
  current: {
    color: '#D61111',
  },
};

export enum NodeColorState {
  NONE = 'none',
  CURRENT = 'current',
  FINISHED = 'finished',
  EDIT = 'edit',
  START = 'start',
  TARGET = 'target',
}

export enum EdgeColorState {
  NONE = 'none',
  SELECTED_PATH = 'selectedPath',
  FINAL_PATH = 'finalPath',
  CURRENT = 'current',
}
