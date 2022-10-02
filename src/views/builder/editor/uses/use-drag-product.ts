/* eslint-disable import/prefer-default-export */
import { ref } from 'vue';
import { ProductItem } from '../typings';

export const draggingProduct = ref<ProductItem | null>(null);
