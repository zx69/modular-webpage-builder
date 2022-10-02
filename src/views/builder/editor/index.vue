<template>
  <div class="webpage-builder_generator_index flex">
    <CollapsableSidebar v-if="leftSidebarTabsConfig" class="left-sidebar" :panelWidth="200">
      <template #control-bar v-if="leftSidebarTabsConfig.length > 1">
        <div class="block-radio-group">
          <div
            v-for="tab in leftSidebarTabsConfig"
            :key="tab.value"
            class="block-radio"
            :class="{ active: leftSidebarActiveValue === tab.value }"
            @click="leftSidebarActiveValue = tab.value"
          >
            <i :class="['iconfont', tab.icon]"></i>
            {{ tab.label }}
          </div>
        </div>
      </template>
      <template #panel>
        <div
          class="panel-wrapper"
          v-for="tab in leftSidebarTabsConfig"
          :key="tab.value"
          v-show="leftSidebarActiveValue === tab.value"
        >
          <component :is="tab.component" :title="tab.label"></component>
        </div>
      </template>
    </CollapsableSidebar>
    <MainWorkArea class="flex-1" ref="mainWorkArea" :isExpansable="isModulesExpansable"></MainWorkArea>
    <CollapsableSidebar v-if="rightSidebarTabsConfig" class="right-sidebar" position="right" :panelWidth="240">
      <template #control-bar>
        <div class="block-radio-group">
          <template v-for="tab in rightSidebarTabsConfig" :key="tab.value">
            <el-tooltip
              effect="light"
              :content="tab.label"
              placement="left"
              :show-arrow="false"
              popper-class="block-radio-tooltip"
              :offset="-6"
            >
              <div
                class="block-radio"
                :class="{ active: rightSidebarActiveValue === tab.value }"
                @click="rightSidebarActiveValue = tab.value"
              >
                <i :class="['iconfont', tab.icon]"></i>
              </div>
            </el-tooltip>
          </template>
        </div>
      </template>
      <template #panel>
        <div
          class="panel-wrapper"
          v-for="tab in rightSidebarTabsConfig"
          :key="tab.value"
          v-show="rightSidebarActiveValue === tab.value"
        >
          <component
            :is="tab.component"
            :title="tab.label"
            :panelType="tab.panelType"
          ></component>
        </div>
      </template>
    </CollapsableSidebar>
  </div>
</template>

<script lang="ts">
/* eslint-disable max-len */
/* eslint-disable no-template-curly-in-string */
import {
  defineComponent,
  reactive,
  computed,
  ref,
  toRefs,
  h,
  toRef,
  watch,
  PropType,
} from 'vue';
import { PanelConfig } from './typings';
// import store, {
//   resetStore,
//   activeElementSchema,
// } from './store';
import MainWorkArea from './components/MainWorkArea.vue';
import CollapsableSidebar from './components/CollapsableSidebar.vue';
// import { onCreated } from './bridge/utils';

export default defineComponent({
  name: 'webpage-builder_generator_index',
  components: {
    MainWorkArea,
    CollapsableSidebar,
  },
  props: {
    leftSidebarTabsConfig: {
      type: Array as PropType<PanelConfig[]>,
      default: () => [],
    },
    rightSidebarTabsConfig: {
      type: Array as PropType<PanelConfig[]>,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      leftSidebarActiveValue: props.leftSidebarTabsConfig?.length
        ? props.leftSidebarTabsConfig?.[props.leftSidebarTabsConfig.length - 1]?.value
        : null,
      rightSidebarActiveValue: props.rightSidebarTabsConfig?.[0]?.value,
    });
    return {
      ...toRefs(state),
    };
  },
});
</script>
<style lang="scss">
@import "./styles.scss";
.webpage-builder_generator_index {
  height: 100%;
  .left-sidebar {
    .static-vertical-menu {
      width: 60px;
    }
    .block-radio {
      height: 60px;
      margin-top: 10px;
      i {
        margin-bottom: 4px;
      }
    }
  }
  .right-sidebar {
    .static-vertical-menu {
      width: 40px;
    }
    .block-radio {
      height: 40px;
      &.active {
        > i {
          color: $color-primary;
          padding: 5px;
          border-radius: 4px;
          background-color: rgba(#21bfb8, 0.1);
        }
      }
    }
  }

  .panel-wrapper {
    padding: 0 20px;
    height: 100%;
    overflow: hidden;
  }
  .collapsable-sidebar {
    .block-radio-group {
      .block-radio {
        @extend %flex-center;
        flex-direction: column;
        color: #666;
        outline: none;
        cursor: pointer;
        &:hover {
          color: $color-primary;
        }
        &.active {
          color: $color-primary;
        }
      }
    }
  }
}

.block-radio-tooltip {
  padding: 3px 10px;
}
</style>
