import { defineComponent, createApp, VNode } from 'vue';
import deepmerge from 'deepmerge';
import Dialog, { ComponentOption, DialogOption } from './Dialog';
import { dialogs, Open } from '.';
import './confirm.scss';

const ConfirmDefault = defineComponent({
  name: 'confirm-default',
  props: {
    title: {
      type: String,
    },
    message: {
      type: String,
    },
  },
  setup(props, { emit }) {
    return () => (
      <div class="sd-confirm">
        {props.title ? <h3 class="sd-confirm-title">{props.title}</h3> : null}
        {props.message ? <p class="sd-confirm-message">{props.message}</p> : null}
      </div>
    );
  },
});

type ConfirmOption = {
  title?: string,
  message?: string | VNode,
  confirmText?: string,
  cancelText?: string,
  showBtn?: boolean,
  confirmButtonType?: string
};
export const confirm = (
  {
    title, message, confirmText, cancelText, showBtn = true, confirmButtonType,
  }: ConfirmOption,
  dialogOption: DialogOption = {},
): ReturnType<Open> => {
  const confirmCompOption: ComponentOption = {
    is: ConfirmDefault,
    props: {
      title,
      message,
    },
    showBtn,
    confirmText,
    cancelText,
    confirmButtonType,
  };
  const confirmDialogOption: DialogOption = deepmerge({
    noTitle: true,
    props: {
      showClose: false,
      width: '440px',
      customClass: 'sd-confirm-dialog',
    },
  }, dialogOption);
  const dialogVm = new Dialog();
  dialogs.push(dialogVm);
  return dialogVm.open(confirmCompOption, confirmDialogOption);
};

export default confirm;
