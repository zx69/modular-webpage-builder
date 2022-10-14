import {
  ComponentPublicInstance, VNode,
} from 'vue';
import { moduleComponentsMap } from '../modules';


export type PanelConfig = {
  label: string, value: string, icon: string, component: ComponentPublicInstance,
  panelType?: string,
};

// 元素节点类型
export type SchemaType = 'module' | 'block' | 'component';
// 通用的元素节点定义
export type CommonCompProp<T extends SchemaType = SchemaType> = {
  // 元素类型定义
  type: T,
  // 模块数据，仅type=module
  data: T extends 'module' ? {
    [key: string]: unknown,
  } : undefined,
  // 元素类型，仅type=component
  component: T extends 'component' ? ((keyof typeof moduleComponentsMap) | ((data: Obj, attrs: Obj) => VNode)) : undefined,
  // 元素节点的props，仅type=component
  props: T extends 'component' ? Obj : undefined,
  class?: string,
  style?: {
    [key: string]: string,
  },
  // 用户自定义的style, 只在编辑时使用, 预览时合并入style再渲染
  customStyle?: {
    [key: string]: string,
  },
  // H5端响应式定义，可包含CommonCompProp的任一属性，在H5端时将覆盖相应的同名属性
  mobile?: CommonCompProp<T>,
  // 微信端响应式定义，可包含CommonCompProp的任一属性，在微信端时将覆盖相应的同名属性
  weixin?: CommonCompProp<T>,
  // 当前元素可激活的操作面板
  operation?: string | false,
  // 在模块列表中的排列序号，仅type=module
  index: T extends 'module' ? number : undefined,
  // section ID，仅type=module
  sid: T extends 'module' ? string : undefined,
  // module ID，仅type=module
  mid: T extends 'module' ? string : undefined,
  // 模块高宽比，仅type=module
  aspectRadio: T extends 'module' ? string : undefined,
  // 子元素，仅type!=component
  children: T extends 'component' ? undefined : (string | (CompBlock | CompComponent)[]),
};

export type CompModule = CommonCompProp<'module'>;

export type CompBlock = CommonCompProp<'block'>;

export type CompComponent = CommonCompProp<'component'>;


export type PreviewMode = 'pc' | 'mobile'; // 预览模式切换

export type RenderStatus = 'edit' | 'readonly' | 'preview'; // 模块渲染状态

export type ControlAction = 'up' | 'down' | 'reset' | 'copy' | 'remove';

export type FrameClientRect = {
  width: number,
  height: number,
  top: number | string,
  left: number | string,
};

declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    operation?: string;
  }
}


export type ProductItem = {
  id: string,
  name: string,
  price: number,
  applicableSeason: string,
  category: string,
  supplierLogo: string,
  supplierName: string,
  imgUrl: string,
};

export type vueSortableEvent = {
  [evType: string]: {
    element: any,
    newIndex: number,
    oldIndex: number,
  },
};
