<template>
  <DropReceiver
    class="webpage-builder_material-box"
    transferDataType="material-id"
    @transferData="receiverDropMaterial"
    v-on="material ? events : null"
    :class="$attrs.class"
    :style="$attrs.style"
    :fid="status === 'edit' && !material ? null : $attrs.fid"
  >
    <ProductTileItem
      v-if="material"
      :material="material"
      :showSupplier="showTitle"
      :showTitle="showTitle"
      :showPrice="showTitle"
      :class="{ 'ban-hover': isMobile || $attrs.status === 'edit' }"
    ></ProductTileItem>
    <div class="material-receive-box flex-column" v-else>
      <div
        class="fixed-aspect-radio-box"
        :fid="status === 'edit' && !material ? $attrs.fid : null"
        v-on="!material ? events : null"
      >
        <div class="flex-center">
          <i class="iconfont i-shangpin"></i>
        </div>
      </div>
      <div class="bottom" v-if="showTitle">
        <h4 class="title">名称或编号</h4>
        <p class="desc">价格</p>
      </div>
    </div>
  </DropReceiver>
</template>

<script lang="ts">
import {
  defineComponent, onUnmounted, reactive, toRefs, watch, PropType,
} from 'vue';
import {
  isMobile, getModuleData, saveModuleData, getEventCatchAndThrowMap,
} from '../../utils';
import store, { setActiveFrameClientRect } from '../../store';
import DropReceiver from '../DropReceiver.vue';
import { RenderStatus, ProductItem } from '../../typings';
import { draggingMaterial } from '../../uses/use-drag-material';
import ProductTileItem from '../panels/ProductTileItem.vue';

// app端webview注入的全局变量
declare const Idealab: { postMessage: (...arg: any) => void };

export default defineComponent({
  name: 'webpage-builder_material-box',
  components: { DropReceiver, ProductTileItem },
  inheritAttrs: false,
  operation: 'product',
  props: {
    data: {
      type: Object,
      required: true,
    },
    valueKey: {
      type: String,
      required: true,
    },
    showTitle: {
      type: Boolean,
      default: true,
    },
    showSupplier: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String as PropType<RenderStatus>,
      default: 'preview',
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      materialId: '',
      material: null as ProductItem | null,
    });

    const receiverDropMaterial = (materialId: string) => {
      state.material = draggingMaterial.value;
      state.materialId = materialId;
      draggingMaterial.value = null;
      setActiveFrameClientRect(null);
    };

    watch(() => state.materialId, (val, oldVal) => {
      // todo
    }, { immediate: true });


    onUnmounted(() => {
      // 模块清空操作时还原材料为未使用状态
      if (state.materialId) {
        // removeRelatedMaterialIds(state.materialId);
      }
    });

    return {
      ...toRefs(state),
      receiverDropMaterial,
      isMobile,
      events: props.status !== 'edit' ? null : getEventCatchAndThrowMap(['click', 'mouseover', 'mouseout']),
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.webpage-builder_material-box {
  .material-receive-box {
    width: 100%;
    height: 100%;
    .bottom {
      padding: 12px 0;
    }
    .iconfont {
      font-size: 32px !important;
      // margin-bottom: 12px;
    }
    .fixed-aspect-radio-box {
      padding-bottom: 100%;
      border: 1px solid #dddddd;
      border-radius: 6px;
      color: #b0b0b0;
      overflow: hidden;
      & > div {
        background-color: #f8f8f8;
        background-image: radial-gradient(circle, #dddddd 11%, transparent 11%);
        background-size: 9.1% 9.1%;
      }
    }
    .title {
      font-size: 16px;
      line-height: 22px;
      // margin-top: 8px;
    }
    .desc {
      color: #666666;
      line-height: 28px;
    }
  }
}
</style>
