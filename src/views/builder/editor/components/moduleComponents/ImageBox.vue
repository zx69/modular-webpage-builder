<template>
  <DropReceiver
    class="material-brochure_image-box image-container"
    transferDataType="image-path"
    @transferData="receiverDropMaterial"
    :style="{
      backgroundImage: imageType === 'background' ? `url(${croppedImgFullUrl})` : 'unset',
    }"
    v-on="events"
  >
    <base-image :src="croppedImgFullUrl" v-if="imageType === 'image'">
      <template #noImage>
        <div class="image-receive-box flex-column" v-if="!croppedImgFullUrl">
          <div class="flex-column flex-center flex-1">
            <i class="icon i-r-tupian-14"></i>
            <p>暂无图片</p>
          </div>
        </div>
      </template>
    </base-image>
    <template v-if="imageType === 'background' && !croppedImgFullUrl">
      <div class="image-receive-box flex-column">
        <div class="flex-column flex-center flex-1">
          <i class="icon i-r-tupian-14"></i>
          <p>暂无图片</p>
        </div>
      </div>
    </template>

    <slot></slot>
  </DropReceiver>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, watch,
} from 'vue';
import { getEventCatchAndThrowMap, getModuleData, saveModuleData } from '../../utils';
import DropReceiver from '../DropReceiver.vue';
import { RenderStatus } from '../../typings';
import { activeElementSchema } from '../../store';

export default defineComponent({
  name: 'material-brochure_image-box',
  components: { DropReceiver },
  operation: 'image',
  props: {
    data: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: String,
      required: true,
    },
    imageType: {
      type: String as PropType<'image' | 'background'>,
      default: 'image',
    },
    // oss图片query参数对象
    ossCropConfig: {
      type: Object,
    },
    status: {
      type: String as PropType<RenderStatus>,
      default: 'preview',
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      currentImagePath: '',
    });

    const receiverDropMaterial = (imgPath: string) => {
      console.log(imgPath);
      if (activeElementSchema.value?.props) {
        activeElementSchema.value.props.ossCropConfig = null;
      }
      state.currentImagePath = imgPath;
    };

    watch(() => ({ data: props.data, key: props.valueKey }), ({ data, key }) => {
      state.currentImagePath = getModuleData(data, key) as string;
    }, { immediate: true, deep: true });

    watch(() => state.currentImagePath, (val) => {
      saveModuleData(props.data, props.valueKey, val);
    });

    const croppedImgFullUrl = computed(() => {
      return state.currentImagePath;
    });
    return {
      ...toRefs(state),
      receiverDropMaterial,
      croppedImgFullUrl,
      events: props.status !== 'edit' ? null : getEventCatchAndThrowMap(['click', 'mouseover', 'mouseout']),
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.material-brochure_image-box {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  &.image-container {
    width: 100%;
    height: 100%;
    // position: relative;
  }
  .mc-block {
    position: relative;
    z-index: 2;
  }
  .el-image {
    // position: absolute;
    border-radius: 0;
  }
  .image-receive-box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    // width: 100%;
    // height: 100%;
    background: #f8f8f8;
    color: #999;
    .icon {
      font-size: 32px !important;
      margin-bottom: 12px;
    }
    p {
      width: 60px;
      font-size: 12px;
      text-align: center;
    }
  }
}
</style>
