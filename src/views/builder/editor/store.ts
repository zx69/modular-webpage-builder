import { getPlatform } from '@/utils/system';
import {
  reactive, computed, Ref, ref,
} from 'vue';
import getModulesList from '../modules';
import {
  CommonCompProp, CompBlock, CompComponent, CompModule, ControlAction, FrameClientRect,
} from './typings';

export const modules: Ref<CommonCompProp<'module'>[]> = ref([]);
export const generateModulesList = (type: 'material-brochure' | 'merchant-homepage' = 'material-brochure') => {
  console.log(getModulesList(type));
  modules.value = [getModulesList(type)[0]];
};

generateModulesList();

const initStoreData = {
  // sectionId计数
  sectionIdCount: 1,
  // 当前平台
  currentPlatform: getPlatform() as '' | 'pc' | 'h5' | 'mp',
  // 由shema渲染出的节点的扁平化[id-obj]键值对map
  flattenShemaNodeMap: {} as { [key: string]: CommonCompProp },
  // 各个section的data的扁平化[id-obj]键值对map
  sectionsDataMap: {} as { [key: string]: Obj },
  // 工作区主内容区Dom
  mainContainerDom: null as HTMLElement | null,
  // 当中选择元素fid
  activeElementFid: '',
  // 当前选择元素的clientRect
  activeFrameClientRect: null as FrameClientRect | null,
  // 当前活跃模块的schema
  activeModuleScheme: null as CompModule | null,
  // activeModuleDom: null as HTMLElement | null,
  renderSchemaList: [] as CompModule[],
  // 编辑器缩放比例
  editorContainerScale: 1,
  // 是否已经保存(离开或替换schma提醒判断)
  isSaved: true,
  // 材料是否已经初始化
  isInit: false,
  // 模型是否已经初始化
  isModelInit: false,
  ossDomain: '',
  previewAreaWidth: 1420,
  previewContentWidth: 286,
};


const store = reactive<typeof initStoreData>(JSON.parse(JSON.stringify(initStoreData)));

export default store;

export const activeElementSchema = computed<CommonCompProp | null>(() => {
  return store.activeElementFid ? (store.flattenShemaNodeMap[store.activeElementFid] || null) : null;
});

export const setActiveElementFid = (fid: string) => {
  store.activeElementFid = fid;
};
export const setActiveFrameClientRect = (clientRect: FrameClientRect | null) => {
  store.activeFrameClientRect = clientRect;
};

export const setRenderSchema = (schema: CompModule[]) => {
  store.renderSchemaList = schema;
  store.sectionIdCount = store.renderSchemaList.length + 1; // sectionIdCount需根据store.renderSChenmaList实时更新
};
