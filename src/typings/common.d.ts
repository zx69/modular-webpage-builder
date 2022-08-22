
type Obj = Record<string | number, any>;
type GetArrayItem<T> = T extends Array<infer I> ? I : T;
type AsyncReturnType<T> = ReturnType<T> extends Promise<infer P> ? P : ReturnType<T>;
type TableParams<OutObj extends Obj = {}, Fields extends Obj = {}> = {
  page: number,
  size: number
  keywords?: string,
  sortType?: string | number,
  sort?: 1 | 2, // 正序|倒序
  fields?: Fields,
} & OutObj;
type TableData<T = Obj> = {
  total: number,
  current: number,
  size: number,
  records: T[],
  searchId?: string
};
type valueof<T> = T[keyof T];

interface Window {
  admf_to_xtex: (layer: Obj, imageInfo: Obj, colorStrWithRGB: string) => void,
  admf_to_jfab: (layer: Obj, imageInfo: Obj, colorStrWithRGB: string, materialInfo: Obj) => void,
  sendMessageToNative: (
    msgType: string,
    msg: string,
    onSuccess: (msgType: string, data: Obj, code: string) => void,
    onProgress?: (msgType: string, data: Obj, total: number, current: number) => void,
  ) => void;
  initJsNativeBridge: (projectKey: 'versebook', callback?: () => void)
}

declare module '*.json' {
  const value: any;
  export default value;
}
