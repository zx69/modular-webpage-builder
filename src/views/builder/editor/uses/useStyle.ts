import {
  Ref, ComputedRef, reactive, computed,
} from 'vue';
import { CommonCompProp } from '../typings';
import { activeElementSchema as activeElementSchemaType } from '../store';

/* eslint-disable import/prefer-default-export */
type GetIsStyleValueExist = {
  (styleKey: string, targetVal: string): boolean;
  (styleObj: Obj): boolean;
};

export default (activeElementSchema: typeof activeElementSchemaType) => {
  const activeElementStyle = computed(() => {
    return activeElementSchema.value ? { ...activeElementSchema.value?.style, ...activeElementSchema.value?.customStyle } : null;
  });
  /**
 * 判断某个样式是否存在于当前选中元素中
 *
 * @param {(string | Obj)} styleKeyOrStyleObj
 * @param {(string | boolean)} [targetVal]
 * @return {*}
 */
  const getIsStyleValueExist: GetIsStyleValueExist = (
    styleKeyOrStyleObj: string | Obj,
    targetVal?: string,
  ) => {
    if (!activeElementSchema.value) {
      return false;
    }
    if (typeof styleKeyOrStyleObj === 'string') {
      const _currentVal = activeElementStyle.value?.[styleKeyOrStyleObj];
      return _currentVal === targetVal;
    }
    if (typeof styleKeyOrStyleObj === 'object' && styleKeyOrStyleObj) {
      const _stylekey = Object.keys(styleKeyOrStyleObj)[0];
      const _currentVal = activeElementStyle.value?.[_stylekey];
      const _targetVal = styleKeyOrStyleObj[_stylekey];
      return _currentVal === _targetVal;
    }
    return false;
  };

  type CustomStyleSettingType = 'overwrite' | 'mutex' | 'uniq';

  /**
   * 设置样式
   *
   * @param {Obj} style
   * @param {CustomStyleSettingType} [settingType='overwrite'] 模式: overwrite-普通覆盖|mutex-互斥,有改属性时删除,没有则赋值|uniq-唯一,清空其他属性再赋值
   * @return {*}
   */
  const setCustomStyle = (style: Obj, settingType: CustomStyleSettingType = 'overwrite') => {
    if (!activeElementSchema.value) {
      return;
    }
    if (settingType === 'mutex') {
      const _isExist = getIsStyleValueExist(style);
      if (_isExist) {
        const _stylekey = Object.keys(style)[0];
        activeElementSchema.value.customStyle && delete activeElementSchema.value.customStyle[_stylekey];
        activeElementSchema.value.style && delete activeElementSchema.value.style[_stylekey];
        return;
      }
    }
    if (settingType === 'uniq') {
      activeElementSchema.value.customStyle = reactive({});
      activeElementSchema.value.style = reactive({});
    }
    activeElementSchema.value.customStyle = { ...activeElementSchema.value.customStyle, ...style };
    // setSaveState(false);
  };

  return {
    activeElementStyle,
    getIsStyleValueExist,
    setCustomStyle,
  };
};
