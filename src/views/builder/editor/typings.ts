import {
  ComponentPublicInstance, VNode,
} from 'vue';
import { moduleComponentsMap } from '../modules';


export type PanelConfig = {
  label: string, value: string, icon: string, component: ComponentPublicInstance,
  panelType?: string,
};

export type SchemaType = 'module' | 'block' | 'component';
export type CommonCompProp<T extends SchemaType = SchemaType> = {
  index: T extends 'module' ? number : undefined, // 在模块列表中的排列序号
  type: T,
  class?: string,
  style?: {
    [key: string]: string,
  },
  customStyle?: {
    [key: string]: string,
  },
  mobile?: CommonCompProp<T>,
  weixin?: CommonCompProp<T>,
  operation?: string | false,
  sid: T extends 'module' ? string : undefined,
  mid: T extends 'module' ? string : undefined,
  aspectRadio: T extends 'module' ? string : undefined,
  children: T extends 'component' ? undefined : (string | (CompBlock | CompComponent)[]),
  data: T extends 'module' ? {
    // status: 'edit' | 'preview',
    [key: string]: unknown,
  } : undefined,
  component: T extends 'component' ? ((keyof typeof moduleComponentsMap) | ((data: Obj, attrs: Obj) => VNode)) : undefined,
  props: T extends 'component' ? Obj : undefined,
};

export type CompModule = CommonCompProp<'module'>;
// export type CompModule = CommonCompProp<'module'> & {
//   index: number, // 在模块列表中的排列序号
//   type: 'module',
//   mid: string,
//   // sid?: string,
//   aspectRadio?: string,
//   children?: string | (CompBlock | CompComponent)[]
//   data: {
//     // status: 'edit' | 'preview',
//     [key: string]: unknown,
//   },
// };
export type CompBlock = CommonCompProp<'block'>;
// export type CompBlock = CommonCompProp<'block'> & {
//   type: 'block',
// };
export type CompComponent = CommonCompProp<'component'>;
// export type CompComponent = CommonCompProp<'component'> & {
//   component: string | ((data: Obj, attrs: Obj) => VNode),
//   props: Obj,
// };


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
