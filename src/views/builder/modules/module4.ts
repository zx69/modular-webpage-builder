import { getPercentage } from '@/utils/style';
import { headerSection, moduleInnerBox1, materialItemIds } from './common';

const leftSection = {
  type: 'block',
  style: {
    width: getPercentage(440 / 1260),
    marginRight: getPercentage(140 / 1260),
    paddingBottom: getPercentage(630 / 1260),
    flex: '0 0 auto',
  },
  mobile: {
    style: {
      // width: getPercentage(273 / 327),
      paddingBottom: getPercentage(416 / 351),
      backgroundColor: '#ffffff',
      marginBottom: '20px',
      borderBottomLeftRadius: '8px',
      borderBottomRightRadius: '8px',
      marginTop: '-12px',
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
          type: 'block',
          style: {
            height: '100%',
            background: '#F8F8F8',
            overflow: 'hidden',
          },
          children: [
            {
              type: 'block',
              style: {
                height: '100%',
                filter: 'blur(13px)',
                backgroundColor: '#f8f8f8',
                // eslint-disable-next-line no-template-curly-in-string
                backgroundImage: 'url(${imgUrl})',
              },
            },
          ],
        },
        {
          type: 'block',
          style: {
            width: getPercentage(360 / 440),
            height: getPercentage(530 / 630),
            position: 'absolute',
            right: '-18.18%',
            top: '50%',
            marginTop: 'calc(-60.23%)',
            backgroundColor: '#ffffff',
          },
          mobile: {
            style: {
              // width: getPercentage(231 / 273),
              // height: getPercentage(337 / 392),
              width: getPercentage(360 / 440),
              height: getPercentage(530 / 630),
              position: 'absolute',
              right: '0',
              top: '50%',
              marginTop: 'calc(-49.62%)',
              backgroundColor: '#ffffff',
            },
          },
          // class: 'fixed-aspect-radio-box',
          children: [
            {
              type: 'component',
              component: 'ImageBox',
              style: {
                width: 'calc(100% - 20px)',
                height: 'calc(100% - 20px)',
                margin: '10px',
              },
              props: {
                valueKey: 'imgUrl',
              },
            },
          ],
        },
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
  index: 2,
  aspectRadio: '65.42%',
  data: {
    title: '材料系列名称',
    desc: 'Width：52” Gauge：0.8mm',
    titleTag: 'SD-13688',
    imgUrl: 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/webapp/idealab/assets/material-brochure/material-brochure-sample-image-6.png',
    materialsIds: Array.from({ length: 6 }).map(e => materialItemIds()),
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
