// @ts-ignore
import {
  ComponentOptionsMixin, h, reactive, VNode,
} from 'vue';
import classNames from 'classnames';
import { getIsMobile } from '@/utils/system';
import { objUtil } from '@/utils/objUtil';
import { v4 as uuidv4 } from 'uuid';
import keySerializer from '@/utils/key-serializer';
import { moduleComponentsMap } from '../modules';
import {
  CommonCompProp, CompBlock, CompComponent, CompModule, PreviewMode, RenderStatus, SchemaType,
} from './typings';
import store from './store';

let globalIdCount = 1;

export const createRandomString = () => {
  const upEnArr = [...new Array(26)].map((_, i) => 65 + i);
  const downEnArr = [...new Array(26)].map((_, i) => 97 + i);
  const numArr = [...new Array(10)].map((_, i) => 48 + i);
  const arr = [...upEnArr, ...downEnArr, ...numArr];
  const randomIndexArr = [...new Array(4)].map(() => String.fromCharCode(arr[Math.round(Math.random() * (arr.length - 1))]));
  return randomIndexArr.join('');
};

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

function isModule(schema: CommonCompProp): schema is CompModule {
  return schema.type !== 'module';
}
function isComponent(schema: CommonCompProp): schema is CommonCompProp<'component'> {
  return schema.type !== 'component';
}
function isBlock(schema: CommonCompProp): schema is CompBlock {
  return schema.type !== 'block';
}
// 规范化nodeSchema策略集合
const normalizeNodeSchemaStrategies: {
  module: (nodeSchema: CommonCompProp) =>
    Partial<Pick<CommonCompProp<'module'>, 'style' | 'class' | 'children'>>
    & { tagName: string },
  block: (nodeSchema: CommonCompProp) =>
    Partial<Pick<CommonCompProp<'block'>, 'style' | 'class' | 'children'>>
    & { tagName: string },
  component: (nodeSchema: CommonCompProp, currentStatus: RenderStatus) =>
    Partial<Pick<CommonCompProp<'component'>, 'style' | 'class' | 'children' | 'component' | 'props'>>
    & { tagName: string, status?: RenderStatus },
} = {
  module(nodeSchema: CommonCompProp) {
    return {
      tagName: 'div',
      ...objUtil.pick(nodeSchema, ['style', 'class']),
      children: nodeSchema.children || [],
    };
  },
  block(nodeSchema: CommonCompProp) {
    return {
      tagName: 'div',
      ...objUtil.pick(nodeSchema, ['style', 'class']),
      children: nodeSchema.children || [],
    };
  },
  component(nodeSchema: CommonCompProp, currentStatus: RenderStatus) {
    return {
      tagName: '',
      ...objUtil.pick(nodeSchema, ['style', 'class', 'props']),
      component: nodeSchema.component,
      status: currentStatus,
    };
  },
};

/**
 * 合并attrs, 目前主要用于合并父组件传入的className(如type=flex时)
 *
 * @param {*} baseAttrs
 * @param {*} appendAttrs
 */
const mergeAttrs = (baseAttrs: Obj, appendAttrs: Obj) => {
  // console.log(baseAttrs, appendAttrs);
  Object.entries(appendAttrs).forEach(([key, val]) => {
    if (key === 'class') {
      baseAttrs[key] = classNames(baseAttrs[key], appendAttrs[key]);
      return;
    }
    if (typeof baseAttrs[key] === 'undefined') {
      baseAttrs[key] = val;
      return;
    }
    if (typeof baseAttrs[key] === 'string' && typeof val === 'string') {
      baseAttrs[key] = val;
      return;
    }
    if (typeof baseAttrs[key] === 'object' && typeof val === 'object') {
      baseAttrs = { ...baseAttrs, ...appendAttrs };
    }
  });
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


/**
 * 解析jsonSchema为vnode
 */
export const compileSchemaToElement = (
  nodeSchema: CommonCompProp<SchemaType>,
  renderData?: Obj,
  appendAttrs?: Obj | null,
  config: { mode: PreviewMode, status: RenderStatus } = { mode: 'pc', status: 'preview' },
): VNode => {
  if (typeof nodeSchema !== 'object') {
    throw Error('render json schema must be a object!');
  }

  // 有sid表示是最外层的renderer, 此时将idcount重置为1
  if (nodeSchema.sid) {
    globalIdCount = 1;
  }

  nodeSchema = mobileSchemaOverwrite(nodeSchema, config.mode);

  // 没有找到规范策略时则设type为最基本类型block
  if (!Object.keys(normalizeNodeSchemaStrategies).includes(nodeSchema.type)) {
    nodeSchema.type = 'block';
  }
  const normalizeNodeSchemaStrategy = normalizeNodeSchemaStrategies[nodeSchema.type];
  const vnode = normalizeNodeSchemaStrategy(nodeSchema, config.status);

  // 模块汇总的data
  const moduleData = isModule(nodeSchema) ? nodeSchema.data : renderData;

  // const {
  //   tagName, component, children, ...attrs
  // } = vnode;
  const attrs = objUtil.omit(vnode, ['tagName', 'component', 'children']);
  const autoMergedClassName = [`mc-${nodeSchema.type}`];
  // 对于模块, 将当前状态也加入类名中
  if (isModule(nodeSchema)) {
    store.sectionsDataMap[nodeSchema.sid] = nodeSchema.data;
    autoMergedClassName.push(`platform-${store.currentPlatform}`);
  }

  if (nodeSchema.customStyle) {
    if (!nodeSchema.style) {
      nodeSchema.style = {};
    }
    Object.assign(nodeSchema.style, nodeSchema.customStyle);
  }


  let fid: string | undefined;
  let componentNode: ComponentOptionsMixin | undefined;
  if (isComponent(nodeSchema)) {
    if (typeof nodeSchema.component === 'function') {
      // @ts-ignore
      componentNode = component(moduleData || {}, attrs);
      // @ts-ignore
    } else if (typeof component === 'string' && moduleComponentsMap[nodeSchema.component]) {
      componentNode = h(moduleComponentsMap[nodeSchema.component], {
        ...attrs,
        data: moduleData || {},
        // @ts-ignore
        ...vnode.props,
      });
    }
    nodeSchema.operation = componentNode?.operation ?? false;
  }
  if (nodeSchema.operation) {
    fid = uuidv4();
    store.flattenShemaNodeMap[fid] = nodeSchema;
  }

  // 如果有附加attrs时, 需合并到当前attrs(通常来自父组件)
  mergeAttrs(attrs, {
    ...appendAttrs, class: autoMergedClassName, fid,
  });

  // 子元素为组件时
  if ('component' in vnode && componentNode) {
    return h(componentNode);
  }

  // 子元素为一般组件时
  return h(
    vnode.tagName,
    { ...attrs },
    typeof vnode.children === 'string'
      ? vnode.children
      : (vnode.children || []).map((_c => compileSchemaToElement(
        _c,
        moduleData,
        config,
      ))),
  );
};

export default compileSchemaToElement;
