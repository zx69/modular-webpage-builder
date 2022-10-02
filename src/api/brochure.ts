import justifiedLayout from 'justified-layout';
// import Mock from 'mockjs';
import hash from 'object-hash';
import mockImageList from '@/mock/image/list.json';
import store from '@/views/builder/editor/store';


/* ============== 图片管理 ============== */

// photo上传状态
type FileUploadStatus = 'ready' | 'uploading' | 'success' | 'fail';
type FileAppendPropertiesRecord = {
  [S in FileUploadStatus]: { status: S, uploadedSize: number, file: File };
};
// GetValuesOfRecord: 将对象类型转换成联合类型
type GetValuesOfRecord<T> = T extends Record<string, infer P> ? P : never;
type FileAppendProperties = Partial<GetValuesOfRecord<FileAppendPropertiesRecord>>;

export type PhotoItem = {
  id?: string,
  name: string,
  url: string,
  width: number,
  length: number,
};

export type MixedPhotoItem = PhotoItem & FileAppendProperties & {key: string};
export type LayoutedPhotoItem = ReturnType<typeof justifiedLayout>['boxes'][0] & FileAppendProperties;


// 获取用户图片库图片列表
export const fetchPhotoLibraryList = async (): Promise<PhotoItem[]> => {
  return (mockImageList as PhotoItem[]).map(item => ({ ...item, id: hash(Date.now()) }));
};

// 保存图片信息到图片库
export const savePhotoToLibrary = async (photoData: PhotoItem) => {
  // const res = await axios.post<{ id: string, coverPictureUrl: string, }>('/idealab-manage/pic/manage/add', { ...photoData, status: 1 });
  // return res.data;
};

// 从图片库中删除图片
export const removePhotoFromLibray = async (photoIds: string) => {
  // const res = await axios.post<null>('/idealab-manage/pic/manage/delete', [photoIds]);
  // return res;
};

export const photoApi = {
  fetch: fetchPhotoLibraryList,
  add: savePhotoToLibrary,
  remove: removePhotoFromLibray,
};
/* ============== end 图片管理 ============== */


/* ============== 主页管理 ============== */
export type BrochureItem = {
  id: string,
  name: string,
  cover: string,
  content: Obj,
};
export type BrochureBaseInfo = { name: string, isOpen: 1 | 2, cover: string, version: string, content: Obj };

// 新增材料册
export const addMaterialBrochure = async (brochureData: Omit<BrochureItem, 'id'>) => {
  // const res = await axios.post<null>('/idealab-manage/collection/temp/add', brochureData);
  // return res.data;
};

// 编辑材料册属性
export const editMaterialBrochureInfo = async (brochureInfo: Omit<BrochureItem, 'content'>) => {
  // const res = await axios.post<null>('/idealab-manage/collection/temp/update', brochureInfo);
  // return res;
};

// 保存材料册内容，并记录版本
export const saveMaterialBrochureContent = async (brochureContent: Pick<BrochureItem, 'id' | 'content'>) => {
  // const res = await axios.post<null>('/idealab-manage/collection/temp/content/update', brochureContent);
  // return res.data;
};

// 获取材料册属性
export const fetchMaterialBrochureInfo = async (collectionId: string) => {
  // const res = await axios.get<BrochureBaseInfo>('/idealab-manage/collection/temp/detail', { params: { tempId: collectionId } });
  // return res.data;
};

// 获取材料册内容JSON
export const fetchMaterialBrochureContent = async (collectionId: string) => {
  // mock
  return store.renderSchemaList;
};

// export type BrochureEditionItem = {name: string, saveTime: string, version: string};
// 获取材料册版本列表
// export const fetchMaterialBrochureEditionsList = async (collectionId: string) => {
//   const res = await axios.get<BrochureEditionItem[]>('/idealab-material/collection/revisions', { params: { collectionId } });
//   return res.data;
// };


/* ============== end 主页管理 ============== */


// 获取商品列表
export const fetchProductList = async (params: Obj) => {
  // mock
  const { page, size, keywords } = params;
  const mockList = Array(20).fill('').map((item, i) => ({
    id: `${i + 1}`,
    name: `产品${i + 1}`,
    price: Number((Math.random() * 10 + 12).toFixed(2)),
    applicableSeason: ['春季', '夏季', '秋季', '冬季'][Math.round(Math.random() * 4)],
    category: ['衣服', '鞋子', '裤子', '配饰'][Math.round(Math.random() * 4)],
    // eslint-disable-next-line import/no-dynamic-require
    imgUrl: require(`@/mock/product/cover/product-${i + 1}.png`),
    supplierLogo: require('@/assets/logo.png'),
    supplierName: 'Niubility Ltd',
  }));

  return mockList.slice((page - 1) * size, page * size);
};
