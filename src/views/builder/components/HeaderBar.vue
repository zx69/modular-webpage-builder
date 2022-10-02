<template>
  <div class="webpage-builder_header-bar flex-space-between">
    <h3>未命名</h3>
    <section class="right-section">
      <el-button @click="handlePreview">预览</el-button>
      <el-button @click="handlePreview">版本</el-button>
      <el-dropdown split-button @click="handleSaveCommand('save')" @command="handleSaveCommand">
        保存
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="save">保存</el-dropdown-item>
            <el-dropdown-item command="saveAs">另存为</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </section>
  </div>
</template>

<script lang="ts">
import { dialog } from '@/utils/dialog';
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, inject,
} from 'vue';
// import { BrochureItem, editMaterialBrochureInfo, saveMaterialBrochureContent } from '@/api/brochure';
import { ElMessage } from 'element-plus';
// import { getRelativePathFromUrl } from '@/utils/normalize-component';
// import { history } from '@/utils/history';
// import { handleChangeTempStatus } from '@/api/materialBook';
import { useRouter } from 'vue-router';
import BrochureTemplateBaseInfoForm from './BrochureTemplateBaseInfoForm.vue';

export default defineComponent({
  name: 'webpage-builder_header-bar',
  components: {},
  props: {
  },
  setup(props, { emit }) {
    const router = useRouter();
    const {
      brochureId,
      renderSchemaList,
      getCurrentBaseFormInfo,
      setBrochureId,
      setBaseInfo,
      setRenderSchema,
      setSaveState,
      validateSave,
      generateCover,
      validateCurrentBaseFormInfo,
      submitSaveForm,
    } = inject('BrochureCommonStore') || {
      brochureId: ref(''),
      setBrochureId: (id: string) => ({}),
      setBaseInfo: (data: Obj) => ({}),
      setRenderSchema: (data: Obj) => ({}),
      setSaveState: (data: Obj) => ({}),
      validateSave: () => ({}),
      renderSchemaList: ref([]),
      getCurrentBaseFormInfo: () => ({}),
      generateCover: () => ({}),
      validateCurrentBaseFormInfo: async () => ({}),
      submitSaveForm: () => ({}),
    };

    const state = reactive({
      // saveType: 'add' as 'add' | 'edit',
    });
    const handlePreview = () => {
      console.log('preview');
      emit('preview');
    };

    const showEditBaseInfoDialog = async (command: 'saveAs' | 'save') => {
      let currentBaseFormInfo;
      // 如果是另存为, 直接显示空白表单,不必显示当前表单内容
      if (command === 'save') {
        currentBaseFormInfo = getCurrentBaseFormInfo();
      }
      const { brochureId: _brochureId, formData } = await dialog<{
        brochureId: string,
        formData: Obj,
      }>({
        is: BrochureTemplateBaseInfoForm,
        props: {
          isInDialog: true,
          renderSchema: renderSchemaList.value,
          initFormData: currentBaseFormInfo,
          generateCoverFn: generateCover, // 弹框不属于子元素,无法用provide/inject注入方法
          submitSaveFormFn: submitSaveForm,
        },
      }, {
        props: {
          width: '540px',
        },
      });
      setBrochureId(_brochureId);
      setBaseInfo(formData);
    };

    const handleSaveCommand = async (command: 'save' | 'saveAs') => {
      if (command === 'saveAs') {
        await showEditBaseInfoDialog(command);
      } else {
        try {
          await validateCurrentBaseFormInfo?.();
          const currentBaseFormInfo = getCurrentBaseFormInfo();
          const _brochureId = await submitSaveForm(currentBaseFormInfo);
          setBrochureId(_brochureId);
        } catch (err) {
          await showEditBaseInfoDialog(command);
        }
      }
      await ElMessage.success('保存成功');
      setSaveState(true);
    };

    const goBack = async () => {
      const isSaved = await validateSave();
      if (isSaved) {
        router.back();
      } else {
        await handleSaveCommand('save');
        router.back();
      }
    };

    return {
      ...toRefs(state),
      handlePreview,
      handleSaveCommand,
      brochureId,
      goBack,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.webpage-builder_header-bar {
  padding: 0 20px;
  height: 64px;
  flex: none;
  background: #fff;
  border-bottom: 1px solid #ddd;
}
</style>
