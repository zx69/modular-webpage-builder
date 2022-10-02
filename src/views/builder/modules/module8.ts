import { getPercentage } from '@/utils/style';
import { headerSection, moduleInnerBox1 } from './common';

const leftSection = {
  type: 'block',
  style: {
    width: getPercentage(387 / 1260),
    marginRight: getPercentage(177 / 1260),
    paddingBottom: getPercentage(526 / 1260),
  },
  mobile: {
    style: {
      paddingBottom: getPercentage(372 / 351),
      backgroundColor: '#ffffff',
      marginBottom: '20px',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
    },
  },
  class: 'fixed-aspect-radio-box',
  children: [
    {
      type: 'block',
      style: {
        flex: '0 0 auto',
      },
      mobile: {
        style: {
          top: '12px',
          left: '12px',
          right: '12px',
          bottom: '12px',
          paddingRight: getPercentage(54 / 327),
        },
      },
      children: [
        {
          type: 'component',
          component: 'ImageBox',
          style: {
            width: '100%',
            height: '100%',
          },
          props: {
            valueKey: 'imgUrl',
          },
        },
        {
          type: 'component',
          component: 'ProductBox',
          props: {
            valueKey: 'mainMaterialId',
            showTitle: false,
          },
          style: {
            width: getPercentage(380 / 387),
            height: '0',
            paddingBottom: getPercentage(380 / 387),
            position: 'absolute',
            right: `-${getPercentage(119 / 387)}`,
            top: getPercentage(36 / 387),
          },
          mobile: {
            style: {
              width: getPercentage(240 / 327),
              height: '0',
              paddingBottom: getPercentage(240 / 327),
              position: 'absolute',
              right: '0',
              top: getPercentage(48 / 327),
            },
          },
        },
        // {
        //   type: 'block',
        //   style: {
        //     width: getPercentage(360 / 440),
        //     height: getPercentage(530 / 630),
        //     position: 'absolute',
        //     right: '-18.18%',
        //     top: '50%',
        //     marginTop: 'calc(-60.23%)',
        //     backgroundColor: '#ffffff',
        //   },
        //   mobile: {
        //     style: {
        //       // width: getPercentage(231 / 273),
        //       // height: getPercentage(337 / 392),
        //       width: getPercentage(360 / 440),
        //       height: getPercentage(530 / 630),
        //       position: 'absolute',
        //       right: '0',
        //       top: '50%',
        //       marginTop: 'calc(-49.62%)',
        //       backgroundColor: '#ffffff',
        //     },
        //   },
        //   // class: 'fixed-aspect-radio-box',
        //   children: [
        //     {
        //       type: 'component',
        //       component: 'ImageBox',
        //       style: {
        //         width: 'calc(100% - 20px)',
        //         height: 'calc(100% - 20px)',
        //         margin: '10px',
        //       },
        //       props: {
        //         valueKey: 'imgUrl',
        //       },
        //     },
        //   ],
        // },
      ],
    },
  ],
};
const rightSection = {
  type: 'block',
  style: {
    display: 'grid',
    gap: `16px ${getPercentage(40 / 680)}`,
    gridTemplateColumns: `repeat(3, ${getPercentage((1 - 40 / 680 * 2) / 3)})`,
    flex: '1',
  },
  mobile: {
    style: {
      display: 'grid',
      gap: '12px 12px',
      gridTemplateColumns: 'repeat(2, calc((100% - 12px)/2))',
      // flex: '1',
    },
  },
  children: Array.from({ length: 6 }).map((e, i) => (moduleInnerBox1(`materialsIds[${i}]`))),
};

const module = () => ({
  type: 'module',
  index: 6,
  aspectRadio: '61.72%',
  data: {
    title: '主题1',
    desc: 'description text',
    titleTag: 'ASIDE TAG',
    imgUrl: 'https://gd-hbimg.huaban.com/a287954cdc6c3165cab1f01288302122e293b75410d196-8Phl2O_fw658',
    mainMaterialId: '',
    materialsIds: Array.from({ length: 6 }).map(e => ''),
  },
  class: 'module-beside-gap',
  children: [
    headerSection(),
    {
      type: 'block',
      style: {
        display: 'flex',
        alignItems: 'stretch',
        // justifyContent: 'space-between',
      },
      mobile: {
        style: {
          display: 'block',
          marginTop: '-12px',
        },
      },
      children: [
        leftSection,
        rightSection,
      ],
    },
  ],
});

export default module;
