import { getPercentage } from '@/utils/style';

const module = (type: 'material-brochure' | 'merchant-homepage' = 'material-brochure') => {
  // 材料册没有视频模块
  if (type === 'material-brochure') {
    return false;
  }
  return {
    type: 'module',
    index: 11,
    aspectRadio: '63.10%',
    data: {
      title: '视频标题',
      videoUrl: 'https://www.runoob.com/try/demo_source/movie.mp4',
    },
    // withVideo: true,
    class: 'module-beside-gap',
    children: [
      {
        type: 'block',
        class: 'fixed-aspect-radio-box',
        style: {
          paddingBottom: getPercentage(708 / 1260),
        },
        mobile: {
          style: {
            paddingBottom: getPercentage(708 / 1260),
            borderRadius: '8px',
            overflow: 'hidden',
          },
        },
        children: [
          {
            type: 'component',
            component: 'VideoBox',
            props: {
              valueKey: 'videoUrl',
              valueKey2: 'title',
            },
            style: {
              fontSize: '44px',
            },
            mobile: {
              class: 'mobile',
              style: {
                fontSize: '16px',
              },
            },
          },
        ],
      },

    ],
  };
};

export default module;
