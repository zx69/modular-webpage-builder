<template>
  <div class="page_builder-index flex-column">
    <HeaderBar @preview="isPreviewing = true" @setSchema="setRenderSchema" />
    <main class="main-content flex-1">
      <BrochureEditor
        ref="BrochureEditor"
        class="flex-1"
        :leftSidebarTabsConfig="leftSidebarTabsConfig"
        :rightSidebarTabsConfig="rightSidebarTabsConfig"
      />
    </main>
    <!-- <BrochurePreviewer
      v-model:isPreviewing="isPreviewing"
      qrcodeUrl="/merchant-homepage/detail"
      :qrcodeQueryId="companyInfo?.orgId"
      qrcodeQueryKey="orgId"
    /> -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, h,
} from 'vue';
import BrochureEditor from './editor/index.vue';
import HeaderBar from './components/HeaderBar.vue';
import BrochureBaseInfoForm from './components/BrochureBaseInfoForm.vue';
import ModulesListPanel from './editor/components/panels/ModulesListPanel.vue';
// import TemplatesListPanel from './editor/components/panels/TemplatesListPanel.vue';
import TextControlPanel from './editor/components/panels/TextControlPanel.vue';
// import ShapeControlPanel from './editor/components/panels/ShapeControlPanel.vue';
// import HotPointControlPanel from './editor/components/panels/HotPointControlPanel.vue';
import PhotoLibraryPanel from './editor/components/panels/PhotoLibraryPanel.vue';
// import MaterialsListPanel from './editor/components/panels/MaterialsListPanel.vue';
// import ModelListPanel from './editor/components/panels/ModelListPanel.vue';

export default defineComponent({
  name: 'page_builder-index',
  components: {
    HeaderBar,
    BrochureEditor,
  },
  props: {},
  setup(props, { emit }) {
    const state = reactive({});
    const leftSidebarTabsConfig = [
      // {
      //   label: '模板',
      //   value: 'template',
      //   icon: ' i-r-moban-16',
      //   component: h(TemplatesListPanel, {
      //     onSave: () => {
      //       // headerBar.value?.handleSaveCommand();
      //     },
      //   }),
      // },
      {
        label: '模块', value: 'module', icon: ' i-r-mokuai-16', component: ModulesListPanel,
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
        label: '材料册设置', value: 'base-info', icon: ' i-settings', component: BrochureBaseInfoForm,
      },
    ];
    return {
      ...toRefs(state),
      leftSidebarTabsConfig,
      rightSidebarTabsConfig,
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
        .material-brochure_previewer {
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
