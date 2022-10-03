<template>
  <div class="page_builder-index flex-column" v-loading="loading">
    <HeaderBar @preview="isPreviewing = true" @setSchema="setRenderSchema" />
    <main class="main-content flex-1">
      <Editor
        ref="editorRef"
        class="flex-1"
        :leftSidebarTabsConfig="leftSidebarTabsConfig"
        :rightSidebarTabsConfig="rightSidebarTabsConfig"
      />
    </main>
    <Previewer
      v-model:isPreviewing="isPreviewing"
      qrcodeUrl="/homepage/index"
      qrcodeQueryId="123"
      qrcodeQueryKey="orgId"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, h,
} from 'vue';
import Editor from './editor/index.vue';
import HeaderBar from './components/HeaderBar.vue';
import BaseInfoForm from './components/BaseInfoForm.vue';
import TemplatesListPanel from './editor/components/panels/TemplatesListPanel.vue';
import ModulesListPanel from './editor/components/panels/ModulesListPanel.vue';
import TextControlPanel from './editor/components/panels/TextControlPanel.vue';
import PhotoLibraryPanel from './editor/components/panels/PhotoLibraryPanel.vue';
import ProductsListPanel from './editor/components/panels/ProductsListPanel.vue';
import ShapeControlPanel from './editor/components/panels/ShapeControlPanel.vue';
import Previewer from './previewer/index.vue';
import { generateModulesList, setRenderSchema } from './editor/store';

const leftSidebarTabsConfig = [
  {
    label: '模板',
    value: 'template',
    icon: ' i-moban',
    component: h(TemplatesListPanel, {
      onSave: () => {
        // todo
      },
    }),
  },
  {
    label: '模块', value: 'module', icon: ' i-mokuai', component: ModulesListPanel,
  },
];
const rightSidebarTabsConfig = [
  {
    label: '文本', value: 'text', icon: ' i-text', component: TextControlPanel,
  },
  {
    label: '图片', value: 'image', icon: ' i-image', component: PhotoLibraryPanel, panelType: 'photo',
  },
  {
    label: '商品', value: 'product', icon: ' i-shangpin', component: ProductsListPanel,
  },
  {
    label: '形状', value: 'shape', icon: ' i-moban', component: ShapeControlPanel,
  },
  {
    label: '设置', value: 'base-info', icon: ' i-settings', component: BaseInfoForm,
  },
];
export default defineComponent({
  name: 'page_builder-index',
  components: {
    HeaderBar,
    Editor,
    Previewer,
  },
  props: {},
  setup(props, { emit }) {
    const state = reactive({
      loading: false,
      isPreviewing: false,
    });

    generateModulesList();
    return {
      ...toRefs(state),
      leftSidebarTabsConfig,
      rightSidebarTabsConfig,
      setRenderSchema,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.page_builder-index {
  height: 100vh;
  background-color: #fafbfc;
  color: #222;
  > .main-content {
    overflow: hidden;
  }
  .el-button--text {
    color: #999;
  }
  .handle-btn--text {
    color: #666;
    font-size: 12px;
    + .handle-btn--text {
      margin-left: 20px;
    }
    &.active {
      color: $color-primary;
    }
  }
}

.brochure-previewer-dialog {
  min-height: 700px;
  border-radius: 8px;
  overflow: visible;
  background: transparent;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    background: white;
    height: 100%;
    border-radius: 8px;
    .edition-previewer {
      height: 100%;
      .main {
        height: 100%;
        .webpage-builder_previewer {
          background: transparent;
          .preview-wrapper {
            background: transparent;
          }
        }
      }
    }
  }
}
</style>
