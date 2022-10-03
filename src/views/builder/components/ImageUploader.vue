<template>
  <el-form-item class="image-uploader-with-cutter" :label="label">
    <div class="upload-area flex">
      <el-image v-if="currentImgUrl" class="preview-box" :src="currentImgUrl" @click="showEditAvatarDialog" />
      <div v-else class="upload-btn flex-center flex-column" @click="showEditAvatarDialog">
        <slot name="emptyPlaceholder">
          <i class="iconfont i-shangchuan"></i>
          <span>{{ placeholder ?? '上传' }}</span>
        </slot>
      </div>
    </div>
  </el-form-item>
</template>

<script lang="ts">
import {
  defineComponent, reactive, watch, toRefs, PropType, ref,
} from 'vue';
import { dialog } from '@/utils/dialog';
import ImageCropperForm from './ImageCropperForm.vue';

export default defineComponent({
  name: 'image-uploader-with-cutter',
  props: {
    label: {
      type: String,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    placeholder: {
      type: String,
    },
    // 要传入ImageCropperForm-prop的options
    cropperProps: {
      type: Object,
      default: () => ({}),
    },
    // 要传入上传组件的options
    uploaderProps: {
      type: Object,
      default: () => ({}),
    },
  },
  emits: ['upload', 'update:imageUrl'],
  setup(props, { emit }) {
    const currentImgUrl = ref('');
    watch(() => props.imageUrl, async val => {
      if (!val) {
        return;
      }
      currentImgUrl.value = val;
    }, { immediate: true });

    const showEditAvatarDialog = async () => {
      const { url } = await dialog({
        is: ImageCropperForm,
        props: {
          viewMode: 1,
          dragMode: 'move',
          autoCropArea: 1,
          aspectRatio: 240 / 135,
          ...props.cropperProps,
          ...props.uploaderProps,
        },
      });
      currentImgUrl.value = url;
      emit('update:imageUrl', currentImgUrl.value);
    };
    return {
      currentImgUrl,
      showEditAvatarDialog,
    };
  },
});
</script>

<style lang="scss" scoped>
.upload-area {
  width: 200px;
  height: 135px;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;

  .upload-btn {
    width: 100%;
    background-color: #f3f3f3;
    color: #999;
    font-size: 12px;
    line-height: 24px;
    > :deep(i) {
      font-size: 24px;
    }
  }
}
</style>
