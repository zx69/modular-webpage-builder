import { getPercentage } from '@/utils/style';
import { headerSection, moduleInnerBox1 } from './common';


const leftSection = {
  type: 'block',
  style: {
    display: 'grid',
    gap: `28px ${getPercentage(40 / 920)}`,
    gridTemplateColumns: `repeat(4, ${getPercentage((1 - 40 / 920 * 3) / 4)})`,
    flex: '1',
  },
  mobile: {
    style: {
      display: 'grid',
      gap: '12px 12px',
      gridTemplateColumns: 'repeat(2, calc((100% - 12px)/2))',
    },
  },
  children: Array.from({ length: 8 }).map((e, i) => (moduleInnerBox1(`materialsIds[${i}]`))),
};

const rightSection = {
  type: 'block',
  style: {
    flex: '0 0 auto',
    height: '0',
    marginLeft: getPercentage(40 / 1260),
    width: getPercentage(300 / 1260),
    paddingBottom: getPercentage(490 / 1260),
  },
  mobile: {
    style: {
      width: '100%',
      height: '0',
      paddingBottom: getPercentage(490 / 300),
      backgroundColor: '#fff',
      borderRadius: '8px',
      marginTop: '14px',
    },
  },
  class: 'fixed-aspect-radio-box',
  children: [
    {
      type: 'block',
      mobile: {
        style: {
          top: '16px',
          left: '12px',
          right: '12px',
          bottom: '16px',
        },
      },
      children: [
        {
          type: 'block',
          operation: 'shape',
          style: {
            width: getPercentage(272 / 300),
            height: getPercentage(336 / 490),
            position: 'absolute',
            right: '0',
            bottom: '0',
            backgroundColor: '#f3d8bc',
          },
        },
        {
          type: 'component',
          component: 'ImageBox',
          style: {
            width: getPercentage(277 / 300),
            height: getPercentage(463 / 490),
            position: 'absolute',
            left: '0',
            top: '0',
          },
          props: {
            valueKey: 'imgUrl',
          },
        },
      ],
    },
  ],
};


const module = () => ({
  type: 'module',
  index: 4,
  aspectRadio: '61.9%',
  data: {
    title: '主题1',
    desc: 'description text',
    titleTag: 'ASIDE TAG',
    materialsIds: Array.from({ length: 8 }).map(e => ''),
    imgUrl: `${process.env.BASE_URL}mock/preset-image/103172a6ef037234a61869cd74ed842f9c334d65187435-LowUX7_fw658.png`,
  },
  class: 'module-beside-gap',
  children: [
    headerSection(),
    {
      type: 'block',
      style: {
        display: 'flex',
        alignItems: 'stretch',
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
