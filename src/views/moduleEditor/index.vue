<template>
  <div class="module-editor flex-column">
    <header>
      <h2>Module Editor</h2>
      <PlatformRadio v-model="currentPreviewMode"></PlatformRadio>
    </header>
    <main class="flex-1 flex ">
      <codemirror
        v-model="code"
        placeholder="Code goes here..."
        :indent-with-tab="true"
        :tab-size="2"
        :extensions="extensions"
        @ready="handleReady"
        @change="log('change', $event)"
        @focus="log('focus', $event)"
        @blur="log('blur', $event)"
      />
      <section class="preview-section preview-wrapper flex-1" :class="[`preview-mode-${currentPreviewMode}`]">
        <div class="preview-container">
          <PreviewContent :renderSchema="currentSchema" :previewMode="currentPreviewMode"></PreviewContent>
        </div>
      </section>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, shallowRef, computed, watch, onMounted, ref,
} from 'vue';
import { Codemirror } from 'vue-codemirror';
// import { javascript } from '@codemirror/lang-javascript';
import { json } from '@codemirror/lang-json';
import { oneDark } from '@codemirror/theme-one-dark';
import { EditorView, ViewUpdate } from '@codemirror/view';
import PreviewContent from '@/views/builder/previewer/components/PreviewContent.vue';
import PlatformRadio from '@/views/builder/previewer/components/PlatformRadio.vue';
import { CompModule, PreviewMode } from '@/views/builder/editor/typings';
import defaultJson from './defaultJson.json';

export default defineComponent({
  name: 'module-editor',
  components: {
    Codemirror,
    PreviewContent,
    PlatformRadio,
  },
  setup() {
    const code = ref(JSON.stringify(defaultJson, null, 2));
    const extensions = [json(), oneDark];
    const cmView = shallowRef<EditorView>();
    const handleReady = ({ view }: any) => {
      cmView.value = view;
      console.log(cmView);
    };
    const currentSchema = computed(() => {
      return JSON.parse(code.value);
    });
    const currentPreviewMode = ref<PreviewMode>('pc');

    // const getCodemirrorStates = () => {
    //   const state = view.value.state
    //   const ranges = state.selection.ranges
    //   const selected = ranges.reduce((r, range) => r + range.to - range.from, 0)
    //   const cursor = ranges[0].anchor
    //   const length = state.doc.length
    //   const lines = state.doc.lines
    //   // more state info ...
    //   // return ...
    // }
    return {
      code,
      currentSchema,
      extensions,
      handleReady,
      currentPreviewMode,
      log: console.log,
    };
  },
});

</script>
<style lang="scss">
@import "@/views/builder/editor/styles.scss";
.module-editor {
  height: 100vh;
  header {
    line-height: 60px;
    background-color: #cccccc;
    padding: 0 30px;
    position: relative;
  }
  main {
    justify-content: space-between;
    align-items: stretch;
    overflow: hidden;
  }
  .edit-section {
    resize: none;
    outline: none;
  }
  .preview-section {
    width: 50%;
  }
  .v-codemirror {
    .cm-editor {
      width: 50%;
      height: 100%;
      .cm-content{
        font-family: 'Consolas' !important;
        font-size: 16px;
      }
    }
  }
  .platform-radio {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .preview-wrapper {
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    color: #000000;
    .preview-container{
      min-width: unset;
    }
    // background-color: #fff;
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
}
</style>
