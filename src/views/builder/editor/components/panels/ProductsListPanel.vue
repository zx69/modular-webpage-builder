<template>
  <div class="webpage-builder_materials-list-panel control-panel flex-column">
    <h3 class="sidebar-title" v-if="title">
      {{ title }}
    </h3>
    <main class="main-content flex-column flex-1">
      <CollapseSearchFilter ref="collapseSearchFilterEl" :handleChange="handleSearch" />
      <div id="tileListWrap" class="loading-wrap" v-loading="loading" :element-loading-text="loadingText">
        <div class="product-search-list" ref="materialListWrapEl">
          <ProductTileItem
            v-for="(product, i) in productList"
            :key="i"
            :product="product"
            :draggable="true"
            :showSupplier="false"
            @dragstart="(ev) => handleDragStart(ev, product)"
          ></ProductTileItem>
        </div>
        <div v-if="productList.length === 0" class="no-data-error">暂无数据</div>
      </div>

      <el-pagination
        small
        :pager-count="3"
        hide-on-single-page
        class="search-pageination"
        layout="prev, next"
        :page-size="pageOption.size"
        :total="pageOption.total"
        :current-page="pageOption.page"
        @current-change="handleCurrentPageChange"
      >
      </el-pagination>
    </main>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch,
} from 'vue';
import { fetchProductList } from '@/api/builder';
import { ProductItem } from '../../typings';
import { draggingProduct } from '../../uses/use-drag-product';
import ProductTileItem from './ProductTileItem.vue';
import CollapseSearchFilter from './CollapseSearchFilter.vue';

export default defineComponent({
  name: 'webpage-builder_materials-list-panel',
  components: {
    CollapseSearchFilter,
    ProductTileItem,
  },
  props: {
    title: {
      type: String,
    },
  },
  setup(props, { emit }) {
    const materialListWrapEl = ref<HTMLDivElement>();
    const collapseSearchFilterEl = ref<InstanceType<typeof CollapseSearchFilter>>();

    const state = reactive({
      loading: false,
      loadingText: '加载中',
      productList: [] as ProductItem[],
      currentParams: {
        keywords: '',
        status: '',
      } as Obj,
      pageOption: {
        page: 1,
        size: 10,
        total: 20,
      },
    });

    const getMaterialList = async () => {
      try {
        state.loading = true;
        state.productList = await fetchProductList({
          ...state.currentParams,
          ...state.pageOption,
        });
      } finally {
        state.loading = false;
      }
    };

    const handleCurrentPageChange = async (page: number) => {
      state.pageOption.page = page;
      if (materialListWrapEl.value) materialListWrapEl.value.scrollTop = 0;
      await getMaterialList();
    };

    const handleSearch = async (params: Obj = { page: 1 }) => {
      state.pageOption.page = params.page || 1;
      state.currentParams = params;
      await getMaterialList();
    };


    const handleDragStart = (ev: DragEvent, product: ProductItem) => {
      // 拖动材料先保存到store中;
      draggingProduct.value = product;
      ev.dataTransfer?.setData('product-id', product.id);
    };

    getMaterialList();
    return {
      ...toRefs(state),
      materialListWrapEl,
      handleSearch,
      handleCurrentPageChange,
      collapseSearchFilterEl,
      handleDragStart,
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.webpage-builder_materials-list-panel {
  height: 100%;
  position: relative;
  .sidebar-title {
    position: absolute;
    z-index: 30;
    width: 100%;
  }
  .main-content {
    margin-left: -20px;
    margin-right: -20px;
    overflow: hidden;
  }
  .loading-wrap {
    flex: 1;
    overflow: auto;
    position: relative;
    .product-search-list {
      max-height: 100%;
      overflow: auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: repeat(2, calc(50% - 6px));
      gap: 12px 12px;
    }
    .search-collapse-mask {
      position: absolute;
      z-index: 9;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: rgba(#000000, 0.2);
    }
  }
  .product-tile-item {
    .hover-footer .gray-tag {
      display: none !important;
    }
  }
  .no-data-error {
    text-align: center;
    color: #dddddd;
    margin-top: 60px !important;
  }
  .search-pageination{
    margin: 0 auto;
  }
}
</style>
