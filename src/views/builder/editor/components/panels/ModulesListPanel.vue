<template>
  <div class="webpage-builder_modules-list-panel flex-column">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <main class="flex-1" v-if="modules.length">
      <!-- <div
        class="module-thumbnail-wrapper"
        v-for="(module, i) in modules"
        :key="i"
        draggable="true"
        @dragstart="(ev) => handleDragStart(ev, module)"
        :style="{
          paddingBottom: module.aspectRadio || '80%',
        }"
      >
        <div class="module-thumbnail">
          <Renderer class="in-readonly" :schema="module"></Renderer>
        </div>
      </div> -->
      <Draggable
        :list="modules"
        :group="{ name: 'modules', pull: 'clone', put: false }"
        itemKey="sid"
        :sort="false"
        @end="handleDragEnd"
      >
        <template #item="{ element }">
          <div
            class="module-thumbnail-wrapper"
            @dragstart="ev => handleDragStart(ev, element)"
            :style="{
              paddingBottom: element.aspectRadio || '80%'
            }"
          >
            <div class="module-thumbnail" ref="moduleThumbnail">
              <Renderer class="in-readonly" :schema="element" status="readonly"></Renderer>
            </div>
          </div>
        </template>
      </Draggable>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, onMounted,
} from 'vue';
import Draggable from 'vuedraggable';
// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { SortableEvent } from '@types/sortablejs';
import store, {
  modules,
} from '../../store';
import { CompModule } from '../../typings';
import Renderer from '../Renderer';

export default defineComponent({
  name: 'webpage-builder_modules-list-panel',
  components: { Renderer, Draggable },
  props: {
    title: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
    });

    const handleDragStart = (ev: DragEvent, moduleSchema: CompModule) => {
      ev.dataTransfer?.setData('module-schema-id', moduleSchema.mid!);
    };

    /* notice:
      ???????????????????????????????????????????????????????????????, ???????????????????????????????????????, ??????????????????????????????????????????module-list, ????????????????????????,
      sortablejs??????????????????drop??????????????????????????????, ????????????????????????end????????????????????????????????????.(???????????????hover???, module-list?????????disabled???)
    */
    const handleDragEnd = (ev: SortableEvent) => {
      console.log(JSON.stringify(ev.to.classList), ev.newIndex);
      if (Array.from(ev.to.classList).includes('disabled')) {
        store.renderSchemaList.splice(ev.newIndex!, 1);
      }
    };

    return {
      ...toRefs(state),
      handleDragStart,
      handleDragEnd,
      modules,
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.webpage-builder_modules-list-panel {
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
  .fixed-aspect-radio-box{
    width: 100%;
  }
}
</style>
