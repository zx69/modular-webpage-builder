<template>
  <div class="material-brochure_settings-panel control-panel">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <div class="brochure-template-base-info-form" :class="{ 'in-dialog': isInDialog }" v-loading="loading">
      <el-form
        size="small"
        class="brochure-template-base-info-form form--narrow-label"
        label-position="top"
        :model="formData"
        :rules="formRules"
        ref="formRef"
      >
        <el-form-item label="材料册类型" isRequired>
          <el-radio-group v-model="formData.isOpen" disabled>
            <el-radio :label="1">公开材料册</el-radio>
            <el-radio :label="2">私密材料册</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item class="password-form-item" label="" prop="password">
          <div class="encrypt-box flex" v-show="formData.isOpen === 2">
            <el-checkbox v-model="isEncrypt" label="加密" size="large" />
            <el-input
              v-show="isEncrypt"
              v-model="formData.password"
              placeholder="请输入密码"
              :maxlength="4"
            />
          </div>
        </el-form-item>
        <el-form-item label="名称" prop="name" isRequired>
          <el-input
            v-model="formData.name"
            placeholder="请输入名称"
            :maxlength="20"
          />
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
  BrochureBaseInfo,
} from '@/api/brochure';
import useBaseInfo from '../editor/uses/useBaseInfo';
import { createRandomString } from '../editor/utils/common';
import ImageUploader from './ImageUploader.vue';

export default defineComponent({
  name: 'brochure-template-base-info-form',
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
    // renderSchema: {
    //   type: [Array, Object],
    //   default: [],
    // },
    // inject无法获取到dialog形式的formData, 所以对于isInDialog, 取props.initFormData
    initFormData: {
      type: Object as PropType<BrochureBaseInfo>,
    },
    submitSaveFormFn: {
      type: Function,
    },
  },
  setup(props, { emit }) {
    const {
      baseInfo,
      // relatedMaterialsIds,
      submitSaveForm,
    } = useBaseInfo();
    const state = reactive({
      loading: false,
      isEncrypt: false,
      formData: baseInfo,
    });

    // baseInfo发生整体替换时才覆盖组件内state,无需deep
    watch(() => baseInfo, (val) => {
      // state.formData = baseInfo;
      state.isEncrypt = !!baseInfo.password;
    });

    const formRef = ref();
    const formRules = computed(() => ({
      name: { required: true, message: '不得为空', trigger: 'change' },
      password: state.isEncrypt ? { required: true, message: '不得为空', trigger: 'change' } : null,
    }));

    watch(() => state.isEncrypt, (val) => {
      if (val) {
        if (!state.formData.password) {
          state.formData.password = createRandomString();
        }
      } else {
        state.formData.password = '';
      }
    });

    const validateForm = async () => {
      await formRef.value?.validate();
    };

    const handleSubmit = async () => {
      formRef.value!.validate(async (valid: boolean) => {
        if (valid) {
          try {
            state.loading = true;
            const _brochureId = await submitSaveForm(baseInfo, 'add');
            emit('confirm', { brochureId: _brochureId, formData: { ...state.formData } });
          } finally {
            state.loading = false;
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
.material-brochure_settings-panel {
  .sidebar-title {
    margin-bottom: 16px;
  }
}
.brochure-template-base-info-form {
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
