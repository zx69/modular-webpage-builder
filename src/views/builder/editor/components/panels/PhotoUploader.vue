<template>
  <div class="webpage-builder_photo-uploader">
    <Upload
      :options="{ types: ['png', 'jpg', 'jpeg'] }"
      :validOptions="['img']"
      @update:files="handleSelectedFiles"
      :multiple="true"
      v-bind="$attrs"
      ref="uploadVm"
    >
      <template #default="{ upload }">
        <el-button class="handle-btn--text" type="text" @click="upload">
          <i class="iconfont i-shangchuan"></i>
          上传
        </el-button>
      </template>
    </Upload>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import Upload from '@/components/upload/index.vue';
import { MixedPhotoItem } from '@/api/builder';

export default defineComponent({
  name: 'webpage-builder_photo-uploader',
  components: { Upload },
  props: {},
  setup(props, { emit }) {
    const state = reactive({
      fileWithSize: [] as MixedPhotoItem[],
    });

    // 上传图片
    const uploadFile = async (fileWithSize: MixedPhotoItem) => {
      fileWithSize.status = 'uploading';
      try {
        // const key = await uploadToOSS(fileWithSize.file!, 'BINARY_FILE', (...args) => {
        //   fileWithSize.uploadedSize = args[1] ?? 0;
        // });
        fileWithSize.status = 'success';
        // 上传完成后保存到图片库
        // const resObj = await savePhotoToLibrary({
        //   name: fileWithSize.file!.name,
        //   url: '',
        //   length: fileWithSize.length,
        //   width: fileWithSize.width,
        // });
        // // 上传完成后需将原本地图片的blob-url换成真实url
        // fileWithSize.url = resObj.coverPictureUrl;
        // fileWithSize.id = resObj.id;
        // return resObj;
        return '';
      } catch (error) {
        fileWithSize.status = 'fail';
        return fileWithSize;
      }
    };

    // 获取图片尺寸等数据
    const getImageSize = async (file: File): Promise<MixedPhotoItem> => {
      const result = { file } as MixedPhotoItem;
      return new Promise((resolve, reject) => {
        console.log(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (ev) => {
          const imgUrl = ev.target?.result;
          if (!imgUrl) {
            return;
          }
          const image = new Image();
          // FileReader获得Base64字符串
          image.src = imgUrl as string;
          image.onload = function () {
            const { width, height, src } = this as HTMLImageElement;
            result.url = src;
            result.width = width;
            result.length = height;
            result.uploadedSize = 0;
            result.status = 'ready';
            result.name = file.name;
            result.key = file.name + Date.now(); // 用于列表的key, 需唯一
            resolve(result);
          };
        };
      });
    };

    // 选择本地文件并上传
    const handleSelectedFiles = async (files: File[]) => {
      // 上传图片后先获取本地图片尺寸
      state.fileWithSize = await Promise.all(files.map(file => getImageSize(file)));
      // 获取尺寸后, 先放到图片库layout布局中占位预览, 然后再上传
      emit('getFilesWithSize', state.fileWithSize);
      // 逐个并行上传
      Promise.all(state.fileWithSize.map(file => {
        return uploadFile(file);
      }));
      // state.fileWithSize.forEach(file => {
      //   uploadFile(file);
      // });
    };

    return {
      ...toRefs(state),
      handleSelectedFiles,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.webpage-builder_photo-uploader {
  .upload-wrap {
    display: flex;
  }
}
</style>
