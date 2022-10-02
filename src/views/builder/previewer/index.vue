<template>
  <div class="webpage-builder_previewer flex-column" v-show="isVisible" :class="size">
    <header class="flex-space-between">
      <h4 class="over-text">{{ currentName }}</h4>
      <slot :schema="currentSchema">
        <el-button @click="isVisible = false">关闭</el-button>
      </slot>
      <PlatformRadio v-model="currentPreviewMode"></PlatformRadio>
    </header>
    <main class="preview-wrapper flex-1" :class="[`preview-mode-${currentPreviewMode}`]">
      <template v-if="currentSchema">
        <div class="preview-container">
          <PreviewContent
            :renderSchema="currentSchema"
            :previewMode="currentPreviewMode"
            status="preview"
          ></PreviewContent>
        </div>
        <div class="qrcode-box" v-if="currentPreviewMode === 'mobile' && qrcodeDataUrl">
          <img class="qrcode" :src="qrcodeDataUrl" alt="" />
          <p>扫描二维码浏览手机展示效果</p>
        </div>
      </template>
    </main>
  </div>
</template>

<script lang="ts">
import { generateQRCode } from '@/utils/qrcode';
import {
  defineComponent, reactive, computed, ref, toRefs, toRef, onMounted, watch, onUnmounted, toRaw, inject, PropType,
} from 'vue';
import { fetchMaterialBrochureContent } from '@/api/builder';
import { CompModule, PreviewMode } from '../editor/typings';
import store from '../editor/store';
import useBaseInfo from '../editor/uses/use-base-info';
import PlatformRadio from './components/PlatformRadio.vue';
import PreviewContent from './components/PreviewContent.vue';

export default defineComponent({
  name: 'webpage-builder_previewer',
  components: {
    PlatformRadio,
    PreviewContent,
  },
  props: {
    isPreviewing: {
      type: Boolean,
      default: false,
    },
    renderSchema: {
      type: [Array, Object] as PropType<CompModule | CompModule[]>,
    },
    renderSchemaId: {
      type: String,
    },
    qrcodeUrl: {
      type: String,
      default: '',
    },
    qrcodeQueryId: {
      type: String,
    },
    qrcodeQueryKey: {
      type: String,
      default: 'id',
    },
    name: {
      type: String,
      default: '',
    },
    size: {
      type: String as PropType<'large' | 'small'>,
      default: 'large',
    },
  },
  emits: ['cancel', 'update:isPreviewing'],
  setup(props, { emit }) {
    const currentSchema = ref<CompModule | CompModule[] | null>(null);
    const currentPreviewMode = ref<PreviewMode>('pc');
    const currentName = ref('');
    const qrcodeDataUrl = ref('');
    const isVisible = ref(false); // 是否可见
    const { baseInfo } = useBaseInfo();

    watch(() => props.isPreviewing, async (val) => {
      isVisible.value = val;
      if (val) {
        currentPreviewMode.value = 'pc';
        const _renderSchemaProp = props.renderSchema || store.renderSchemaList;
        console.log(JSON.stringify(_renderSchemaProp));
        if (_renderSchemaProp) {
          // 每次打开预览时再给currentSchema赋值触发渲染.
          currentSchema.value = _renderSchemaProp;
        }
        currentName.value = props.name || baseInfo?.name || '';
        const _qrcodeUrl = `${window.location.origin}${props.qrcodeUrl}`;
        // appType是app端要用来辨别是自己的网页(有访问范围限制)
        qrcodeDataUrl.value = await generateQRCode(_qrcodeUrl, {
          [props.qrcodeQueryKey]: props.qrcodeQueryId,
          appType: 'homepage',
          mode: 'preview', // 预览模式下不校验密码
        });
      }
    }, { immediate: true });

    watch(isVisible, (val) => {
      if (!val) {
        emit('cancel');
        emit('update:isPreviewing', false);
      }
    });

    watch(() => props.renderSchemaId, async (val) => {
      if (val) {
        const _renderSchemaProp = props.renderSchema || store.renderSchemaList;
        if (_renderSchemaProp) {
          // 每次打开预览时再给currentSchema赋值触发渲染.
          currentSchema.value = _renderSchemaProp;
        } else if (props.renderSchemaId) {
          currentSchema.value = await fetchMaterialBrochureContent(props.renderSchemaId);
        }
        currentName.value = props.name || baseInfo?.name || '';
        const _qrcodeUrl = `${window.location.origin}${props.qrcodeUrl}`;
        // appType是app端要用来辨别是自己的网页(有访问范围限制)
        qrcodeDataUrl.value = await generateQRCode(_qrcodeUrl, {
          [props.qrcodeQueryKey]: props.qrcodeQueryId,
          appType: 'homepage',
          mode: 'preview', // 预览模式下不校验密码
        });
      }
    }, { immediate: true });

    const rebuildPreviewContent = () => {
      currentSchema.value = null;
    };
    return {
      currentPreviewMode,
      qrcodeDataUrl,
      isVisible,
      currentSchema,
      currentName,
      rebuildPreviewContent,
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.webpage-builder_previewer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background: #f6f6f6;
  justify-content: center;
  header {
    color: #666;
    height: 64px;
    padding: 0 20px;
    border-bottom: 1px solid #ddd;
    position: relative;
    h4 {
      font-weight: 400;
      width: 220px;
    }
    .el-button--text {
      color: #666666 !important;
    }
  }
  .preview-wrapper {
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    color: #000000;
    background-color: #fff;

    &.preview-mode-mobile {
      display: flex;
      justify-content: center;
      align-items: center;
      .preview-container {
        width: 310px;
        height: 620px;
        box-shadow: 0px 0px 20px 0px rgba(28, 29, 33, 0.25);
        border-radius: 32px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        background-color: #f1f2f5;
        &:before,
        &:after {
          content: "";
          display: block;
          width: 100%;
          height: 60px;
          background: #fff;
        }

      }
    }
  }
  .platform-radio {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .qrcode-box {
    background: #fff;
    padding: 12px;
    border-radius: 8px;
    box-shadow: 0px 0px 20px 0px rgba(28, 29, 33, 0.25);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(205px, -50%);
    width: 190px;
    .qrcode {
      width: 166px;
      height: 166px;
    }
    p {
      font-size: 12px;
      color: #999;
      line-height: 22px;
      margin-top: 4px;
      text-align: center;
    }
  }

  &.small {
    header {
      height: 50px;
    }
    .preview-container {
      transform: scale(0.9);
    }
    .qrcode-box {
      padding: 9px;
      width: 120px;
      transform: translate(160px, 45px);
      top: 0;
      .qrcode {
        width: 104px;
        height: 104px;
      }
    }
  }
}
#brochurePreviewIframe {
  border: none;
  flex: 1;
}
.brochure-previewer-dialog {
  overflow-x: hidden;
  overflow-y: auto;
  .webpage-builder_previewer {
    .preview-mode-pc {
      .preview-container {
        transform: scale(0.422);
        transform-origin: left top;
        position: absolute;
      }
    }
  }
}
</style>
