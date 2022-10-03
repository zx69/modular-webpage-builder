/* eslint-disable import/prefer-default-export */

import { ref } from 'vue';
import { ProductItem } from '../typings';


export const relatedProductsList = ref<ProductItem[]>([]);

export const removeRelatedProductIds = (productId: string | string[]) => {
  console.log('removeRelatedProductIds', productId);
  const idsArr = Array.isArray(productId) ? productId : [productId];
  idsArr.forEach(_pId => {
    const _index = relatedProductsList.value.findIndex(relatedIds => relatedIds.id === _pId);
    relatedProductsList.value.splice(_index, 1);
  });
};
