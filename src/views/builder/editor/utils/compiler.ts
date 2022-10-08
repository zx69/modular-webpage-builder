import { objUtil } from '@/utils/objUtil';
import { ComponentOptionsMixin, h, VNode } from 'vue';
// import hash from 'object-hash';
import classnames from 'classnames';
import {
  CommonCompProp, PreviewMode, RenderStatus, SchemaType,
} from '../typings';
import store from '../store';
import { moduleComponentsMap } from '../../modules';
import { getModuleData } from './helper';

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

// 类型保护
function isModule(schema: CommonCompProp): schema is CommonCompProp<'module'> {
  return schema.type === 'module';
}
function isComponent(schema: CommonCompProp): schema is CommonCompProp<'component'> {
  return schema.type === 'component';
}
function isBlock(schema: CommonCompProp): schema is CommonCompProp<'block'> {
  return schema.type === 'block';
}

// 解析字符串模板表达式
export const parseTplExpress = (data: Obj, express: string) => {
  if (!data || !express) {
    return '';
  }
  const avaliableExpress = String(express).replace(/\$\{(.*?)\}/, (_, match) => {
    return getModuleData(data, match) as string;
  });
  return avaliableExpress;
};


// 解析style属性中的变量;
const parseStyleValue = (styleObj: Obj, data: Obj) => {
  const _style: Obj = {};
  Object.entries(styleObj).forEach(([key, val]) => {
    _style[key] = parseTplExpress(data, val);
  });
  return _style;
};

// 规范化nodeSchema策略集合（策略模式）
const normalizeStrategies = {
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
      children: undefined,
    };
  },
};

// 合并attrs
const mergeAttrs = (baseAttrs: Obj, appendAttrs: Obj) => {
  // console.log(baseAttrs, appendAttrs);
  Object.entries(appendAttrs).forEach(([key, val]) => {
    if (key === 'class') {
      baseAttrs[key] = classnames(baseAttrs[key], appendAttrs[key]);
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

let globalIdCount = 1; // 用于生成fid的计算器

const comilpeSchema = (
  nodeSchema: CommonCompProp<SchemaType>, // schema
  renderData?: Obj, // module的data
  parentAttrs?: Obj | null, // 父节点传入子节点的属性
  config: { mode: PreviewMode, status: RenderStatus } = { mode: 'pc', status: 'preview' }, // 配置选项
): VNode => {
  if (typeof nodeSchema !== 'object') {
    throw Error('render json schema must be a object!');
  }

  // 有sid表示是模块最外层的renderer, 此时将idcount重置为1
  if (nodeSchema.sid) {
    globalIdCount = 1;
  }
  // 根据platform合并样式
  nodeSchema = mobileSchemaOverwrite(nodeSchema, config.mode);

  // 没有找到规范策略时则设type为最基本类型block
  if (!Object.keys(normalizeStrategies).includes(nodeSchema.type)) {
    nodeSchema.type = 'block';
  }
  // 规范化策略
  const normalizeStrategy = normalizeStrategies[nodeSchema.type];
  // schema规范化
  const vnode = normalizeStrategy(nodeSchema, config.status);

  // 模块汇总的data
  const moduleData = isModule(nodeSchema) ? nodeSchema.data : renderData;
  const attrs = objUtil.omit(vnode, ['tagName', 'component', 'children']);


  const autoMergedClassName = [`mc-${nodeSchema.type}`];
  // 对于模块, 将当前状态也加入类名中
  if (nodeSchema.type === 'module') {
    if (nodeSchema.sid) {
      store.sectionsDataMap[nodeSchema.sid!] = nodeSchema.data || {};
    }
    autoMergedClassName.push(`platform-${store.currentPlatform}`);
  }

  // 合并样式
  if (nodeSchema.customStyle) {
    if (!nodeSchema.style) {
      nodeSchema.style = {};
    }
    Object.assign(nodeSchema.style, nodeSchema.customStyle);
  }

  // fid：可编辑元素都增加该id,用于识别当前选中元素
  let fid: string | undefined;
  const parentFid = nodeSchema.sid ?? parentAttrs?.parentFid;
  // let componentNode: ComponentOptionsMixin | undefined;
  if (isComponent(nodeSchema) && typeof nodeSchema.component === 'string') {
    nodeSchema.operation = moduleComponentsMap[nodeSchema.component].operation ?? false;
  }

  if (nodeSchema.operation) {
    // 暂定fid生成方案.需求: 需要跟元素绑定,避免每次修改样式都生成新的fid,导致频繁mutation
    fid = `${parentFid ? `${parentFid}-` : ''}${globalIdCount++}`;
    store.flattenShemaNodeMap[fid] = nodeSchema;
  }

  mergeAttrs(attrs, {
    class: autoMergedClassName,
    fid,
  });

  // 解析style中可能包含的变量
  if (attrs.style && moduleData) {
    attrs.style = parseStyleValue(attrs.style, moduleData);
  }

  // 子元素为组件时
  if (isComponent(nodeSchema)) {
    if (typeof nodeSchema.component === 'function') {
      return nodeSchema.component(moduleData || {}, attrs);
    }
    if (typeof nodeSchema.component === 'string' && moduleComponentsMap[nodeSchema.component]) {
      return h(moduleComponentsMap[nodeSchema.component], {
        ...attrs,
        data: moduleData || {},
        // @ts-ignore
        ...vnode.props,
      });
    }
  }

  const children = vnode.children ?? [];
  // 子元素为一般组件时
  return h(
    vnode.tagName,
    { ...attrs },

    typeof children === 'string'
      ? children
      : (children || []).map((_c => comilpeSchema(
        _c,
        moduleData,
        { ...parentAttrs, parentFid: fid ?? parentFid },
        config,
      ))),
  );
};

export { comilpeSchema };
export default comilpeSchema;
