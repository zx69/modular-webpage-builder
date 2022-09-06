import { objUtil } from '@/utils/objUtil';
import { ComponentOptionsMixin, h, VNode } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import {
  CommonCompProp, PreviewMode, RenderStatus, SchemaType,
} from '../typings';
import store from '../store';
import { moduleComponentsMap } from '../../modules';

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

function isModule(schema: CommonCompProp): schema is CommonCompProp<'module'> {
  return schema.type === 'module';
}
function isComponent(schema: CommonCompProp): schema is CommonCompProp<'component'> {
  return schema.type === 'component';
}
function isBlock(schema: CommonCompProp): schema is CommonCompProp<'block'> {
  return schema.type === 'block';
}

// 规范化nodeSchema策略集合
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

const comilpeSchema = (
  nodeSchema: CommonCompProp<SchemaType>,
  renderData?: Obj,
  config: { mode: PreviewMode, status: RenderStatus } = { mode: 'pc', status: 'preview' },
): VNode => {
  if (typeof nodeSchema !== 'object') {
    throw Error('render json schema must be a object!');
  }

  nodeSchema = mobileSchemaOverwrite(nodeSchema, config.mode);

  // 没有找到规范策略时则设type为最基本类型block
  if (!Object.keys(normalizeStrategies).includes(nodeSchema.type)) {
    nodeSchema.type = 'block';
  }
  const normalizeStrategy = normalizeStrategies[nodeSchema.type];
  const vnode = normalizeStrategy(nodeSchema, config.status);

  // 模块汇总的data
  const moduleData = isModule(nodeSchema) ? nodeSchema.data : renderData;
  const attrs = objUtil.omit(vnode, ['tagName', 'component', 'children']);

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
    } else {
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


  // 子元素为组件时
  if (isComponent(nodeSchema)) {
    return h(componentNode!);
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
        config,
      ))),
  );
};

export { comilpeSchema };
export default comilpeSchema;
