<template>
  <div
    class="brochure-template-base-info-form"
    :class="{ 'in-dialog': isInDialog }"
    v-loading="loading"
  >
    <el-form
      size="small"
      class="brochure-template-base-info-form form--narrow-label"
      :model="formData"
      label-position="top"
      :rules="formRules"
      ref="formRef"
    >
      <el-form-item label="模板名称" prop="name" isRequired>
        <el-input
          v-model.trim="formData.name"
          placeholder="请输入模版名称（1-20个字符）"
          :maxlength="20"
        />
      </el-form-item>
      <el-form-item label="模板状态" isRequired>
        <el-radio-group v-model="formData.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <footer class="dialog-buttons" v-if="isInDialog">
      <el-button @click="$emit('cancel')">{{
        $t("public.dialog.cancel")
      }}</el-button>
      <el-button type="primary" @click="handleSubmit">{{
        $t("public.dialog.confirm")
      }}</el-button>
    </footer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  ref,
  toRefs,
  PropType,
  inject,
  watch,
} from 'vue';
import { BrochureBaseInfo } from '@/api/brochure';

export default defineComponent({
  name: 'brochure-template-base-info-form',
  components: {},
  props: {
    // 是否在dialog中(两种状态: panel/dialog)
    isInDialog: {
      type: Boolean,
      default: false,
    },
    renderSchema: {
      type: [Array, Object] as any,
      default: () => [],
    },
    generateCoverFn: {
      type: Function,
    },
    // inject无法获取到dialog形式的formData, 所以对于isInDialog, 取props.initFormData
    initFormData: {
      type: Object as PropType<BrochureBaseInfo>,
    },
    submitSaveFormFn: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const { baseInfo, submitSaveForm } = inject('BrochureCommonStore') || {
      baseInfo: ref({}),
      submitSaveForm: props.submitSaveFormFn,
    };

    const state = reactive({
      loading: false,
      formData: props.initFormData
        || baseInfo.value?.name || {
        name: '',
        status: 1,
      },
    });

    // baseInfo发生整体替换时才覆盖组件内state,无需deep
    watch(
      () => baseInfo.value,
      (val) => {
        state.formData = baseInfo.value;
      },
    );

    const formRef = ref();
    const formRules = {
      name: { required: true, message: '不得为空', trigger: 'change' },
    };

    const validateForm = async () => {
      await formRef.value?.validate();
    };

    const handleSubmit = async () => {
      formRef.value!.validate(async (valid) => {
        if (valid) {
          try {
            state.loading = true;
            const _brochureId = await submitSaveForm(state.formData, 'add');
            //   // 编辑时返回的完整cover字段直接提交会超长,需要截取出其中有效path片段
            //   await _fn({ ...state.formData, cover: getRelativePathFromUrl(state.formData.cover) });
            emit('confirm', {
              brochureId: _brochureId,
              formData: state.formData,
            });
          } finally {
            setTimeout(() => {
              state.loading = false;
            }, 1000);
          }
        }
      });
    };

    return {
      ...toRefs(state),
      formRules,
      formRef,
      validateForm,
      handleSubmit,
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.brochure-template-base-info-form {
  &.in-dialog {
    .dialog-buttons {
      padding-top: 20px;
      text-align: right;
    }
  }
}
</style>
