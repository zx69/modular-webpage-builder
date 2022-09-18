<template>
  <!-- controlbar是不可选中的, 在这里stopPropagation阻止其可选中 -->
  <div class="material-brochure_module-control-bar flex-column" @mouseover.stop @mouseout.stop>
    <template v-for="btn in moduleControlBtnsConfig" :key="btn.action">
      <el-tooltip
        effect="light"
        :content="btn.title"
        placement="right"
        :visible-arrow="false"
        popper-class="block-radio-tooltip"
        :offset="2"
      >
        <el-button :disabled="btn.disabled" @click.stop="handleMondelControlAction(btn.action)">
          <i :class="`icon ${btn.icon}`"></i>
        </el-button>
      </el-tooltip>
    </template>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, reactive, computed, ref, toRefs, PropType,
} from 'vue';
import { CompModule, ControlAction } from '../typings';
import store, { modules } from '../store';

export default defineComponent({
  name: 'material-brochure_module-control-box',
  components: {},
  props: {
    moduleSchema: {
      type: Object as PropType<CompModule>,
      required: true,
    },
    isFirst: {
      type: Boolean,
    },
    isLast: {
      type: Boolean,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const moduleControlBtnsConfig = computed(() => [
      {
        title: '上移', icon: 'i-r-wangshang-16', action: 'up', disabled: props.index === 0,
      },
      {
        title: '下移', icon: 'i-r-wangxia-16', action: 'down', disabled: props.index === store.renderSchemaList.length - 1,
      },
      { title: '还原', icon: 'i-r-qingkong-16', action: 'reset' },
      { title: '复制', icon: 'i-r-fuzhi-16', action: 'copy' },
      { title: '删除', icon: 'i-r-shanchu-161', action: 'remove' },
    ]);

    const handleMondelControlAction = (action: ControlAction) => {
      const { moduleSchema } = props;
      if (!moduleSchema.sid || !action) {
        return;
      }
      const sectionIndex = store.renderSchemaList.findIndex(schema => schema.sid === moduleSchema.sid);
      switch (action) {
        case 'up': {
          const _section = store.renderSchemaList.splice(sectionIndex, 1);
          store.renderSchemaList.splice(sectionIndex - 1, 0, _section[0]);
          break;
        }
        case 'down': {
          const _section = store.renderSchemaList.splice(sectionIndex, 1);
          store.renderSchemaList.splice(sectionIndex + 1, 0, _section[0]);
          break;
        }
        case 'reset': {
          const _originModel = modules.value.find(module => module.mid === moduleSchema.mid);
          const _copiedSchema = JSON.parse(JSON.stringify(_originModel));
          _copiedSchema.sid = store.renderSchemaList[sectionIndex].sid;
          store.renderSchemaList[sectionIndex] = _copiedSchema;
          break;
        }
        case 'copy': {
          const _copiedSchema = JSON.parse(JSON.stringify(store.renderSchemaList[sectionIndex]));
          const _originModel = modules.value.find(module => module.mid === moduleSchema.mid)!;
          Object.keys(_copiedSchema.data).forEach(_key => {
            if (_key.includes('materialsId')) {
              _copiedSchema.data[_key] = _originModel.data[_key];
            }
          });
          _copiedSchema.sid = `section${store.sectionIdCount++}`;
          store.renderSchemaList.splice(sectionIndex + 1, 0, _copiedSchema);
          break;
        }
        case 'remove': {
          store.renderSchemaList.splice(sectionIndex, 1);
          break;
        }
        default:
          // eslint-disable-next-line no-case-declarations
          const exhaustiveCheck: never = action;
          break;
      }
      // recountActiveFrameClientRect();
      // setSaveState(false);
    };
    return {
      moduleControlBtnsConfig,
      // emitModuleControlEvent,
      handleMondelControlAction,
    };
  },
});
</script>
<style lang="scss">
// @import 'url'
.material-brochure_module-control-bar {
  .el-button {
    width: 36px;
    height: 36px;
    border: 0;
    padding: 0;
    border-radius: 0;
    & + .el-button {
      margin-left: 0;
    }
  }
}
</style>
