<template>
  <div class="webpage-builder_text-control-panel control-panel">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <section>
      <h4 class="subtitle">文本类型</h4>
      <ul>
        <li
          class="font-style-option"
          v-for="(fontStyle, i) in presetFontStyleMenuList"
          :key="i"
          :style="{
            ...fontStyle.style,
          }"
          :draggable="true"
          @dragstart="(ev) => handleDragStart(ev, fontStyle)"
          @click="setCustomStyle(fontStyle.style, 'uniq')"
        >
          <p
            class="over-text"
            :style="{
              fontSize: getPx(parseInt(fontStyle.style.fontSize) * mainContainerScale),
            }"
          >
            {{ fontStyle.title }}
          </p>
        </li>
      </ul>
    </section>
    <section>
      <h4 class="subtitle">字体</h4>
      <el-select
        size="mini"
        :modelValue="activeElementStyle?.fontFamily || ''"
        @change="(val) => setCustomStyle({ fontFamily: val })"
      >
        <el-option
          v-for="family in fontFamilyList"
          :key="family.value"
          :value="family.value"
          :label="family.title"
        ></el-option>
      </el-select>
      <el-select
        size="mini"
        :modelValue="activeElementStyle?.fontSize ? parseInt(activeElementStyle?.fontSize) : 14"
        @change="(val) => setCustomStyle({ fontSize: `${val}px` }, 'overwrite')"
      >
        <el-option v-for="size in fontSizeList" :key="size.value" :value="size.value" :label="size.title"></el-option>
      </el-select>
      <el-color-picker
        v-model="currentColor"
        color-format="rgb"
        popper-class="webpage-builder_color-picker"
        @active-change="(val) => setCustomStyle({ color: val })"
        @change="(val) => setCustomStyle({ color: val })"
      />
    </section>
    <section>
      <h4 class="subtitle">样式</h4>
      <div class="font-type-group flex">
        <div
          class="font-type-option flex-1"
          :class="{ active: getIsStyleValueExist(fontType.style) }"
          v-for="(fontType, i) in fontTypeBtnsList"
          :key="i"
          @click="setCustomStyle(fontType.style, 'mutex')"
        >
          <span :style="fontType.style">
            {{ fontType.title }}
          </span>
        </div>
      </div>
    </section>
    <section>
      <h4 class="subtitle">字符对齐方式</h4>
      <div class="font-align-group flex">
        <div
          class="font-align-option flex-1"
          :class="{ active: getIsStyleValueExist(textAlign.style) }"
          v-for="(textAlign, i) in textAlignBtnsList"
          :key="i"
          @click="setCustomStyle(textAlign.style)"
        >
          <span :style="textAlign.style">
            <i :class="['iconfont', textAlign.icon]"></i>
          </span>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, nextTick,
} from 'vue';
import { getPx } from '@/utils/style';
import useStyle from '@/views/builder/editor/uses/use-style';
import store, { activeElementSchema } from '../../store';
import {
  presetFontStyleMenuList, fontTypeBtnsList, fontFamilyList, fontSizeList, textAlignBtnsList,
} from '../../const/textStyleConfig';
// import BrochureColorPicker from '../BrochureColorPicker.vue';

export default defineComponent({
  name: 'webpage-builder_text-control-panel',
  components: {
    // BrochureColorPicker,
  },
  props: {
    title: {
      type: String,
    },
    isCollapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const state = reactive({
      currentColor: 'rgb(0,0,0)',
    });
    const { getIsStyleValueExist, setCustomStyle, activeElementStyle } = useStyle(activeElementSchema);
    watch(() => store.activeElementFid, async (val) => {
      await nextTick();
      state.currentColor = activeElementStyle.value?.color || 'inherite';
    });

    const handleDragStart = (ev: DragEvent, fontStyle: typeof presetFontStyleMenuList[0]) => {
      ev.dataTransfer?.setData('font-style', JSON.stringify(fontStyle));
    };

    return {
      ...toRefs(state),
      presetFontStyleMenuList,
      fontTypeBtnsList,
      fontFamilyList,
      fontSizeList,
      textAlignBtnsList,
      setCustomStyle,
      getIsStyleValueExist,
      activeElementStyle,
      mainContainerScale: computed(() => store.editorContainerScale),
      getPx,
      handleDragStart,
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.webpage-builder_text-control-panel {
  section {
    padding-bottom: 8px;
  }
  .el-select {
    width: 100%;
    margin-bottom: 8px;
  }
  .el-color-picker {
    width: 100%;
    .el-color-picker__trigger {
      padding: 0;
      width: 100%;
      height: 28px;
      overflow: hidden;
    }
    .el-color-picker__color {
      border: 0;
    }
    .el-color-picker__icon {
      position: absolute;
      right: 0px;
      width: 28px;
      height: 100%;
      background: #fff;
      color: #c0c4cc;
      line-height: 26px;
    }
  }
  .font-style-option {
    padding: 0 12px;
    margin-bottom: 8px;
    cursor: pointer;
    user-select: none; // 使文本不可选中
    &:hover {
      background-color: #f3f3f3;
    }
  }
  .font-type-option {
    background-color: #f3f3f3;
    line-height: 28px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;
    & + .font-type-option {
      margin-left: 4px;
    }
    &.active {
      background-color: #ccc;
    }
    &:last-child {
      span {
        display: inline-block;
        padding: 0 5px;
        line-height: initial;
      }
    }
  }
  .font-align-group {
    overflow: hidden;
    background-color: #f3f3f3;
  }
  .font-align-option {
    line-height: 28px;
    text-align: center;
    border-radius: 2px;
    &.active {
      color: $color-primary;
      border: 1px solid $color-primary;
      background-color: #f5ffff;
    }
  }
}
.webpage-builder_color-picker {
  .el-color-dropdown__btns {
    .el-color-dropdown__link-btn{
      display: none;
    }
  }
  .color-picker-trigger {
    width: unset;
    .arrow {
      display: block;
      width: 28px;
      text-align: center;
    }
  }
}
</style>
