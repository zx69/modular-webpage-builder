<template>
  <div
    id="activeFrame"
    class="material-brochure_active-frame"
    :style="activeFrameClientRect"
    v-show="activeFrameClientRect"
  >
    <el-button size="small" type="primary" v-show="isImageHandleBtnShown" class="image-handle-btn" @click="handleClick"
      >裁剪图片</el-button
    >
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, toRef,
} from 'vue';
import { dialog } from '@/utils/dialog';
import store, { activeElementSchema } from '../store';
import ImageCorpper from './ImageCropper.vue';

export default defineComponent({
  name: 'material-brochure_active-frame',
  components: {},
  props: {
  },
  setup(props, { emit }) {
    const state = reactive({});
    const handleClick = async () => {
      const _aspectRatio = store.activeFrameClientRect
        ? (parseInt(store.activeFrameClientRect.width, 10) / parseInt(store.activeFrameClientRect.height, 10))
        : 1;

      const currentSectionId = store.activeElementFid.split('-')[0];
      const currentSectionData = store.sectionsDataMap[currentSectionId];
      const currentValueKey = activeElementSchema.value!.props!.valueKey;
      const currentImageUrl = currentSectionData[currentValueKey];

      const { originImageUrl, ossCropConfig } = await dialog({
        is: ImageCorpper,
        props: {
          // eslint-disable-next-line max-len
          // imageUrl: 'https://cdn-dev-sit.idealabmat.com/binaryFile/b74c3da57564282bcc51e82c9bd5d59c.png?ch=2&x-oss-process=image/resize,w_777,h_777,m_fill/format,webp',
          imageUrl: currentImageUrl,
          cropperProps: {
            aspectRatio: _aspectRatio,
          },
        },
      });
      if (originImageUrl) {
        currentSectionData[currentValueKey] = originImageUrl;
      }

      if (activeElementSchema.value?.props) {
        activeElementSchema.value.props.ossCropConfig = ossCropConfig;
      }
    };

    const isImageHandleBtnShown = computed(() => {
      return activeElementSchema.value?.component && activeElementSchema.value.component === 'ImageBox';
    });
    return {
      ...toRefs(state),
      handleClick,
      isImageHandleBtnShown,
      activeFrameClientRect: toRef(store, 'activeFrameClientRect'),
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.material-brochure_active-frame {
  position: relative;
  .image-handle-btn {
    pointer-events: auto;
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
}
</style>
