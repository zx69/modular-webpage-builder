import {
  ComponentInternalInstance, VNode,
} from 'vue';


export type PanelConfig = {
  label: string, value: string, icon: string, component: ComponentInternalInstance,
  panelType?: string,
};

export type CommonCompProp = {
  type: string,
  class?: string,
  index: number, // 在模块列表中的排列序号
  style?: {
    [key: string]: string,
  },
  customStyle?: {
    [key: string]: string,
  },
  children?: string | CommonCompProp[],
  mobile?: CommonCompProp,
  weixin?: CommonCompProp & { redirectUrl?: string },
  operation?: string | false,
  sid?: string,
  mid?: string,
};


export type CompModule = CommonCompProp & {
  mid: string,
  // sid?: string,
  type: 'module',
  aspectRadio?: string,
  data: {
    // status: 'edit' | 'preview',
    [key: string]: unknown,
  },
};

export type CompBlock = CommonCompProp & {
  type: 'block',
};

// export type CompTpl = CommonCompProp & {
//   type: 'tpl',
//   tpl: string,
// };

export type CompComponent = CommonCompProp & {
  component: string | ((data: Obj, attrs: Obj) => VNode),
  props: Obj,
};


export type CombindCompProp = CompModule | CompBlock | CompComponent;

export type PreviewMode = 'pc' | 'mobile'; // 预览模式切换

export type RenderStatus = 'edit' | 'readonly' | 'preview'; // 模块渲染状态

export type ControlAction = 'up' | 'down' | 'reset' | 'copy' | 'remove';

export type FrameClientRect = {
  width: string,
  height: string,
  top: string,
  left: string,
};


declare module '@vue/runtime-core' {
  interface ComponentCustomOptions {
    operation?: string;
  }
}
