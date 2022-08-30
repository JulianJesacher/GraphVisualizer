export const equalArrays = (array1: any, array2: any): boolean => {
  array1 = array1.sort();
  return array2.sort().every((element: any, index: number) => element == array1[index]);
};
