import { DataSet } from 'vis';

export const dataSetToArray = (dataSet: DataSet<any>): Array<any> => {
  const output: Array<any> = [];
  dataSet.forEach((item) => output.push(item));
  return output;
};
