import { App, Plugin } from 'vue';
import Dialog, { ComponentOption, DialogOption } from './Dialog';
import { confirm as _confirm } from './confirm';

export const dialogs: Dialog[] = [];

export type Open = InstanceType<typeof Dialog>['open'];


export const getCurrentDialog = () => {
  return dialogs[dialogs.length - 1];
};

export const clearDialogs = async () => {
  await Promise.all(dialogs.map(dialog => dialog?.dialogWrapVm?.cancel()));
};

const dialogHepler = {
  open<T>(...args: Parameters<Open>): Promise<T> {
    const dialogVm = new Dialog();
    dialogs.push(dialogVm);
    return dialogVm.open<T>(...args);
  },
  confirm: _confirm,
  getCurrentDialog,
  install(app: App) {
    app.config.globalProperties.$dialog = dialogHepler.open;
  },
};


export const dialog = dialogHepler.open;
export const { confirm } = dialogHepler;


export default dialogHepler;

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $dialog: typeof dialogHepler.open
  }
}
