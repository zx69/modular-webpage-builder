import { ref, watch, Ref } from 'vue';

export default function useSyncValue<T>(propRefValue: Ref<T>, emit: (event: string, ...args: any[]) => void) {
  const currentValue = ref(propRefValue.value) as unknown as Ref<T>;
  watch(propRefValue, (val) => {
    currentValue.value = val;
  });
  watch(currentValue, (val) => {
    emit('update:modelValue', val);
  });
  return {
    currentValue,
  };
}
