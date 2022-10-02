<template>
  <div class="webpage-builder_templates-list-panel flex-column">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <header>
      <el-input
        v-model="searchKeyword"
        :prefix-icon="Search"
        placeholder="输入关键词搜索"
        @keyup.enter="handleSearchTemplateList()"
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
            <el-image :src="temp.cover" fit="cover"/>
          </div>
          <h5 class="title over-text">{{ temp.name }}</h5>
        </div>
      </main>
    </div>
  </div>
</template>

<script lang="ts">
import { fetchTemplateList } from '@/api/builder';
import {
  defineComponent, reactive, computed, ref, toRefs, inject, onMounted,
} from 'vue';
import { Search } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { setRenderSchema } from '../../store';
import { CompModule } from '../../typings';

export default defineComponent({
  name: 'webpage-builder_templates-list-panel',
  components: {},
  props: {
    title: {
      type: String,
    },
  },
  setup(props, { emit }) {
    type TemplateItem = {id: string, cover: string, name: string, content: CompModule[] | null};
    const state = reactive({
      loading: false,
      searchKeyword: '',
      selectedTemplateId: '',
      templateList: [
      ] as TemplateItem[],
    });

    const handleSearchTemplateList = async (page = 1) => {
      try {
        state.loading = true;
        const { data } = await fetchTemplateList({
          keyword: state.searchKeyword,
        });
        state.templateList = data;
      } finally {
        state.loading = false;
      }
    };

    const handleSelectTemplate = async (temp: TemplateItem) => {
      await ElMessageBox.confirm('当前模块将被覆盖, 是否确认?');
      state.selectedTemplateId = temp.id;
      if (temp.content) {
        setRenderSchema(temp.content!);
        emit('save');
      }
    };
    onMounted(() => {
      handleSearchTemplateList();
    });
    return {
      ...toRefs(state),
      Search,
      handleSelectTemplate,
      handleSearchTemplateList,
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.webpage-builder_templates-list-panel {
  height: 100%;
  padding-bottom: 44px;
  header{
    margin-top: 12px;
  }
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
