<template>
  <div class="material-brochure_modules-list-panel flex-column">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <!-- <main class="flex-1" v-if="modules.length">
      <div
        class="module-thumbnail-wrapper"
        v-for="(module, i) in modules"
        :key="i"
        draggable="true"
        @dragstart="(ev) => handleDragStart(ev, module)"
        :style="{
          paddingBottom: module.aspectRadio || '80%',
        }"
      >
        <div class="module-thumbnail" ref="moduleThumbnail">
          <Renderer class="in-readonly" :schema="module"></Renderer>
        </div>
      </div>
    </main> -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, onMounted,
} from 'vue';
// import { listRef } from '../../bridge/utils';
// // import modules from '../../modules';
// import {
//   modules,
// } from '../../store';
// import { CommonCompProp } from '../../types';
// import Renderer from '../Renderer';

export default defineComponent({
  name: 'material-brochure_modules-list-panel',
  // components: { Renderer },
  props: {
    title: {
      type: String,
    },
    // // 是否过滤掉视频. 暂时先用这个props过滤
    // excludeVideo: {
    //   type: Boolean,
    //   default: false,
    // },
  },
  setup(props, { emit }) {
    // const state = reactive({
    // });
    // const moduleThumbnail = listRef<HTMLDivElement>();

    // const handleDragStart = (ev: DragEvent, moduleSchema: CommonCompProp) => {
    //   ev.dataTransfer?.setData('module-schema-id', moduleSchema.mid);
    // };

    return {
      // ...toRefs(state),
      // handleDragStart,
      // moduleThumbnail,
      // modules,
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.material-brochure_modules-list-panel {
  height: 100%;
  > main {
    margin-left: -20px;
    margin-right: -20px;
    padding: 0 20px;
    margin-bottom: 50px;
    overflow: auto;
  }
  .module-thumbnail-wrapper {
    margin-top: 6px;
    margin-bottom: 6px;
    width: 160px;
    height: 0;
    overflow: hidden;
    border: 1px solid #dddddd;
    border-radius: 6px;
  }
  .module-thumbnail {
    width: 1420px;
    transform: scale(0.11267);
    transform-origin: left top;
    border-radius: 20px;
    @extend %flex-center;
    > .mc-module {
      width: 100%;
    }
  }
}
</style>
