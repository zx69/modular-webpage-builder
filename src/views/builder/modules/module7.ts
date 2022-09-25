import { getPercentage } from '@/utils/style';
import { headerSection, moduleInnerBox1, materialItemIds } from './common';

const leftSection = {
  type: 'block',
  style: {
    width: getPercentage(408 / 1260),
    marginLeft: getPercentage(100 / 1260),
    marginRight: getPercentage(90 / 1260),
    paddingBottom: getPercentage(525 / 1260),
  },
  mobile: {
    style: {
      width: getPercentage(272 / 351),
      marginLeft: getPercentage(79 / 351),
      paddingBottom: getPercentage(351 / 351),
      marginBottom: '34px',
    },
  },
  class: 'fixed-aspect-radio-box',
  children: [
    {
      type: 'component',
      component: 'ImageBox',
      style: {
        width: '100%',
        height: '100%',
        // margin: '10px',
      },
      props: {
        valueKey: 'imgUrl',
      },
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
  index: 5,
  aspectRadio: '60.31%',
  data: {
    title: '材料系列名称',
    desc: 'Width：52” Gauge：0.8mm',
    titleTag: 'SD-13688',
    imgUrl: 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/webapp/idealab/assets/material-brochure/material-brochure-sample-image-11.png',
    materialsIds: Array.from({ length: 6 }).map(e => materialItemIds()),
  },
  operation: 'shape',
  class: 'module-beside-gap',
  style: {
    position: 'relative',
    // backgroundColor: '#f9f7f6',
  },
  children: [
    {
      type: 'block',
      operation: 'shape',
      style: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        left: '0',
        top: '0',
        backgroundColor: '#f9f7f6',
      },
      mobile: {
        style: {
          height: '0',
          // width: '100%',
          paddingBottom: getPercentage(471 / 351),
          position: 'absolute',
          left: '0',
          top: '0',
          right: '0',
          backgroundColor: '#f9f7f6',
        },
      },
    },
    {
      type: 'block',
      operation: 'shape',
      style: {
        height: '100%',
        width: getPercentage(508 / 1420),
        position: 'absolute',
        left: '0',
        top: '0',
        backgroundColor: '#dfdbd8',
      },
      mobile: {
        style: {
          height: '0',
          width: getPercentage(280 / 375),
          paddingBottom: getPercentage(471 / 351),
          position: 'absolute',
          left: '0',
          top: '0',
          backgroundColor: '#dfdbd8',
        },
      },
    },
    {
      type: 'block',
      style: {
        position: 'relative',
      },
      mobile: {
        style: {
          position: 'relative',
          // paddingTop: '24px',
        },
      },
      children: [
        headerSection(false),
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
            },
          },
          children: [
            leftSection,
            rightSection,
          ],
        },
      ],
    },

  ],
});

export default module;
