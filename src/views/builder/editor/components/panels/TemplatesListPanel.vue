<template>
  <div class="material-brochure_templates-list-panel flex-column">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <header>
      <el-input
        v-model="searchKeyword"
        size="small"
        prefix-icon="i-r-sousuo-12"
        placeholder="输入关键词搜索"
        @keyup.enter="handleMaterialTemplateList()"
        clearable
      ></el-input>
    </header>
    <div class="main-content flex-column flex-1" v-loading="loading">
      <main class="">
        <div
          class="template-tile"
          :class="{ active: selectedTemplateId === temp.id }"
          v-for="(temp, i) in templateList"
          :key="i"
          @click="handleSelectTemplate(temp)"
        >
          <div class="thumbnail">
            <base-image :src="temp.cover" />
          </div>
          <h5 class="title over-text">{{ temp.name }}</h5>
        </div>
      </main>
    </div>
    <el-pagination
      small
      hide-on-single-page
      :pager-count="3"
      class="material-search-pageination"
      layout="prev, next"
      :page-size="pageOption.size"
      :total="pageOption.total"
      :current-page="pageOption.page"
      @current-change="handleCurrentPageChange"
    >
    </el-pagination>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, inject, PropType,
} from 'vue';
// import {
//   handleGetTempList, materialBookItem,
// } from '../../bridge/api';
import { usePage, i18n, onCreated } from '../../bridge/utils';

export default defineComponent({
  name: 'material-brochure_templates-list-panel',
  components: {},
  props: {
    title: {
      type: String,
    },
    // type: {
    //   type: String as PropType<'material' | 'merchant'>,
    // },
  },
  setup(props, { emit }) {
    const {
      setSaveState,
      validateSave,
      setRenderSchema,
      fetchTemplateListFn,
    } = inject('BrochureCommonStore') || {
      setSaveState: (data: Obj) => ({}),
      validateSave: () => ({}),
      setRenderSchema: (data: Obj) => ({}),
      fetchTemplateListFn: (data: Obj) => ({}),
    };
    type ItemType = AsyncReturnType<typeof fetchTemplateListFn>['data']['records'][0];
    const state = reactive({
      loading: false,
      searchKeyword: '',
      selectedTemplateId: '',
      pageOption: {
        page: 1,
        size: 10,
        total: 0,
      },
      templateList: [
      ] as ItemType[],
    });

    const handleMaterialTemplateList = async (page = 1) => {
      try {
        state.loading = true;
        const { data } = await fetchTemplateListFn({
          page,
          size: 10,
          keyword: state.searchKeyword,
          status: 1,
        });
        // 兼容材料册和商家主页模板
        state.templateList = data.records.map(temp => ({
          id: temp.id,
          cover: temp.cover || temp.coverPictureUrl,
          name: temp.name,
          content: temp.content || temp.tempJson,
        }));
        state.pageOption.page = page;
        state.pageOption.total = data.total;
      } finally {
        state.loading = false;
      }
    };

    const handleCurrentPageChange = (page: number) => {
      state.pageOption.page = page;
      handleMaterialTemplateList(page);
    };
    const handleSelectTemplate = async (temp: ItemType) => {
      state.selectedTemplateId = temp.id;
      if (temp.content?.content) {
        const isSaved = await validateSave();
        if (isSaved) {
          setRenderSchema(temp.content.content);
          setSaveState(false);
        } else {
          emit('save');
        }
      }
    };
    onCreated(() => {
      handleMaterialTemplateList();
    });
    return {
      ...toRefs(state),
      handleSelectTemplate,
      handleCurrentPageChange,
      handleMaterialTemplateList,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.material-brochure_templates-list-panel {
  height: 100%;
  padding-bottom: 44px;
  // header {
  //   margin-bottom: 20px;
  // }
  .main-content {
    margin-left: -20px;
    margin-right: -20px;
    padding: 0 20px;
    overflow: auto;
  }
  main {
    padding-top: 20px;
    display: grid;
    grid-template-columns: repeat(2, calc(50% - 6px));
    gap: 12px;
  }
  .template-tile {
    cursor: pointer;
    .thumbnail {
      height: 108px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
    .title {
      font-size: 12px;
      font-weight: 400;
      line-height: 18px;
      margin-top: 4px;
    }
    &.active {
      .thumbnail {
        box-shadow: 0 0 0 2px #fff, 0 0 0 4px $color-primary;
      }
    }
  }
}
</style>
