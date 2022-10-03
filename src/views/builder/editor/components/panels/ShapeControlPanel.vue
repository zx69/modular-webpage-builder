<template>
  <div class="webpage-builder_shape-control-panel control-panel">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <h4 class="subtitle">颜色</h4>
    <el-color-picker
      v-model="currentColor"
      color-format="rgb"
      popper-class="webpage-builder_color-picker"
      @active-change="(val) => setCustomStyle({ backgroundColor: val })"
      @change="(val) => setCustomStyle({ backgroundColor: val })"
    />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, nextTick,
} from 'vue';
import store, { activeElementSchema } from '../../store';
import useStyle from '../../uses/use-style';

export default defineComponent({
  name: 'webpage-builder_text-control-panel',
  props: {
    title: {
      type: String,
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      currentColor: 'transparent',
    });
    const { setCustomStyle, activeElementStyle } = useStyle(activeElementSchema);

    watch(() => store.activeElementFid, async (val) => {
      await nextTick();
      state.currentColor = activeElementStyle.value?.backgroundColor || 'transparent';
    });

    return {
      ...toRefs(state),
      setCustomStyle,
    };
  },
});
</script>
<style lang="scss">
.webpage-builder_shape-control-panel {
}
</style>
