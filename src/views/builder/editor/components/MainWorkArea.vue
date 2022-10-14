<template>
  <div class="webpage-builder_main-work-area" ref="mainWorkArea" @click="removeWorkAreaActiveStatus">
    <main
      ref="mainContainer"
      id="mainContainer"
      class="container"
      :style="{
        width: mainContainerWidth ? `${mainContainerWidth + 40}px` : 'unset',
        marginLeft: mainContainerWidth ? 'auto' : '90px',
        marginRight: mainContainerWidth ? 'auto' : '90px',
      }"
      @mouseover="handleMouseOver"
      @mouseout="handleMouseOut"
      @click.stop="handleClick"
    >
      <Draggable
        class="modules-list"
        handle=".draggable-handle-area"
        :class="{ disabled: isDropReceiverHovering }"
        v-model="renderSchemaList"
        group="modules"
        item-key="sid"
        :component-data="{ tag: 'div', name: 'modules-list', type: 'transtion-group' }"
        @change="handleDraggableItemChange"
      >
        <template #item="{ element, index }">
          <ModuleControlBox
            :index="index"
            :moduleSchema="element"
            :realWidth="currentPreviewAreaWidth"
            :scale="mainContainerScale"
            :style="{
              height: `${(mainContainerWidth * parseFloat(element.aspectRadio)) / 100 + 40}px`,
            }"
          >
            <Renderer :schema="element" :data="element.data" status="edit"></Renderer>
          </ModuleControlBox>
        </template>
      </Draggable>
      <DropReceiver
        ref="dropReceiverBlock"
        class="sticky-bottom-block"
        transferDataType="module-schema-id"
        @transferData="copyDropSchema"
        v-if="isExpansable"
      >
        <div class="module-receive-box flex-center">
          <i class="iconfont i-jiahao"></i>
          &nbsp;&nbsp;拖拽模块到这里
        </div>
      </DropReceiver>
      <div
        id="hoverFrame"
        class="hover-frame"
        :style="unitifyClientRect(hoverFrameClientRect) ?? {}"
        v-show="hoverFrameClientRect"
      ></div>
      <ActiveFrame />
    </main>
  </div>
</template>

<script lang="ts">
/* eslint-disable max-len */
/* eslint-disable no-template-curly-in-string */
import {
  defineComponent, reactive, computed, ref, toRefs, h, onMounted, nextTick, toRef,
} from 'vue';
import { getPx } from '@/utils/style';
import Draggable from 'vuedraggable';
import {
  CONTENT_MAX_WIDTH,
  CONTENT_MIN_WIDTH,
} from '../const/common';
import store, {
  getRelativeClientRectFromWoreArea,
  modules, setActiveElementFid, setActiveFrameClientRect, setMainContainerDom,
} from '../store';
// import modules from '../modules';
import { FrameClientRect, vueSortableEvent } from '../typings';
import { unitifyClientRect } from '../utils/common';
import Renderer from './Renderer';
import DropReceiver from './DropReceiver.vue';
import ModuleControlBox from './ModuleControlBox.vue';
import ActiveFrame from './ActiveFrame.vue';


export default defineComponent({
  name: 'webpage-builder_main-work-area',
  components: {
    Draggable,
    Renderer,
    DropReceiver,
    ModuleControlBox,
    ActiveFrame,
  },
  props: {
    isExpansable: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const mainWorkArea = ref();
    const mainContainer = ref();
    const dropReceiverBlock = ref();

    const state = reactive({
      mainContainerWidth: 0,
      currentPreviewAreaWidth: 1420, // 当前预览时的有效区域宽度
      // mainContainerScale: 1,
      hoverFrameClientRect: null as FrameClientRect | null,
      // 清空hoverFrameClientRect的定时器, 用于避免频繁清空影响性能
      // clearHoverFrameTimer: null as NodeJS.Timeout | null,

      // activeFrameClientRect: null as FrameClientRect | null,
    });

    // 投放块是否hovering中. 此时可能draggable的move已经激活, 再drop会重复添加(投放块和draggable同时添加), 所以此时要禁用draggalbe
    const isDropReceiverHovering = computed(() => {
      return dropReceiverBlock.value?.isDraghoverring || false;
    });
    const copyDropSchema = (schemaMid: string) => {
      const schema = modules.value.find(module => module.mid === schemaMid);
      if (schema) {
        // 同一页面可能有多个相同模块,各模块的data/style各不相同, 所以应深拷贝一份;
        const _copiedSchema = JSON.parse(JSON.stringify(schema));
        _copiedSchema.sid = `section${store.sectionIdCount++}`;
        store.renderSchemaList.push(_copiedSchema);
      }
    };

    const handleDraggableItemChange = (vgEvent: vueSortableEvent) => {
      if (vgEvent.added) {
        vgEvent.added.element.sid = `section${store.sectionIdCount++}`;
      }
    };

    const handleMouseOver = (ev: Event) => {
      const _target = ev.target as HTMLElement | null;
      // 没有fid说明不是可编辑元素, 忽略
      if (!_target || !_target.getAttribute('fid')) {
        return;
      }
      // if (state.clearHoverFrameTimer) {
      //   clearTimeout(state.clearHoverFrameTimer);
      // }

      // const _clientRect = _target.getBoundingClientRect();
      // const _mainContainerClientRect = mainContainer.value.getBoundingClientRect();
      // state.hoverFrameClientRect = {
      //   width: getPx(_clientRect.width),
      //   height: getPx(_clientRect.height),
      //   top: getPx(_clientRect.top - _mainContainerClientRect.top),
      //   left: getPx(_clientRect.left - _mainContainerClientRect.left),
      // };
      state.hoverFrameClientRect = getRelativeClientRectFromWoreArea(_target);
    };
    const handleMouseOut = (ev: Event) => {
      const _target = ev.target as HTMLElement | null;
      if (!_target) {
        return;
      }

      // state.clearHoverFrameTimer = setTimeout(() => {
      state.hoverFrameClientRect = null;
      // }, 0);
    };

    const handleClick = (ev: Event) => {
      console.log('click', ev);
      // console.log((ev.target as HTMLElement)?.getBoundingClientRect());
      const _target = ev.target as HTMLElement | null;
      if (!_target) {
        return;
      }
      if (!state.hoverFrameClientRect) {
        return;
      }
      setActiveFrameClientRect({ ...state.hoverFrameClientRect });
      setActiveElementFid(_target.getAttribute('fid') || '');
    };


    // 点击空白区域,清空工作区的聚焦元素和状态
    const removeWorkAreaActiveStatus = () => {
      setActiveFrameClientRect(null);
      setActiveElementFid('');
    };

    onMounted(async () => {
      // 初始化计算出mainContent的宽度, 后面宽度就不再变化.避免resize时选中框变形
      const workAreaClientRect = mainWorkArea.value.getBoundingClientRect();
      state.mainContainerWidth = workAreaClientRect.width - (180 + 40); // 180为左右margin的距离
      state.currentPreviewAreaWidth = document.body.clientWidth > CONTENT_MAX_WIDTH
        ? CONTENT_MAX_WIDTH
        : document.body.clientWidth < CONTENT_MIN_WIDTH
          ? CONTENT_MIN_WIDTH
          : document.body.clientWidth;
      // editorContainerScale的除数取当前预览有效区域, 才能保证编辑时和预览时的字高比例一样
      store.editorContainerScale = state.mainContainerWidth / state.currentPreviewAreaWidth;
      await nextTick();
      if (mainContainer.value) {
        setMainContainerDom(mainContainer.value);
      }
    });

    return {
      ...toRefs(state),
      copyDropSchema,
      handleClick,
      handleMouseOver,
      handleMouseOut,
      mainWorkArea,
      mainContainer,
      renderSchemaList: toRef(store, 'renderSchemaList'),
      removeWorkAreaActiveStatus,
      unitifyClientRect,
      mainContainerScale: computed(() => store.editorContainerScale),
      handleDraggableItemChange,
      dropReceiverBlock,
      isDropReceiverHovering,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "../styles.scss";
@import "../extends.scss";

.webpage-builder_main-work-area {
  min-width: 880px;
  overflow-y: auto;

  // margin: 0 auto;
  .container {
    margin: 20px 90px;
    position: relative;
  }
}

.module-receive-box {
  @include webpage-builder-module-section;
  height: 48px;
  color: #666;
}

.webpage-builder_module-control-bar {
  position: absolute;
  right: -36px;
}

#hoverFrame,
#activeFrame {
  position: absolute;
  border: 1px solid $color-primary;
  // !关键: 用来让元素不响应鼠标事件, 避免触发mouseover/mouseout
  pointer-events: none;
}

#activeFrame {
  border-width: 2px;
}
</style>
<style lang="scss">
.webpage-builder_main-work-area {
  .sticky-bottom-block {
    position: sticky;
    bottom: 20px;
    z-index: 99;
    user-select: none;
    // cursor: pointer;
    .icon {
      margin-right: 4px;
      font-size: 16px;
    }
    &.hovering {
      .module-receive-box {
        background: #eeeeee;
      }
    }
  }
    // 左侧拖动到中间画布的效果(sortable-ghost为vue.draggable类)
  .sortable-ghost {
    &.webpage-builder_module-control-box,
    &.module-thumbnail-wrapper {
      padding: 0;
      background: $color-primary;
      padding-bottom: 0 !important;
      height: 2px !important;
      // overflow: hidden !important;
      margin: 20px 0;
      position: relative;

      &:before {
        content: "";
        display: block;
        width: 2px;
        height: 2px;
        position: absolute;
        left: -4px;
        top: -2px;
        border-radius: 50%;
        border: 2px solid $color-primary;
        background: #ffffff;
      }
      .module-control-box-inner,
      .module-thumbnail {
        display: none;
      }
    }
  }
}
</style>
