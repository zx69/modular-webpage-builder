/* eslint-disable import/prefer-default-export */
const _keys = <{ <T extends Obj>(o: T): Array<keyof T> }>Object.keys;

export const objUtil = {
  keys: _keys,
  pick<T, K extends keyof T>(obj: T, keys: K[] = Object.keys(obj) as K[], target: any = {}): Pick<T, K> {
    return keys.reduce((memo, k) => {
      if (k in obj) {
        memo[k] = obj[k];
      }
      return memo;
    }, target);
  },
  omit<O extends Obj, K extends string>(obj: O, omitKeys: K[] = []) {
    const omitKeysMap = omitKeys.reduce((_obj, key) => {
      _obj[key] = true;
      return _obj;
    }, {} as Record<keyof O, true>);
    return _keys(obj).reduce((_obj, key) => {
      if (!omitKeysMap[key]) _obj[key] = obj[key];
      return _obj;
    }, {} as O);
  },
};
