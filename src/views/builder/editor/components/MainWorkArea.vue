<template>
  <div class="material-brochure_main-work-area" ref="mainWorkArea">
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
      <ModuleControlBox
        v-for="(schema, i) in renderSchemaList"
        :key="schema.sid"
        :index="i"
        :moduleSchema="schema"
        :realWidth="currentPreviewAreaWidth"
        :scale="mainContainerScale"
        :style="{
          height: `${(mainContainerWidth * parseFloat(schema.aspectRadio)) / 100 + 40}px`,
        }"
      >
        <Renderer :schema="schema" :data="schema.data" status="edit"></Renderer>
      </ModuleControlBox>
      <DropReceiver transferDataType="module-schema-id" @transferData="copyDropSchema" v-if="isExpansable">
        <div class="module-receive-box flex-center">
          <i class="icon i-r-tianjia-16"></i>
          拖拽模块到这里
        </div>
      </DropReceiver>
      <div id="hoverFrame" class="hover-frame" :style="hoverFrameClientRect" v-show="hoverFrameClientRect"></div>
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
import {
  CONTENT_MAX_WIDTH,
  CONTENT_MIN_WIDTH,
} from '../const/common';
import store, {
  modules, setActiveElementFid, setActiveFrameClientRect,
} from '../store';
// import modules from '../modules';
import { FrameClientRect } from '../typings';
import Renderer from './Renderer';
import DropReceiver from './DropReceiver.vue';
import ModuleControlBox from './ModuleControlBox.vue';
import ActiveFrame from './ActiveFrame.vue';


export default defineComponent({
  name: 'material-brochure_main-work-area',
  components: {
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
    const state = reactive({
      mainContainerWidth: 0,
      currentPreviewAreaWidth: 1420, // 当前预览时的有效区域宽度
      // mainContainerScale: 1,
      hoverFrameClientRect: null as FrameClientRect | null,
      // 清空hoverFrameClientRect的定时器, 用于避免频繁清空影响性能
      // clearHoverFrameTimer: null as NodeJS.Timeout | null,

      // activeFrameClientRect: null as FrameClientRect | null,
    });

    const copyDropSchema = (schemaMid: string) => {
      const schema = modules.value.find(module => module.mid === schemaMid);
      if (schema) {
        // const { data } = schema;
        // schema.data = JSON.parse(JSON.stringify(data));
        // 同一材料册可能有多个相同模块,各模块的data/style各不相同, 所以应深拷贝一份;
        const _copiedSchema = JSON.parse(JSON.stringify(schema));
        _copiedSchema.sid = `section${store.sectionIdCount++}`;
        store.renderSchemaList.push(_copiedSchema);
      }
    };

    const handleMouseOver = (ev: Event) => {
      const _target = ev.target as HTMLElement | null;
      console.log(_target, _target?.getAttribute('fid'));
      // 没有fid说明不是可编辑元素, 忽略
      if (!_target || !_target.getAttribute('fid')) {
        return;
      }
      // if (state.clearHoverFrameTimer) {
      //   clearTimeout(state.clearHoverFrameTimer);
      // }

      const _clientRect = _target.getBoundingClientRect();
      const _mainContainerClientRect = mainContainer.value.getBoundingClientRect();
      state.hoverFrameClientRect = {
        width: getPx(_clientRect.width),
        height: getPx(_clientRect.height),
        top: getPx(_clientRect.top - _mainContainerClientRect.top),
        left: getPx(_clientRect.left - _mainContainerClientRect.left),
      };
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

    onMounted(() => {
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
      mainContainerScale: computed(() => store.editorContainerScale),
    };
  },
});
</script>
<style lang="scss" scoped>
@import "../styles.scss";
@import "../extends.scss";

.material-brochure_main-work-area {
  min-width: 880px;
  overflow-y: auto;

  // margin: 0 auto;
  .container {
    margin: 20px 90px;
    position: relative;
  }
}

.module-receive-box {
  @include material-brochure-module-section;
  height: 48px;
  color: #666;
}

.material-brochure_module-control-bar {
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
.material-brochure_main-work-area {
  .drop-receiver {
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
}
</style>
