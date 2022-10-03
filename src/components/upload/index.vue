<template>
  <div
    class="upload-wrap"
    :class="{ disabled: disabled, 'is-dragover': isDragOver }"
    v-bind="$attrs"
  >
    <slot :upload="upload" :url="url" :close="close" :file="file">
      <div class="default-upload-content" :style="wrapStyle" @click="upload">
        <template v-if="url">
          <div class="img" :style="{ backgroundImage: `url('${url}')` }" />
          <i class="close-icon hover-link el-icon-close" @click.stop="close" v-if="multiple"></i>
          <!-- 遮罩 -->
          <div class="img-veil flex-column flex-center" v-if="showHoverVeil" v-show="!disabled">
            <i class="default-upload-close-icon el-icon-close hover-icon" @click.stop="close"></i>
          </div>
        </template>
        <template v-else>
          <div class="default-upload-list-add flex-center">
            <i class="i-l-tianjia-34"></i>
          </div>
        </template>
      </div>
    </slot>
    <slot name="append" :upload="upload" :url="url" :close="close" :file="file"></slot>
  </div>
</template>

<script lang="ts">
import selectFiles, { Options } from '@/utils/select-files';
import validFile, { validFiles } from '@/utils/valid-file';
import {
  defineComponent, reactive, computed, ref, toRefs, PropType, watch,
} from 'vue';
import { getPx } from '@/utils/style';


export default defineComponent({
  name: 'base-upload',
  inheritAttrs: false,
  components: {},
  props: {
    width: {
      type: [Number, String],
      default: 100,
    },
    options: {
      type: Object as PropType<Options | undefined>,
    },
    validOptions: {
      type: Object as PropType<Parameters<typeof validFile>[1]>,
    },
    modelValue: {
      type: Object as PropType<File | undefined>,
    },
    url: {
      type: String,
    },
    files: {
      type: Array as PropType<File[]>,
    },
    defaultImg: {
      type: String,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    showHoverVeil: {
      type: Boolean,
      default: false,
    },
    hoverVeilText: {
      type: String,
      default: '重新上传',
    },
  },
  emits: ['update:modelValue', 'update:files', 'update:url'],
  setup(props, { emit }) {
    const state = reactive({
      file: undefined as typeof props.modelValue,
      objectUrl: '',
      url: '',
      files: [] as typeof props.files,
      isDragOver: false,
    });
    const wrapStyle = computed(() => {
      const width = getPx(props.width);
      return {
        width,
        height: width,
        // borderColor: state.url ? 'transparent' : undefined,
      };
    });
    const uploadSingle = async (_file?: File, isSelectFiles = true) => {
      let file = _file;
      if (isSelectFiles) {
        [file] = (await selectFiles(props.options));
      }
      if (!file) {
        state.url = '';
        return;
      }
      if (file === state.file) return; // 当通过slot调用upload时会出现:主动调了upload方法,又触发了watch的uploadSingle方法
      if (props.validOptions && file instanceof File) {
        await validFile(file, props.validOptions);
      }
      state.file = file;

      // const ext = getExt(file).toLowerCase();
      // const type = getTypeFormExt(ext) as string;
      // if (['img', 'gif', 'video'].includes(type)) {
      try {
        state.objectUrl = URL.createObjectURL(file);
      } catch (error) {
        console.log('upload组件URL.createObjectURL失败:', error);
      }
      // }
      state.url = state.objectUrl || props.defaultImg || '';
    };
    const uploadMultiple = async (_files?: File[]) => {
      const files = _files || await selectFiles({ ...props.options, multiple: true });
      if (props.validOptions) {
        await validFiles(files, props.validOptions);
      }
      state.files = files;
    };
    // file
    watch(() => props.modelValue, async (value) => {
      state.file = value;
      await uploadSingle(value, false);
    }, { immediate: true });
    watch(() => state.file, (value) => {
      emit('update:modelValue', value);
    });
    // url
    watch(() => props.url, (value) => {
      if (!value) return;
      state.url = value;
    }, { immediate: true });
    watch(() => state.url, (value) => {
      emit('update:url', value);
    });
    // files
    watch(() => props.files, (value) => {
      state.files = value;
    }, { immediate: true });
    watch(() => state.files, (value) => {
      emit('update:files', value);
    }, { deep: true });


    const upload = async () => {
      props.multiple ? await uploadMultiple() : await uploadSingle();
    };
    const close = () => {
      state.file = undefined;
      state.objectUrl = '';
      state.url = '';
      state.files = [];
    };
    // const handleDrop = async (e: DragEvent) => {
    //   state.isDragOver = false;
    //   const files = await getDragFiles(e);
    //   props.multiple ? await uploadMultiple(files) : await uploadSingle(false, files[0]);
    // };
    // const handleDragOver = (e: DragEvent) => {
    //   state.isDragOver = true;
    // };
    // const handleDragLeave = (e: DragEvent) => {
    //   state.isDragOver = false;
    // };
    return {
      ...toRefs(state), wrapStyle, upload, close,
    };
  },
});
</script>
<style lang="scss" scoped>
.upload-wrap {
  &.disabled {
    .default-upload-content,
    .upload-content {
      pointer-events: none;
    }
  }
}
.img-veil {
  display: none;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 2;
  background: rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: all linear 300ms;
}
</style>
