<template>
  <div class="webpage-builder_header-bar flex-space-between">
    <h3>未命名</h3>
    <section class="right-section">
      <el-button @click="handlePreview">预览</el-button>
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
import { ElMessage } from 'element-plus';
import useBaseInfo from '../editor/uses/use-base-info';
import BrochureBaseInfoForm from './BrochureBaseInfoForm.vue';

export default defineComponent({
  name: 'webpage-builder_header-bar',
  components: {},
  props: {
  },
  setup(props, { emit }) {
    const {
      baseInfo,
      validateForm,
      submitSaveForm,
    } = useBaseInfo();

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
        currentBaseFormInfo = baseInfo;
      }
      const { brochureId: _brochureId, formData } = await dialog<{
        brochureId: string,
        formData: Obj,
      }>({
        is: BrochureBaseInfoForm,
        props: {
          isInDialog: true,
          initFormData: currentBaseFormInfo,
        },
      }, {
        props: {
          width: '540px',
        },
      });
    };

    const handleSaveCommand = async (command: 'save' | 'saveAs') => {
      if (command === 'saveAs') {
        await showEditBaseInfoDialog(command);
      } else {
        try {
          await validateForm();
          const currentBaseFormInfo = baseInfo;
          const _brochureId = await submitSaveForm(currentBaseFormInfo, 'add');
        } catch (err) {
          await showEditBaseInfoDialog(command);
        }
      }
      await ElMessage.success('保存成功');
    };

    return {
      ...toRefs(state),
      handlePreview,
      handleSaveCommand,
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
