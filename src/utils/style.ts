/* eslint-disable import/prefer-default-export */

export const getPx = (num: number | string) => (typeof num === 'number' ? `${num}px` : num);
