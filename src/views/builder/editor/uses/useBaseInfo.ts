import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { BrochureBaseInfo } from '@/api/brochure';

export default () => {
  const baseInfo = reactive({
    name: '',
    viewRange: 1 as BrochureBaseInfo['viewRange'],
    cover: '',
    password: '',
  });
  const submitSaveForm = (currentFormData: typeof baseInfo, saveType: 'edit' | 'add') => {
    ElMessage.success('提交成功');
  };

  return {
    baseInfo,
    submitSaveForm,
  };
};
