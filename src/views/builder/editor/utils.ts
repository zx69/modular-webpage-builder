// @ts-ignore
import {
  ComponentOptionsMixin, h, reactive, VNode,
} from 'vue';
import classNames from 'classnames';
import { getIsMobile } from '@/utils/system';
import { objUtil } from '@/utils/objUtil';
import keySerializer from '@/utils/key-serializer';
import { moduleComponentsMap } from '../modules';
import {
  CommonCompProp, CompBlock, CompComponent, CompModule, PreviewMode, RenderStatus, SchemaType,
} from './typings';
import store from './store';


export const isMobile = getIsMobile();

/**
 * 解析字符串模板表达式
 *
 * @param {Obj} data
 * @param {string} express
 * @return {*}
 */
// export const parseTplExpress = (data: Obj, express: string) => {
//   if (!data || !express) {
//     return '';
//   }
//   const avaliableExpress = String(express).replace(/\$\{(.*?)\}/, (_, match) => {
//     console.log('in replace: ', _, match);
//     return keySerializer.get(data, match);
//   });
//   return avaliableExpress;
// };

export const getModuleData = (data: Obj, express: string) => {
  // eslint-disable-next-line import/no-named-as-default-member
  return keySerializer.get(data, express);
};

export const saveModuleData = (data: Obj, express: string, val: unknown) => {
  // eslint-disable-next-line import/no-named-as-default-member
  keySerializer.set(data, express, val);
  // 初始化时进行的赋值操作不改变isSaved的值
  // if (store.isInit) {
  //   setSaveState(false);
  // }
};

// 捕获事件并重新抛出.按设计,组件类型应该作为一个整体接受事件, 即组件内部元素不可单独点击等.所以对于type=component类型,
// 在组件外层捕获响应事件, 并重新抛出,这样外面接受的的ev.target就是组件外层整体元素了
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


// 解析style属性中的变量
// const parseStyleValue = (styleObj: Obj, data: Obj) => {
//   const _style = {};
//   Object.entries(styleObj).forEach(([key, val]) => {
//     _style[key] = parseTplExpress(data, val);
//   });
//   return _style;
// };

/**
 * 对于移动端/移动预览/微信, schema取mobile/weixin项定义值覆盖对应外层值
 *
 * @param {CommonCompProp} nodeSchema
 * @param {PreviewMode} [previewMode] 预览模式, 用于强行指定mobile模式
 */
const mobileSchemaOverwrite = (nodeSchema: CommonCompProp, previewMode?: PreviewMode) => {
  if (!nodeSchema.mobile && !nodeSchema.weixin) {
    return nodeSchema;
  }
  // 在移动端预览模式下, 将nodeSchema拷贝一份再合并, 避免合并后切回pc模式时nodeSchema已被修改
  let _nodeSchema = previewMode === 'mobile' ? JSON.parse(JSON.stringify(nodeSchema)) : nodeSchema;
  if (nodeSchema.mobile && (['h5', 'mp', 'app'].includes(store.currentPlatform) || previewMode === 'mobile')) {
    _nodeSchema = Object.assign(_nodeSchema, nodeSchema.mobile);
    delete _nodeSchema.mobile;
    // 在小程序中时(小程序包含了mobile模式)
    // ua包含miniProgram用于判断小程序web-view环境
    if (nodeSchema.weixin && store.currentPlatform === 'mp') {
      _nodeSchema = Object.assign(_nodeSchema, nodeSchema.weixin);
      delete _nodeSchema.weixin;
    }
  }
  return _nodeSchema;
};
