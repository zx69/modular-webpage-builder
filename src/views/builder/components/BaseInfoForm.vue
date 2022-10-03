<template>
  <div class="webpage-builder_settings-panel control-panel">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <div class="brochure-base-info-form" :class="{ 'in-dialog': isInDialog }" v-loading="loading">
      <el-form
        class="form--narrow-label"
        label-position="top"
        :model="formData"
        :rules="formRules"
        ref="formRef"
      >
        <el-form-item label="名称" prop="name" isRequired>
          <el-input
            v-model="formData.name"
            placeholder="请输入名称"
            :maxlength="20"
          />
        </el-form-item>
        <el-form-item label="类型" isRequired>
          <el-radio-group v-model="formData.isOpen">
            <el-radio :label="1">公开</el-radio>
            <el-radio :label="2">私密</el-radio>
          </el-radio-group>
        </el-form-item>
        <ImageUploader v-model:imageUrl="formData.cover" label="封面" prop="cover">
          <template #emptyPlaceholder>
            <i class="icon i-r-tupian-14"></i>
            <span>添加封面</span>
          </template>
        </ImageUploader>
      </el-form>
      <footer class="dialog-buttons" v-if="isInDialog">
        <el-button @click="$emit('cancel')">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, PropType, inject,
} from 'vue';
import {
  WebpageBaseInfo,
} from '@/api/builder';
import useBaseInfo from '../editor/uses/use-base-info';
import { createRandomString } from '../editor/utils/common';
import ImageUploader from './ImageUploader.vue';

export default defineComponent({
  name: 'brochure-base-info-form',
  components: { ImageUploader },
  props: {
    title: {
      type: String,
    },
    // 是否在dialog中(两种状态: panel/dialog)
    isInDialog: {
      type: Boolean,
      default: false,
    },
    initFormData: {
      type: Object as PropType<WebpageBaseInfo>,
    },
  },
  setup(props, { emit }) {
    const formRef = ref();
    const {
      baseInfo,
      submitSaveForm,
      validateForm,
    } = useBaseInfo(formRef);

    const state = reactive({
      loading: false,
      formData: baseInfo,
    });

    const formRules = computed(() => ({
      name: { required: true, message: '不得为空', trigger: 'change' },
    }));

    // const validateForm = async () => {
    //   await formRef.value?.validate();
    // };

    const handleSubmit = async () => {
      await validateForm();
      // formRef.value!.validate(async (valid: boolean) => {
      //   if (valid) {
      try {
        state.loading = true;
        const _brochureId = await submitSaveForm(baseInfo, 'add');
        emit('confirm', { brochureId: _brochureId, formData: { ...state.formData } });
      } finally {
        state.loading = false;
      }
      // }
      // });
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
.webpage-builder_settings-panel {
  .sidebar-title {
    margin-bottom: 16px;
  }
}
.brochure-base-info-form {
  .el-radio {
    width: 100%;
    + .el-radio {
      margin-top: 12px;
    }
  }
  .encrypt-box {
    // margin-top: 8px;
    .el-checkbox {
      margin-right: 20px;
    }
    .el-input {
      width: 200px;
    }
  }

  &.in-dialog {
    .dialog-buttons {
      padding-top: 20px;
      text-align: right;
    }
    .el-radio {
      width: unset;
      line-height: 32px;
      margin-top: unset !important;
    }
    .password-input {
      width: 120px;
      margin-top: 0 !important;
    }
  }
  .password-form-item {
    margin-top: -10px;
  }
}
</style>
