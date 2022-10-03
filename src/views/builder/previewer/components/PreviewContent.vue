<template>
  <div class="brochure_preview-iframe-window flex-1">
    <Renderer
      v-for="schema in schemaList"
      :key="schema.sid"
      :schema="schema"
      :data="schema.data"
      :previewMode="previewMode"
      :status="status"
      :class="`in-${status}`"
    ></Renderer>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';
import Renderer from '../../editor/components/Renderer';
import { CompModule, PreviewMode, RenderStatus } from '../../editor/typings';

export default defineComponent({
  name: 'brochure_preview-iframe-window',
  components: { Renderer },
  props: {
    renderSchema: {
      type: [Array, Object] as PropType<CompModule | CompModule[]>,
      required: true,
    },
    previewMode: {
      type: String as PropType<PreviewMode>,
      default: 'pc',
    },
    status: {
      type: String as PropType<RenderStatus>,
      default: 'preview',
    },
  },
  setup(props, { emit }) {
    const schemaList = computed(() => {
      if (!props.renderSchema) {
        return [];
      }
      return Array.isArray(props.renderSchema) ? props.renderSchema : [props.renderSchema];
    });
    return {
      schemaList,
    };
  },
});
</script>
<style lang="scss" scoped>
.brochure_preview-iframe-window {
  overflow-y: auto;
}
</style>
