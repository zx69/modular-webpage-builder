<template>
  <div class="webpage-builder_shape-control-panel control-panel">
    <h3 class="sidebar-title" v-if="title">{{ title }}</h3>
    <h4 class="subtitle">填充</h4>

    <div class="flex-vertical-center">
      <el-checkbox
        v-model="isColorChecked"
        :disabled="!isColorCheckable"
        @change="changeColorCheckable"
      />
      <!-- <BrochureColorPicker
        :disabled="!isColorCheckable"
        v-model="shapeStyle.backgroundColor"
        @change="val => isColorChecked && setCustomStyle({ backgroundColor: val })"
      ></BrochureColorPicker> -->
      <el-color-picker
        :disabled="!isColorCheckable"
        v-model="shapeStyle.backgroundColor"
        color-format="rgb"
        popper-class="webpage-builder_color-picker-popper"
        @active-change="(val) => isColorChecked && setCustomStyle({ backgroundColor: val })"
        @change="(val) => isColorChecked && setCustomStyle({ backgroundColor: val })"
      />
      <el-input size="mini" v-model="shapeStyle.backgroundColor" readonly :disabled="!isColorCheckable"> </el-input>
    </div>
    <h4 class="subtitle">描边</h4>
    <div class="flex-vertical-center">
      <el-checkbox
        v-model="isBorderStyleChecked"
        :disabled="!isBorderStyleCheckable"
        @change="changeBorderStyleCheckable"
      />
      <!-- <BrochureColorPicker
        :disabled="!isBorderStyleCheckable"
        v-model="currentBorderColor"
        @change="val => isBorderStyleChecked && handleBorderColorAndWidthChange(val)"
      ></BrochureColorPicker> -->
      <el-color-picker
        :disabled="!isBorderStyleCheckable"
        v-model="currentBorderColor"
        color-format="rgb"
        popper-class="webpage-builder_color-picker-popper"
        @active-change="(val) => isBorderStyleChecked && handleBorderColorAndWidthChange(val)"
        @change="(val) => isBorderStyleChecked && handleBorderColorAndWidthChange(val)"
      />
      <div class="flex border-style-form-item">
        <el-dropdown
          class="flex-1"
          popper-class="border-style-selector-menu"
          trigger="click"
          :offset="-1"
          :disabled="!isBorderStyleCheckable"
          @command="val => isBorderStyleChecked && handleBorderStyleChange(val)"
        >
          <div class="border-style-selector flex-vertical-center">
            <div class="border-style-example-line" :style="{ ...currentBorderStyleOption.style }"></div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                class="flex-vertical-center"
                v-for="bStyle in borderStyleOptions"
                :key="bStyle.value"
                :command="bStyle"
              >
                <div class="border-style-example-line" :style="{ ...bStyle.style }"></div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <!-- <el-select size="mini" v-model="shapeStyle.borderWidth" :popper-append-to-body="false">
          <el-option label="Restaurant" value="1" v-for="bStyle in borderStyleOptions" :key="bStyle.value">
            <div class="border-style-example-line" :style="{ borderBottomStyle: bStyle.value }"></div>
          </el-option>
        </el-select> -->
        <el-input-number
          size="mini"
          min="0"
          :disabled="!isBorderStyleCheckable"
          v-model="currentBorderWidth"
          controls-position="right"
          @change="val => isBorderStyleChecked && handleBorderColorAndWidthChange(val)"
        ></el-input-number>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, watch, nextTick,
} from 'vue';
import store, { activeElementSchema } from '../../store';
import useStyle from '../../uses/use-style';

const getBorderStyle = (color: string, solidRadio: string, unitLength: string, borderWidth = 2) => {
  return {
    backgroundImage: `linear-gradient(to right, ${color} 0%, ${color} ${solidRadio}, transparent ${solidRadio}),
        linear-gradient(to right, ${color} 0%, ${color} ${solidRadio}, transparent ${solidRadio}),
        linear-gradient(to bottom, ${color} 0%, ${color} ${solidRadio}, transparent ${solidRadio}),
        linear-gradient(to bottom, ${color} 0%, ${color} ${solidRadio}, transparent ${solidRadio})`,
    backgroundSize: `${unitLength} ${borderWidth}px, ${unitLength} ${borderWidth}px, ${borderWidth}px ${unitLength}, ${borderWidth}px ${unitLength}`,
    backgroundRepeat: 'repeat-x, repeat-x, repeat-y, repeat-y',
    backgroundPosition: 'top left, bottom left, top left, top right',
  };
};

export const getBorderStyleFromBgImage = (bgImageVal: string) => {
  const keys = /^linear-gradient\(to right, .+? 0%, (.+?) (.+?),/.exec(bgImageVal);
  return {
    color: keys?.[1] ?? '#222222',
    solidRadio: keys?.[2] ?? '100%',
  };
};

export const getBorderStyleFromBgSize = (bgSizeVal: string) => {
  const keys = /^(.+?) (.+?)px,/.exec(bgSizeVal);
  return {
    unitLength: keys?.[1] ?? '20px',
    borderWidth: keys?.[2] ? Number(keys?.[2]) : 2,
  };
};

const borderStyleOptions = [
  {
    value: 'solid',
    style: getBorderStyle('#222222', '100%', '20px'),
    rawStyle: {
      solidRadio: '100%',
      unitLength: '20px',
    },
  },
  {
    value: 'long-dashed',
    style: getBorderStyle('#222222', '70%', '20px'),
    rawStyle: {
      solidRadio: '70%',
      unitLength: '20px',
    },
  },
  {
    value: 'dashed',
    style: getBorderStyle('#222222', '70%', '10px'),
    rawStyle: {
      solidRadio: '70%',
      unitLength: '10px',
    },
  },
  {
    value: 'dotted',
    style: getBorderStyle('#222222', '50%', '6px'),
    rawStyle: {
      solidRadio: '50%',
      unitLength: '6px',
    },
  },
];
const defaultShapeStyle = {
  borderWidth: 2,
  backgroundColor: '#ffffff',
};

export default defineComponent({
  name: 'webpage-builder_text-control-panel',
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
      // currentColor: 'transparent',
      currentBorderColor: '#000000',
      currentBorderWidth: 2,
      currentBorderStyleOption: borderStyleOptions[0],
      isColorChecked: false,
      isBorderStyleChecked: false,
      isColorCheckable: false,
      isBorderStyleCheckable: false,

      shapeStyle: {
        ...defaultShapeStyle,
      },
    });
    const { setCustomStyle, activeElementStyle } = useStyle(activeElementSchema);

    watch(() => store.activeElementFid, async (val) => {
      if (!val) {
        console.log('blur');
        state.isColorChecked = false;
        state.isBorderStyleChecked = false;
        state.isColorCheckable = false;
        state.isBorderStyleCheckable = false;
        return;
      }
      await nextTick();
      if (activeElementStyle.value?.backgroundColor) {
        // state.shapeStyle[key] = activeElementStyle.value?.[key];
        state.shapeStyle.backgroundColor = activeElementStyle.value?.backgroundColor;
        // setCustomStyle({ [key]: state.shapeStyle[key] });
      } else {
        state.shapeStyle.backgroundColor = defaultShapeStyle.backgroundColor;
      }
      state.isColorChecked = !!activeElementStyle.value?.backgroundColor;
      // (['backgroundColor'] as const).forEach((key) => {
      //   if (activeElementStyle.value?.[key]) {
      //     // state.shapeStyle[key] = activeElementStyle.value?.[key];
      //     state.shapeStyle[key] = activeElementStyle.value?.[key].endsWith('px')
      //       ? parseInt(activeElementStyle.value?.[key], 10)
      //       : activeElementStyle.value?.[key];
      //     // setCustomStyle({ [key]: state.shapeStyle[key] });
      //   } else {
      //     state.shapeStyle[key] = defaultShapeStyle[key];
      //   }
      //   if (key === 'backgroundColor') {
      //     state.isColorChecked = !!activeElementStyle.value.backgroundColor;
      //   }
      // });
      if (activeElementStyle.value) {
        const _styleKeys = Object.keys(activeElementStyle.value);
        if (activeElementStyle.value?.backgroundImage && activeElementStyle.value?.backgroundSize) {
          const { color, solidRadio } = getBorderStyleFromBgImage(activeElementStyle.value.backgroundImage);
          const { unitLength, borderWidth } = getBorderStyleFromBgSize(activeElementStyle.value.backgroundSize);
          console.log(color, solidRadio, unitLength, borderWidth);
          const currentOption = borderStyleOptions.find(op => {
            return op.rawStyle.solidRadio === solidRadio && op.rawStyle.unitLength === unitLength;
          });
          state.shapeStyle = { ...state.shapeStyle };
          state.currentBorderStyleOption = currentOption ?? borderStyleOptions[0];
          state.currentBorderColor = color;
          state.currentBorderWidth = borderWidth;
          state.isBorderStyleChecked = true;
        } else {
          state.isBorderStyleChecked = false;
        }
      }
      state.isColorCheckable = true;
      state.isBorderStyleCheckable = true;
    });

    const handleBorderStyleChange = (val: typeof borderStyleOptions[0]) => {
      state.currentBorderStyleOption = val;
      setCustomStyle(getBorderStyle(state.currentBorderColor, val.rawStyle.solidRadio, val.rawStyle.unitLength, state.currentBorderWidth));
    };

    const handleBorderColorAndWidthChange = () => {
      const currentOpition = borderStyleOptions.find(op => {
        return op.value === state.currentBorderStyleOption.value;
      });
      if (!currentOpition) {
        return;
      }
      setCustomStyle(getBorderStyle(
        state.currentBorderColor,
        currentOpition.rawStyle.solidRadio,
        currentOpition.rawStyle.unitLength,
        state.currentBorderWidth,
      ));
    };

    const changeColorCheckable = (val: boolean) => {
      setCustomStyle({
        backgroundColor: val ? state.shapeStyle.backgroundColor : '',
      });
    };
    const changeBorderStyleCheckable = (val: boolean) => {
      if (val) {
        handleBorderColorAndWidthChange();
      } else {
        setCustomStyle({
          backgroundImage: '',
        });
      }
    };
    return {
      ...toRefs(state),
      setCustomStyle,
      // handleStyleChange,
      borderStyleOptions,
      handleBorderStyleChange,
      handleBorderColorAndWidthChange,
      changeColorCheckable,
      changeBorderStyleCheckable,
    };
  },
});
</script>
<style lang="scss">
.webpage-builder_shape-control-panel {
  section + section {
    margin-top: 8px;
    &:before {
      content: "";
      display: block;
      border-bottom: 1px solid #dddddd;
      margin-left: -20px;
      margin-right: -20px;
    }
  }
  .el-checkbox{
    height: 30px;
  }
  .el-color-picker {
    margin-right: 8px;
    margin-left: 12px;
    .el-color-picker__trigger{
      border: none;
      .el-icon{
        display: none;
      }
    }
  }
  .border-style-form-item {
    .border-style-selector {
      width: 90px;
      height: 30px;
      background: #fcfcfc;
      border: 1px solid #dddddd;
      border-radius: 2px 0px 0px 0px;
      padding: 0 12px;
    }
    .border-style-example-line {
      width: 100%;
      height: 2px;
    }
    .el-dropdown-menu {
      padding: 0;
      .el-dropdown-menu__item {
        display: flex;
        align-items: center;
        & + .el-select-dropdown__item {
          border-top: 1px solid #222222;
        }
      }
    }

    .el-input-number {
      width: 46px;
      .el-input-number__decrease,
      .el-input-number__increase {
        width: 18px;
        border: none;
        background: none;
      }
      .el-input__wrapper{
        padding: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;

      }
      .el-input__inner {
        border-left: 0;
        padding: 4px 22px 4px 7px;
      }
    }
  }
}
.border-style-selector-menu {
  .el-dropdown-menu {
    padding: 0;
    width: 90px;
  }
  .el-dropdown-menu__item {
    height: 28px;
    padding: 0 12px;
    & + .el-dropdown-menu__item {
      border-top: 1px solid #222222;
    }
  }
  .el-popper__arrow {
    display: none;
  }
  .border-style-example-line {
    // border-bottom-width: 2px;
    // border-bottom-color: #222222;
    width: 100%;
    height: 2px;
  }
}
</style>
