<template>
  <div class="inputable-text" v-on="events">
    <div
      ref="inputRef"
      :contenteditable="state === 'input'"
      @input="e => (currentValue = e.target.innerHTML)"
      @blur="handleChange"
      @dblclick="handleDbClick"
      :class="[
        state === 'input' ? 'inputable' : 'static-text',
        overflowLine === 0 ? '' : overflowLine === 2 ? 'over-text-2' : 'over-text'
      ]"
      :style="{
        fontSize: `${mobileSizeRadio}em`,
        letterSpacing: $attrs.style?.letterSpacing || 'initial'
      }"
    >
      {{ currentValue }}
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, toRef, watch, nextTick, PropType,
} from 'vue';
import { getModuleData, saveModuleData, getEventCatchAndThrowMap } from '../../utils/helper';
import { RenderStatus } from '../../typings';

export default defineComponent({
  name: 'inputable-text',
  components: {},
  operation: 'text',
  props: {
    data: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: String,
      required: true,
    },
    // 移动版fontSize比例
    mobileSizeRadio: {
      type: Number,
      default: 1,
    },
    overflowLine: {
      type: Number,
      default: 1,
    },
    status: {
      type: String as PropType<RenderStatus>,
      default: 'preview',
    },
  },
  setup(props, { emit, attrs }) {
    const inputRef = ref<HTMLElement>();
    const state = reactive({
      state: 'preview' as 'input' | 'preview',
      currentValue: '',
    });

    watch(() => ({ data: props.data, key: props.valueKey }), ({ data, key }) => {
      state.currentValue = getModuleData(data, key) as string;
    }, { immediate: true, deep: true });

    watch(() => state.currentValue, (val) => {
      saveModuleData(props.data, props.valueKey, val);
    });

    // 非input选中文本的方法
    const selectText = (element: HTMLElement) => {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      selection?.removeAllRanges();
      selection?.addRange(range);
    };
    const handleDbClick = () => {
      state.state = 'input';
      nextTick(() => {
        inputRef.value && selectText(inputRef.value);
      });
    };

    const handleChange = () => {
      if (!inputRef.value) {
        return;
      }
      inputRef.value.style.overflow = 'scroll';
      inputRef.value.scrollTo(0, 0);
      inputRef.value.style.overflow = 'hidden';
      state.state = 'preview';
    };
    return {
      ...toRefs(state),
      inputRef,
      handleDbClick,
      handleChange,
      events: props.status !== 'edit' ? null : getEventCatchAndThrowMap(['click', 'mouseover', 'mouseout', 'mousedown']),
    };
  },
});
</script>
<style lang="scss">
.inputable-text {
  word-break: break-all;
  max-width: 100%;
  .static-text {
    overflow: hidden;
    color: inherit;
    font-weight: inherit;
    user-select: none;
  }
  .inputable {
    overflow: scroll;
    -webkit-box-orient: unset;
    outline: none;
    // display: unset !important; // 输入时不显示省略号
  }
}
</style>
