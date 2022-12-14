import { reactive, ref, Ref } from 'vue';
import { ElMessage, ElForm } from 'element-plus';
import { WebpageBaseInfo } from '@/api/builder';
import { watch } from 'vue-demi';

const formEl = ref<typeof ElForm>();

export default (formRef?: Ref<typeof ElForm>) => {
  const baseInfo = reactive({
    name: '',
    isOpen: 1 as 1|2,
    cover: '',
  });

  const submitSaveForm = (currentFormData: typeof baseInfo, saveType: 'edit' | 'add') => {
    ElMessage.success('ζδΊ€ζε');
  };

  watch(() => formRef?.value, (val) => {
    if (val) {
      formEl.value = val;
    }
  });

  const validateForm = async () => {
    await formEl.value?.validate();
  };

  return {
    baseInfo,
    validateForm,
    submitSaveForm,
  };
};
