<template>
  <div class="platform-radio flex">
    <div
      v-for="platform in platformRadioConfig"
      :key="platform.value"
      class="platform-btn flex-center"
      :class="{
        active: currentValue === platform.value,
      }"
      @click="currentValue = platform.value"
    >
      <i :class="['iconfont', platform.icon]"></i>
    </div>
  </div>
</template>

<script lang="ts">
import useSyncValue from '@/utils/uses/use-sync-value';
import {
  defineComponent, reactive, computed, ref, toRefs, toRef, PropType,
} from 'vue';
import { PreviewMode } from '../../editor/typings';

export default defineComponent({
  name: 'platform-radio',
  components: {},
  props: {
    modelValue: {
      type: String as PropType<PreviewMode>,
      default: 'pc',
    },
  },
  setup(props, { emit }) {
    const { currentValue } = useSyncValue<typeof props.modelValue>(toRef(props, 'modelValue'), emit);

    const platformRadioConfig = [
      { label: 'PC', icon: 'i-pc', value: 'pc' },
      { label: 'mobile', icon: 'i-mobile', value: 'mobile' },
    ] as const;

    return {
      platformRadioConfig,
      currentValue,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.platform-radio {
  height: 100%;
  align-items: stretch;
}
.platform-btn {
  width: 46px;
  font-size: 30px;
  color: #ddd;
  cursor: pointer;
  .iconfont{
    font-size: inherit;
  }
  &.active {
    color: inherit;
  }
}
</style>
