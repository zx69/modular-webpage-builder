<template>
  <DropReceiver
    class="webpage-builder_material-box"
    transferDataType="product-id"
    @transferData="receiverDropMaterial"
    v-on="product ? events : null"
    :class="$attrs.class"
    :style="$attrs.style"
    :fid="status === 'edit' && !product ? null : $attrs.fid"
  >
    <ProductTileItem
      v-if="product"
      :product="product"
      :showSupplier="showTitle"
      :showTitle="showTitle"
      :showPrice="showTitle"
      :class="{ 'ban-hover': isMobile || status === 'edit' }"
    ></ProductTileItem>
    <div class="product-receive-box flex-column" v-else>
      <div
        class="fixed-aspect-radio-box"
        :fid="status === 'edit' && !product ? $attrs.fid : null"
        v-on="!product ? events : null"
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
import { setActiveFrameClientRect } from '../../store';
import DropReceiver from '../DropReceiver.vue';
import { RenderStatus, ProductItem } from '../../typings';
import { draggingProduct } from '../../uses/use-drag-product';
import ProductTileItem from '../panels/ProductTileItem.vue';
import { relatedProductsList, removeRelatedProductIds } from '../../uses/use-related-products';

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
      productId: '',
      product: null as ProductItem | null,
    });

    const receiverDropMaterial = (productId: string) => {
      const _p = relatedProductsList.value.find(m => m.id === productId);
      if (_p) {
        state.product = _p;
      } else {
        relatedProductsList.value.push(draggingProduct.value!);
        state.product = draggingProduct.value;
      }
      state.productId = productId;
      draggingProduct.value = null;
      setActiveFrameClientRect(null);
    };

    watch(() => state.productId, (val, oldVal) => {
      if (!val) {
        if (!oldVal) {
          return;
        }
        // oldVal有值而val无值表示为清空材料操作
        removeRelatedProductIds(oldVal);
      } else if (oldVal) {
        // oldVal和val都有值而表示为替换材料操作
        removeRelatedProductIds(oldVal);
      }
      console.log('set', props.data, props.valueKey, val);
      saveModuleData(props.data, props.valueKey, val);
      // setRelatedMaterialsIds(state.productId);
      const _p = relatedProductsList.value.find(m => m.id === val);
      state.product = _p ?? null;
    }, { immediate: true });

    // 该watch只在初始化等整体替换product列表时触发(无deep)
    watch(() => relatedProductsList.value, (val) => {
      const _p = val.find(m => m.id === state.productId);
      state.product = _p ?? null;
    });

    // 初始化获取productId
    watch(() => ({ data: props.data, key: props.valueKey }), ({ data, key }) => {
      state.productId = getModuleData(data, key) as string;
      console.log('get', data, key);
    }, { immediate: true, deep: true });

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
  .product-receive-box {
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
