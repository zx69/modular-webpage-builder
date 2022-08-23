<template>
  <div class="material-brochure_text-control-panel">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <h4 class="subtitle">颜色</h4>
    <BrochureColorPicker
      v-model="currentColor"
      @change="(val) => setCustomStyle({ backgroundColor: val })"
    ></BrochureColorPicker>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, nextTick,
} from 'vue';
import store, { setCustomStyle, activeElementStyle } from '../../store';
import BrochureColorPicker from '../BrochureColorPicker.vue';

export default defineComponent({
  name: 'material-brochure_text-control-panel',
  components: { BrochureColorPicker },
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
</style>
