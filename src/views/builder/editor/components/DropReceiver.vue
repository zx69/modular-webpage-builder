<template>
  <div class="drop-receiver" :class="{ hovering: isDraghoverring }" v-on="dropHandler">
    <slot :dropTransferData="dropTransferData" />
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';

export default defineComponent({
  name: 'drop-receiver',
  components: {},
  props: {
    // 要响应的拖动dataTransfer.data.type
    transferDataType: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      isDraghoverring: false,
      dropTransferData: '',
    });
    const dropHandler = {
      dragover: (ev: DragEvent) => {
        ev.preventDefault();
      },
      dragenter: (ev: DragEvent) => {
        ev.preventDefault();
        state.isDraghoverring = true;
      },
      dragleave: (ev: DragEvent) => {
        ev.preventDefault();
        state.isDraghoverring = false;
      },
      drop: (ev: DragEvent) => {
        ev.preventDefault();
        state.isDraghoverring = false;
        state.dropTransferData = ev.dataTransfer?.getData(props.transferDataType) ?? '';
        if (state.dropTransferData) {
          emit('transferData', state.dropTransferData);
        }
      },
    };
    return {
      ...toRefs(state),
      dropHandler,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.drop-receiver {
}
</style>
