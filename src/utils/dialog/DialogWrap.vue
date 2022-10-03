<template>
  <!-- <teleport to="body"> -->
  <el-dialog
    title="提示"
    v-model="dialogVisible"
    :append-to-body="true"
    :destroy-on-close="true"
    @open="open"
    @closed="closed"
    v-bind="dialogProps"
    :customClass="customClass"
    ref="elDialogVm"
  >
    <template #default>
      <component :is="is" @cancel="cancel" @confirm="confirm" v-bind="$attrs"></component>
    </template>
    <template v-if="$slots.footer || showBtn" #footer>
      <span v-if="showBtn" class="dialog-footer">
        <el-button v-if="cancelText" @click="cancel()">{{ cancelText }}</el-button>
        <el-button v-if="confirmText" :type="confirmButtonType" @click="confirm()">{{ confirmText }}</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- </teleport> -->
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  computed,
  ref,
  toRefs,
  PropType,
  Component,
} from 'vue';
import { ElDialog, ElButton } from 'element-plus';
import Dialog, { ElDialogProps } from './Dialog';

export default defineComponent({
  name: 'dialog-wrap',
  components: { ElDialog, ElButton },
  props: {
    dialogVm: {
      type: Object as PropType<InstanceType<typeof Dialog>>,
      required: true,
    },
    dialogProps: {
      type: Object as PropType<ElDialogProps>,
      default: () => ({}),
    },
    showBtn: {
      type: Boolean,
      default: false,
    },
    cancelText: {
      type: String,
      default: '取消',
    },
    confirmButtonType: {
      type: String,
      default: 'primary',
    },
    confirmText: {
      type: String,
      default: '确定',
    },
    is: {
      type: Object as PropType<Component>,
      required: true,
    },
    noTitle: {
      type: Boolean,
      default: false,
    },

  },
  inheritAttrs: false,
  setup(props, { emit }) {
    const elDialogVm = ref<typeof ElDialog>();
    const state = reactive({
      dialogVisible: false,
      isCancelOrConfirm: false, // 用于判断是从哪里触发的关闭
    });
    const customClass = computed(() => {
      const noTitleClass = props.noTitle ? 'no-title' : '';
      const _customClass = props.dialogProps?.customClass ? props.dialogProps.customClass : '';
      return `${noTitleClass} ${_customClass}`;
    });
    const cancel = async (...args: any[]) => {
      state.dialogVisible = false;
      state.isCancelOrConfirm = true;
      props.dialogVm.onCancel(...args);
    };

    const confirm = async (...args: any[]) => {
      state.dialogVisible = false;
      state.isCancelOrConfirm = true;
      props.dialogVm.onConfirm(...args);
    };

    const open = () => {
      props.dialogVm.onOpen({ elDialogVm: elDialogVm.value! });
    };

    const closed = () => {
      const payload: { isClose?: boolean, elDialogVm: typeof ElDialog } = {
        elDialogVm: elDialogVm.value!,
      };
      if (!state.isCancelOrConfirm) {
        // 非取消确认按钮触发的关闭
        payload.isClose = true;
      }
      props.dialogVm.onClosed(payload);
    };


    return {
      ...toRefs(state),
      customClass,
      elDialogVm,
      cancel,
      confirm,
      // close,
      open,
      closed,
    };
  },
});
</script>
<style lang="scss">
.no-title {
  .el-dialog__header {
    padding: 0;
    .el-dialog__title {
      display: none;
    }
  }
}
.el-dialog.no-padding {
  .el-dialog__body {
    padding: 0 !important;
  }
}

</style>
