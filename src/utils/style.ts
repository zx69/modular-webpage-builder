/* eslint-disable import/prefer-default-export */

export const getPx = (num: number | string) => (typeof num === 'number' ? `${num}px` : num);


export const getPercentage = (num: number|string, unit = '%') => {
  return `${(Number(num) * 100).toFixed(2)}${unit}`;
};
