<template>
  <div class="material-brochure_collapse-search-filter">
    <header>
      <el-button class="handle-btn--text" type="text" @click="isCollapsed = !isCollapsed">
        <i class="icon i-r-shaixuan-12"></i>
        筛选
      </el-button>
    </header>
    <div class="static-form">
      <el-input
        v-model="searchParams.keywords"
        :prefix-icon="Search"
        placeholder="关键词"
        @keyup.enter="handleSearch"
      ></el-input>
    </div>
    <div :class="['collapse-form', { 'is-open': !isCollapsed }]">
      <el-select v-model="searchParams.status" placeholder="商品状态" clearable>
        <el-option label="新品" value="new"></el-option>
        <el-option label="奥莱" value="outlet"></el-option>
      </el-select>
      <footer class="flex">
        <el-button class="flex-1" size="small" type="primary" @click="handleReset">取消</el-button>
        <el-button class="flex-1" size="small" @click="handleSearch">确定</el-button>
      </footer>
    </div>
    <Teleport to="#tileListWrap" v-if="!isCollapsed">
      <div class="search-collapse-mask" @click="isCollapsed = true"></div>
    </Teleport>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, onMounted, inject, watch,
} from 'vue';
import { Search } from '@element-plus/icons-vue';

export default defineComponent({
  name: 'material-brochure_collapse-search-filter',
  props: {
    handleChange: {
      type: Function,
      required: true,
    },
  },
  emits: ['search'],
  setup(props, { emit }) {
    const state = reactive({
      isCollapsed: true,
      searchParams: {
        keywords: '',
        status: '',
      },
    });


    const handleSearch = () => {
      const params = {
        ...state.searchParams,
      };
      // props.handleChange(params);
      state.isCollapsed = true;
    };

    const handleReset = () => {
      handleSearch();
    };


    onMounted(async () => {
      await handleSearch();
    });

    return {
      ...toRefs(state),
      Search,
      handleSearch,
      handleReset,
    };
  },
});
</script>
<style lang="scss">
.material-brochure_collapse-search-filter {
  position: relative;
  z-index: 30;
  header {
    text-align: right;
    line-height: 44px;
    padding: 0 20px;
    margin-bottom: 12px;
  }
  .handle-btn--text {
    font-size: 12px;
  }
  .static-form,
  .collapse-form {
    padding: 0 20px;

    & > div {
      width: 100%;
      margin-bottom: 12px;
    }
  }
  .collapse-form {
    transition: transform 0.1s ease, opacity 0s linear 0.1s;
    transform-origin: top center;
    transform: scaleY(0);
    opacity: 0;
    padding-bottom: 12px;
    position: absolute;
    left: 0;
    right: 0;
    top: 100px;
    background-color: #fff;
    &.is-open {
      transform: scaleY(1);
      opacity: 1;
      transition: transform 0.25s ease, opacity 0s;
      box-shadow: 0px 3px 5px 0px rgba(28, 35, 63, 0.08);
    }
  }
}
</style>
