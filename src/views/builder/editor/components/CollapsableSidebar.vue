<template>
  <div class="collapsable-sidebar flex" :class="position">
    <div class="static-vertical-menu" v-if="showControlBar">
      <slot name="control-bar"></slot>
    </div>
    <main
      class="collapse-panel"
      :class="{
        collapsed: isPanelCollapsed
      }"
      :style="{
        width: getPx(panelWidth)
      }"
    >
      <slot name="panel"></slot>
    </main>
    <aside
      class="footer-control-bar"
      :style="{
        textAlign: position === 'left' ? 'center' : 'unset',
        width: position === 'left' ? '100%' : '40px'
      }"
      v-if="showControlBar"
    >
      <el-button v-if="position === 'left'" type="text" @click="isPanelCollapsed = !isPanelCollapsed">
        <i :class="['icon', isPanelCollapsed ? 'i-r-shouqi-16' : 'i-r-zhankai-16']"></i>
      </el-button>
      <el-button v-else type="text" @click="isPanelCollapsed = !isPanelCollapsed">
        <i :class="['icon', isPanelCollapsed ? 'i-r-zhankai-16' : 'i-r-shouqi-16']"></i>
      </el-button>
    </aside>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';
import { getPx } from '@/utils/style';

export default defineComponent({
  name: 'collapsable-sidebar',
  components: {},
  props: {
    position: {
      type: String as PropType<'left' | 'right'>,
      default: 'left',
    },
    panelWidth: {
      type: [String, Number],
      default: 200,
    },
  },
  setup(props, { slots, emit }) {
    const state = reactive({
      isPanelCollapsed: false,
    });
    return {
      ...toRefs(state),
      getPx,
      showControlBar: computed(() => !!slots['control-bar']),
    };
  },
});
</script>
<style lang="scss" scoped>
.collapsable-sidebar {
  position: relative;
  background: #fff;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  &.left {
    border-left: 0;
  }
  &.right {
    border-right: 0;
  }
  .static-vertical-menu {
    width: 60px;
    border-right: 1px solid #ddd;
  }
  .collapse-panel {
    transition: 0.3s width ease, opacity 0s ease 0.3s;
    overflow-x: hidden;
    &.collapsed {
      transition: 0.3s width ease;
      opacity: 0;
      visibility: hidden;
      width: 0 !important;
    }
  }
  .footer-control-bar {
    position: absolute;
    bottom: 0;
    height: 44px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
