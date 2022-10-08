<template>
  <div
    id="activeFrame"
    class="webpage-builder_active-frame"
    :style="unitifyClientRect(activeFrameClientRect) ?? {}"
    v-show="activeFrameClientRect"
  >
    <el-button size="small" type="primary" v-show="isImageHandleBtnShown" class="image-handle-btn" @click="handleClickCropper"
      >裁剪图片</el-button
    >
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, toRef, watch, nextTick,
} from 'vue';
import { dialog } from '@/utils/dialog';
import { getPx } from '@/utils/style';
import store, { activeElementSchema, getRelativeClientRectFromWoreArea, setActiveFrameClientRect } from '../store';
import { unitifyClientRect } from '../utils/common';
import ImageCorpper from './ImageCropper.vue';

export default defineComponent({
  name: 'webpage-builder_active-frame',
  components: {},
  props: {
  },
  setup(props, { emit }) {
    const mttObserver = ref();
    const handleClickCropper = async () => {
      const _aspectRatio = store.activeFrameClientRect
        ? store.activeFrameClientRect.width / store.activeFrameClientRect.height
        : 1;

      const currentSectionId = store.activeElementFid.split('-')[0];
      const currentSectionData = store.sectionsDataMap[currentSectionId];
      const currentValueKey = activeElementSchema.value!.props!.valueKey;
      const currentImageUrl = currentSectionData[currentValueKey];

      const { originImageUrl, ossCropConfig } = await dialog({
        is: ImageCorpper,
        props: {
          // eslint-disable-next-line max-len
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

    const listener = () => {
      const _mainContainer = document.querySelector('#mainContainer');
      const _currentTarget = _mainContainer?.querySelector(`[fid=${store.activeElementFid}]`);
      if (!_mainContainer || !_currentTarget || activeElementSchema.value?.type !== 'component') {
        return;
      }
      const targetDom = _currentTarget;
      setActiveFrameClientRect(getRelativeClientRectFromWoreArea(targetDom as HTMLElement));

      let observeConfig = {};
      let listenCb: (...args: any[]) => void;
      switch (activeElementSchema.value.component) {
        case 'InputableText': {
          // [targetDom] = _currentTarget.childNodes;
          // targetDom = _currentTarget;
          observeConfig = {
            attributes: true,
            characterData: true,
            subtree: true,
            attributeFilter: ['style'],
            attributeOldValue: true,
          };
          listenCb = (mutationsList) => {
            setActiveFrameClientRect(getRelativeClientRectFromWoreArea(targetDom as HTMLElement));
          };
          break;
        }
        default: {
          // targetDom = _currentTarget;
          observeConfig = { attributes: true, attributeFilter: ['style'] };
          listenCb = (mutationsList) => {
            setActiveFrameClientRect(getRelativeClientRectFromWoreArea(targetDom as HTMLElement));
          };
          break;
        }
      }
      mttObserver.value = new MutationObserver(listenCb);
      mttObserver.value.observe(targetDom, observeConfig);
    };

    watch(() => store.activeElementFid, (val) => {
      if (!val) {
        // mttObserver.value?.disconnect();
        setActiveFrameClientRect(null);
        return;
      }
      nextTick(() => {
        listener();
      });
    }, { immediate: true, flush: 'post' });

    return {
      handleClickCropper,
      unitifyClientRect,
      isImageHandleBtnShown,
      activeFrameClientRect: toRef(store, 'activeFrameClientRect'),
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.webpage-builder_active-frame {
  position: relative;
  .image-handle-btn {
    pointer-events: auto;
    position: absolute;
    bottom: 10px;
    left: 10px;
  }
}
</style>
