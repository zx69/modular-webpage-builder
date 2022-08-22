<template>
  <div class="page_builder-index">
    <HeaderBar @preview="isPreviewing = true" @setSchema="setRenderSchema" />
    <main class="main-content flex-1"></main>
    <!-- <BrochurePreviewer
      v-model:isPreviewing="isPreviewing"
      qrcodeUrl="/merchant-homepage/detail"
      :qrcodeQueryId="companyInfo?.orgId"
      qrcodeQueryKey="orgId"
    /> -->
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs,
} from 'vue';
import HeaderBar from './components/HeaderBar.vue';

export default defineComponent({
  name: 'page_builder-index',
  components: {
    HeaderBar,
  },
  props: {},
  setup(props, { emit }) {
    const state = reactive({});
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss" scoped>
// @import 'url'
.page_builder-index {
}
</style>
