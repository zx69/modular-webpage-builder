<template>
  <div class="material-brochure_module-control-box">
    <div
      class="module-control-box-inner"
      :style="{
        width: getPx(realWidth),
        transform: `scale(${scale})`
      }"
    >
      <slot></slot>
    </div>
    <ModuleControlBar :moduleSchema="moduleSchema" :index="index"></ModuleControlBar>
  </div>
</template>

<script lang="ts">
import { getPx } from '@/utils/style';
import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';
import { CompModule } from '../typings';
import ModuleControlBar from './ModuleControlBar.vue';

export default defineComponent({
  name: 'material-brochure_module-control-box',
  components: { ModuleControlBar },
  props: {
    moduleSchema: {
      type: Object as PropType<CompModule>,
      required: true,
    },
    scale: {
      type: Number,
      default: 1,
    },
    realWidth: {
      type: Number,
      default: 1420,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({});
    return {
      ...toRefs(state),
      getPx,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import "../styles.scss";
@import "../extends.scss";
.material-brochure_module-control-box {
  padding: 20px;
  position: relative;
  @include material-brochure-module-section;
  .module-control-box-inner {
    transform-origin: left top;
  }
  .material-brochure_module-control-bar {
    display: none;
    position: absolute;
    top: 0;
    right: -36px;
  }
  &:hover {
    .material-brochure_module-control-bar {
      display: flex;
    }
  }
  & + .material-brochure_module-control-box {
    margin-top: 16px;
  }
}
</style>
