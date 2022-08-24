// import InputableText from '../components/moduleComponents/InputableText.vue';
// import MaterialBox from '../components/moduleComponents/MaterialBox.vue';
// import ImageBox from '../components/moduleComponents/ImageBox.vue';
// import VideoBox from '../components/moduleComponents/VideoBox.vue';
// import store from '../store';

// 使用到的组件集合.
// note: 原本type=component时使用函数表示组件, 但函数序列化后会丢失, 不利于保存到服务器.所以改用字符串表示特定组件
export const moduleComponentsMap = {
  InputableText: {},
  MaterialBox: {},
  ImageBox: {},
  VideoBox: {},
};


export const getPercentage = (num: number, unit = '%') => {
  return `${(num * 100).toFixed(2)}${unit}`;
};


const getModulesList = (type: 'material-brochure' | 'merchant-homepage' = 'material-brochure') => {
  const requireCtx = require.context('.', true, /\.(ts)$/);
  const keys = requireCtx.keys();
  return keys.filter(key => /\.\/module(.*).ts/.test(key)).map((key, i) => {
    const moduleFn = requireCtx(key).default;
    const moduleObj = typeof moduleFn === 'function' && moduleFn(type);
    if (!moduleObj) {
      return false;
    }
    return {
      ...moduleObj,
      mid: `module${i + 1}`,
    };
  }).filter(Boolean).sort((a, b) => {
    // 没有index的取99(排最后)
    return (a.index || 99) - (b.index || 99);
  });
};

export default getModulesList;

// export default [
//   module1(),
//   module2(),
//   // modules3(),
// ].map((module, i) => ({ ...module, mid: `module${i}` }));

// // 整体缩放模块的外包层.用transform解决chrome字体不得小于12px的问题, 只用于解决mobile预览的显示
// export const overallZoomModule = (originModule: Obj) => {
//   const moduleScaleInMobile = store.currentPlatform === 'pc' ? 286 / 1420 : 1;
//   console.log(moduleScaleInMobile);
//   const {
//     type,
//     index,
//     aspectRadio,
//     data,
//     ...realSchema
//   } = originModule;
//   return {
//     type,
//     index,
//     aspectRadio,
//     data,
//     style: {
//       paddingBottom: aspectRadio,
//       height: '0',
//       overflow: 'hidden',
//     },
//     children: [
//       {
//         type: 'block',
//         mobile: {
//           style: {
//             width: moduleScaleInMobile < 1 ? '1420px' : 'initial',
//             transform: `scale(${moduleScaleInMobile})`,
//             transformOrigin: 'left top',
//           },
//         },
//         children: [
//           {
//             type: 'block',
//             ...realSchema,
//           },
//         ],
//       },
//     ],
//   };
// };
