import keySerializer from '@/utils/key-serializer';
import { getIsMobile } from '@/utils/system';


export const isMobile = getIsMobile();

export const getModuleData = (data: Obj, express: string) => {
  // eslint-disable-next-line import/no-named-as-default-member
  return keySerializer.get(data, express);
};

export const saveModuleData = (data: Obj, express: string, val: unknown) => {
  // eslint-disable-next-line import/no-named-as-default-member
  keySerializer.set(data, express, val);
};

// 捕获事件并重新抛出.按设计,组件类型应该作为一个整体接受事件, 即组件内部元素不可单独点击等.
// 所以对于type=component类型,在组件外层捕获响应事件, 并重新抛出,这样外面接受的的ev.target就是组件外层整体元素了
export const getEventCatchAndThrowMap = (eventNames: string | string[]) => {
  const _eventNameList = Array.isArray(eventNames) ? eventNames : [eventNames];
  return Object.fromEntries(_eventNameList.map(evName => {
    return [
      evName,
      (ev: MouseEvent) => {
        if (ev.target !== ev.currentTarget) {
          ev.stopPropagation();
          const _ev = new Event(evName, { bubbles: true });
          ev.currentTarget?.dispatchEvent(_ev);
        }
      },
    ];
  }));
};
