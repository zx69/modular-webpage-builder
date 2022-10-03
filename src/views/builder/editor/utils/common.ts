import { getPercentage, getPx } from '@/utils/style';
import { FrameClientRect } from '../typings';

/* eslint-disable import/prefer-default-export */
export const createRandomString = () => {
  const upEnArr = [...new Array(26)].map((_, i) => 65 + i);
  const downEnArr = [...new Array(26)].map((_, i) => 97 + i);
  const numArr = [...new Array(10)].map((_, i) => 48 + i);
  const arr = [...upEnArr, ...downEnArr, ...numArr];
  const randomIndexArr = [...new Array(4)].map(() => String.fromCharCode(arr[Math.round(Math.random() * (arr.length - 1))]));
  return randomIndexArr.join('');
};


// 给clientRect加单位(px)
export const unitifyClientRect = (clientRect: Partial<FrameClientRect> | null, unit: 'px' | '%' = 'px') => {
  if (!clientRect) { return null; }
  return Object.fromEntries(Object.entries(clientRect).map(([key, val]) => {
    return [key, unit === 'px' ? getPx(val) : getPercentage(val)];
  }));
};
