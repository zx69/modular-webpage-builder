<template>
  <DropReceiver
    class="material-brochure_image-box image-container"
    transferDataType="image-path"
    @transferData="receiverDropMaterial"
    v-on="events"
  >
    <el-image  :src="croppedImageUrl" ref="imageWrapper">
      <template #error>
        <div class="image-slot">
          <el-icon><icon-picture /></el-icon>
          <p>暂无图片</p>
        </div>
      </template>
    </el-image>
    <!-- <template v-if="imageType === 'background' && !croppedImgFullUrl">
      <div class="image-receive-box flex-column">
        <div class="flex-column flex-center flex-1">
          <i class="icon i-r-tupian-14"></i>
          <p>暂无图片</p>
        </div>
      </div>
    </template> -->

    <slot></slot>
  </DropReceiver>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, watch, onMounted,
} from 'vue';
import { ElImage } from 'element-plus';
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
    const imageWrapper = ref<InstanceType<typeof ElImage>>();
    const state = reactive({
      currentImagePath: '',
      croppedImageUrl: '',
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

    const pMounted = new Promise((resolve) => {
      onMounted(resolve);
    });

    // NOTE: 为了前端演示这里使用前端裁剪图片, 使用中更好的方式是使用图片CDN服务器(如阿里云OSS)提供的process参数进行裁剪, 可规避跨域问题
    watch(() => ({ imgPath: state.currentImagePath, cropConfig: props.ossCropConfig }), async ({ imgPath, cropConfig }) => {
      await pMounted;
      if (!cropConfig || !imageWrapper.value) {
        state.croppedImageUrl = imgPath;
        return;
      }
      const image = new Image();
      image.setAttribute('crossOrigin', 'anonymous');
      const canvas = document.createElement('canvas');
      image.onload = function (e) {
        canvas.width = image.width;
        canvas.height = image.height;
        canvas.getContext('2d')!.drawImage(image, cropConfig.x, cropConfig.y, cropConfig.w, cropConfig.h, 0, 0, image.width, image.height);
        const dataUrl = canvas.toDataURL();
        state.croppedImageUrl = dataUrl;
      };
      image.src = `${imgPath}?${Date.now()}`; // 加个随机码解决drawImage跨域
    }, { immediate: true, deep: true });

    return {
      ...toRefs(state),
      receiverDropMaterial,
      imageWrapper,
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
