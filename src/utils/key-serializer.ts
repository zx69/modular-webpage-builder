/* eslint-disable @typescript-eslint/ban-ts-comment */
export type PublicKey = Exclude<PropertyKey, symbol>;

/**
 * parse a string to [[PublicKey]] array
 *
 * ```javascript
 *  parse('a[0].b[2]') // => ['a', 0, 'b', 2]
 * ```
 *
 * @param str the string you wanna parse
 */
const r = /(?=(?:\[|\.))/;
export function parse(str: string): PublicKey[] {
  return str.split(r)
    .filter(item => item.trim())
    .map(item => {
      if (item[0] === '.') {
        return item.substr(1);
      } if (item[0] === '[') {
        return Number(item.substr(1, item.length - 2));
      }
      return item;
    });
}


/**
 * query the result from target by keys
 * @param target
 * @param keys
 * @param createdTarget if it's ```true```, this funciton will create object or array when necessary
 * ```javascript
 * const obj = { a: { b: [1, 2] } }
 * query(obj, 'a.b[0]') // => { target: [1, 2], key: 0, value: 1 }
 * ```
 * or with **createTarget** param
 * ```javascript
 * const obj = { }
 * query(obj, 'a.b[0]', true) => { target: [], key: 0, value: undefined }
 * ```
 *
 */
// eslint-disable-next-line max-len
export function query(target: Record<PropertyKey, unknown>, keys?: string | PublicKey[] | null, createTarget = false): { target: Record<PropertyKey, unknown>, key?: PublicKey | undefined, value: unknown } {
  if (keys == null || keys === '') {
    return { target, key: undefined, value: target };
  }
  let parsedkeys: PublicKey[];
  if (typeof keys === 'string') {
    parsedkeys = parse(keys);
  } else {
    parsedkeys = keys.slice();
  }
  let key: PublicKey | undefined;
  let value = target;
  if (!parsedkeys.length) {
    return { target, value };
  }
  while (parsedkeys.length) {
    target = value;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    key = parsedkeys.shift()!;
    if (parsedkeys.length && !Object.prototype.hasOwnProperty.call(target, key) && createTarget) {
      const createdTarget = typeof parsedkeys[0] === 'number' ? [] : {};
      // @ts-ignore
      target[key] = createdTarget;
    }
    // @ts-ignore this line may throw when target is undefined, and i do not need handle
    value = target[key];
  }
  return { target, key, value };
}


/**
 * deepin target, and get value or keys from target
 * @param target
 * @param keys
 *
 * it is only a alias of ```query(obj, keys).value```
 *
 * ```javascript
 *
 * const obj = { a: { b: [1, 2] } }
 * query(obj, 'a.b[0]') // => 1
 *
 * ```
 *
 */
export function get(target: Record<PropertyKey, unknown>, keys: string | PublicKey[] | null): unknown {
  return query(target, keys).value;
}

/**
 * deepin target, and set value of keys from target
 * @param target
 * @param keys
 * @param value
 *
 * ```javascript
 *
 * const obj = { a: { b: [1, 2] } }
 * query(obj, 'a.b[0]', 3)
 * obj.a.b[0] === 3 // => true
 *
 * ```
 */
export function set(target: Record<PropertyKey, unknown>, keys: string | PublicKey[] | null, value: unknown, createTarget = true): void {
  const result = query(target, keys, createTarget);
  if (result.key !== undefined) {
    result.target[result.key] = value;
  }
}

export const keySerializer = {
  set,
  get,
  parse,
  query,
};
export default keySerializer;
