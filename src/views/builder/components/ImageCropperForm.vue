<template>
  <div class="dialog-title">{{ dialogTitle }}</div>
  <el-form size="small" ref="formVm">
    <div class="flex">
      <div class="cropper-box-wrapper">
        <VueCropper
          v-if="imageUrl"
          class="cropper-box"
          :img="imageUrl"
          :options="cropperOptions"
          ref="cropper"
        ></VueCropper>
        <Upload
          v-else
          v-model:url="imageUrl"
          class="cropper-upload"
          :options="{ types: ['png', 'jpg', 'jpeg'] }"
          :validOptions="validOptions ?? ['img']"
        >
          <template #default="{ upload }">
            <div class="upload-content" @click="upload">
              <i class="iconfont i-jiahao"></i>
              <p>上传{{ keyword }}</p>
            </div>
          </template>
        </Upload>
      </div>
      <Upload
        v-model:url="imageUrl"
        class="btn-re-upload"
        :options="{ types: ['png', 'jpg', 'jpeg'] }"
        :validOptions="validOptions ?? ['img']"
      >
        <template #default="{ upload }">
          <div class="upload-content" @click="upload">
            <div class="icon-wrapper flex-center">
              <i class="iconfont i-shangchuan"></i>
            </div>
            <p>重新上传</p>
          </div>
        </template>
      </Upload>
    </div>
    <div class="dialog-footer flex-justify-flex-end">
      <el-button @click="cancelForm">取消</el-button>
      <el-button type="primary" :disabled="!imageUrl" @click="submitForm">提交</el-button>
    </div>
  </el-form>
</template>

<script lang="ts">
import {
  defineComponent, reactive, toRef, toRefs, ref, watch, onMounted, PropType,
} from 'vue';
import VueCropper, { cropper } from 'vue-picture-cropper';
import Upload from '@/components/upload/index.vue';
import validFile from '@/utils/valid-file';

export type Options = { types?: string[], timeout?: number, folder?: boolean, noCancel?: boolean, multiple?: boolean };

export type TypeValidationOption = {
  title?: string
  extensions?: string[]
  sizeLimit?: number
  mimeTypes?: string[]
};
export default defineComponent({
  components: {
    VueCropper,
    Upload,
  },
  props: {
    keyword: {
      type: String,
      default: () => '图片',
    },
    dialogTitle: {
      type: String,
      default: () => '裁剪图片',
    },
    pathType: {
      type: String,
      default: 'USER_IMG',
    },
    options: {
      type: Object as PropType<Options>,
    },
    validOptions: {
      type: Object as PropType<Parameters<typeof validFile>[1]>,
    },
  },
  dialogify: {
    props: {
      title: '',
      width: '540px',
    },
  },
  emits: ['cancel', 'confirm'],
  setup(props, { attrs, emit }) {
    const cropperOptions = {
      viewMode: 1,
      dragMode: 'crop',
      aspectRatio: 1,
      restore: true,
      ...attrs,
    };
    const imageUrl = ref<string>('');

    const cancelForm = async () => {
      emit('cancel');
    };

    const submitForm = async () => {
      const blobUrl = cropper.getDataURL();
      // 上传到OSS
      emit('confirm', {
        url: blobUrl,
        blobUrl,
      });
    };

    return {
      submitForm,
      cancelForm,
      imageUrl,
      cropperOptions,
    };
  },
});
</script>

<style lang="scss" scoped>
.dialog-title {
  font-size: 16px;
  position: relative;
  top: -20px;
}
.dialog-footer {
  margin-top: 20px;
}
.flex {
  justify-content: space-between;
}
.upload-box {
  background: #fcfcfc;
  border: 1px solid #ddd;
  i {
    font-size: 24px;
    color: $color-primary;
  }
  p {
    margin-top: 8px;
    color: #999;
  }
}
.btn-re-upload {
  @extend .upload-box;
  width: 100px;
  height: 100px;
  .icon-wrapper {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    overflow: hidden;
    background: $color-primary;
    i {
      font-size: 16px;
      color: #fff;
    }
  }
}
.cropper-box-wrapper {
  @extend .upload-box;
  width: 360px;
  height: 360px;
  i {
    font-size: 32px;
  }
}
.upload-content {
  height: 100%;
  cursor: pointer;
  flex-direction: column;
  @extend %flex-center;
}
.cropper-box,
.cropper-upload {
  width: 100%;
  height: 100%;
}
</style>
