<template>
  <div class="webpage-builder_image-corpper" v-loading="currentUrl && !isCropperReady">
    <div class="cropper-box-wrapper">
      <VueCropper
        v-if="currentUrl"
        class="cropper-box"
        :img="currentUrl"
        :options="cropperOptions"
        ref="cropper"
      ></VueCropper>
      <Upload
        v-if="!isCropperReady"
        class="cropper-upload-box"
        v-model:url="currentUrl"
        :options="{ types: ['png', 'jpg', 'jpeg'] }"
        :validOptions="['img']"
      >
        <template #default="{ upload }">
          <div class="upload-content flex-column flex-center" @click="upload">
            <i class="iconfont i-jiahao"></i>
            <p>上传图片</p>
          </div>
        </template>
      </Upload>
    </div>
    <!-- <div>支持拖拽图片上传； 建议尺寸 440*225；只支持jpg、jpeg、bmp、png、gif；大小不超过4MB</div> -->
    <footer class="dialog-buttons">
      <el-button @click="$emit('cancel')">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </footer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import VueCropper, { cropper } from 'vue-picture-cropper';
import Upload from '@/components/upload/index.vue';

export default defineComponent({
  name: 'webpage-builder_image-corpper',
  components: {
    VueCropper,
    Upload,
  },
  dialogify: {
    props: {
      width: '540px',
      title: '裁剪图片',
    },
  },
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    // 要传入ImageCropperForm-prop的options
    cropperProps: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      currentUrl: props.imageUrl,
      isCropperReady: false,
    });

    const cropperOptions = {
      viewMode: 1,
      dragMode: 'move',
      autoCropArea: 1,
      background: false,
      ...props.cropperProps,
      ready() {
        state.isCropperReady = true;
      },
    };

    const handleSubmit = async () => {
      const cropperData = cropper.getData(true);
      const currentOssCropData: unknown = {
        w: cropperData.width,
        h: cropperData.height,
        x: cropperData.x,
        y: cropperData.y,
      };
      // 如果是本地后面上传的图片, 需先上传到OSS
      if (state.currentUrl.startsWith('blob:')) { // 暂时通过blob前缀判断本地图片,后面再看有没有更好办法
        // 这里自行增加上传ajax逻辑
        state.currentUrl = cropper.getDataURL();
      }

      emit('confirm', {
        originImageUrl: state.currentUrl,
        ossCropConfig: currentOssCropData,
      });
    };
    return {
      ...toRefs(state),
      cropperOptions,
      handleSubmit,
    };
  },
});
</script>
<style lang="scss" scoped>
.webpage-builder_image-corpper {
  .cropper-upload-btn {
    text-align: right;
  }
  .cropper-box-wrapper {
    width: 100%;
    height: 280px;
    overflow: hidden;
  }
  .cropper-upload-box {
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
  .cropper-box,
  .cropper-upload-box,
  .upload-content {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  .dialog-buttons {
    padding-top: 20px;
    text-align: right;
  }
}
</style>
