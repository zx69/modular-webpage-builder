/* eslint-disable import/prefer-default-export */
import { ref } from 'vue';
import { ProductItem } from '../typings';

export const draggingMaterial = ref<ProductItem | null>(null);
