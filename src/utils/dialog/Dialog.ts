/* eslint-disable class-methods-use-this */
import Vue, {
  createApp, h, ComponentOptionsMixin, defineComponent, reactive, ref, AllowedComponentProps, ComponentCustomProps, VNodeProps,
} from 'vue';
import { ElDialog } from 'element-plus';

import deepmerge from 'deepmerge';
import { extendRootApp } from '@/main';
import DialogWrap from './DialogWrap.vue';
import { dialogs } from './index';


type DialogVm = InstanceType<typeof ElDialog> | null;
type DialogWrapVm = InstanceType<typeof DialogWrap> | null;
type PublicProps = VNodeProps & AllowedComponentProps & ComponentCustomProps;
export type ElDialogProps = Partial<InstanceType<typeof ElDialog>['$props']>;
interface Data {
  [key: string]: unknown
}

export interface ComponentOption {
  is: ComponentOptionsMixin,
  props?: PublicProps & Data,
  showBtn?: boolean,
  cancelText?: string,
  confirmText?: string,
  confirmButtonType?: string,
  slots?: unknown
}

export type DialogOption = {
  props?: ElDialogProps
  noTitle?: boolean,
};

class Dialog {
  el: HTMLElement | null = null;
  dialogWrapVm: DialogWrapVm | null = null;
  elDialogVm: typeof ElDialog | null = null;
  resolve: ((value: any | PromiseLike<any>) => void) | null = null;
  reject: ((reason?: unknown) => void) | null = null;
  open<T = unknown>(componentOption: ComponentOption, dialogOption: DialogOption = {}): Promise<T> {
    const {
      is, props, showBtn, cancelText, confirmText, confirmButtonType, slots,
    } = componentOption;
    const { dialogify } = is;
    const _dialogify = typeof dialogify === 'function' ? dialogify() : dialogify;
    const { props: dialogProps, noTitle } = deepmerge(_dialogify || {}, dialogOption);
    const DialogWrapApp = createApp(DialogWrap, {
      ...props, dialogVm: this, dialogProps, showBtn, cancelText, confirmText, confirmButtonType, is, slots, noTitle,
    });
    extendRootApp(DialogWrapApp);
    this.el = document.createElement('div');
    this.dialogWrapVm = DialogWrapApp.mount(this.el) as DialogWrapVm;
    const { dialogWrapVm } = this;
    if (!dialogWrapVm) return Promise.reject(new Error('dialogWrapVm is undefined'));
    dialogWrapVm.dialogVisible = true;
    return new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  onConfirm(...arg: unknown[]): void {
    this.resolve?.(arg[0]); // resolve只支持一个参数
  }
  onCancel(...arg: unknown[]): void {
    this.reject?.(arg[0] || new Error('abort'));// reject只支持一个参数
  }
  onOpen({ elDialogVm }: { elDialogVm: typeof ElDialog }): void {
    this.elDialogVm = elDialogVm;
  }
  onClosed({ elDialogVm, isClose }: { elDialogVm: typeof ElDialog, isClose?: boolean }): void {
    // close归在reject里面
    const closeError = new Error('abort');
    // @ts-ignore
    if (isClose) closeError.isClose = isClose;
    this.reject?.(closeError);

    dialogs.pop();
    const elOverLayEl: HTMLElement = elDialogVm?.dialogRef.parentElement;
    if (elOverLayEl && elOverLayEl.parentElement) document.body.removeChild(elOverLayEl);
  }
}
export default Dialog;

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    dialogify?: DialogOption | (() => DialogOption)
  }
}
