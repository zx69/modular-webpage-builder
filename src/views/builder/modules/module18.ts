import { getPercentage } from '@/utils/style';
import { capsuleTag, decorateLine1, iconfontElem } from './common';

const emptyBorderBox = () => {
  const commonStyle = {
    width: getPercentage(845 / 1350),
    height: getPercentage(365 / 700),
    backgroundColor: 'transparent',
    color: '#e0a78b',
    border: '8px solid currentColor',
    position: 'absolute',
    top: getPercentage(136 / 700),
    left: getPercentage(246 / 1350),
  };
  return {
    type: 'block',
    operation: 'text',
    style: commonStyle,
    mobile: {
      style: {
        ...commonStyle,
        borderWidth: '2px',
      },
    },
  };
};

const module = () => ({
  type: 'module',
  index: 16,
  aspectRadio: getPercentage(760 / 1420),
  data: {
    // eslint-disable-next-line max-len
    imgUrl: `${process.env.BASE_URL}mock/preset-image/f74a99d4d1d83d2be74dad201d44c481d95bb93726e4fe-PoQuL5_fw658.png`,
    imgUrl2: `${process.env.BASE_URL}mock/preset-image/e259c0707a4fdfc746c9cd0e1a8281be1ee7502742d63-oAka3l_fw658.png`,
    desc1: '现代风格',
    desc2: '遇见悠闲的生活',
  },
  class: 'fixed-aspect-radio-box',
  style: {
    paddingBottom: getPercentage(760 / 1420),
    backgroundColor: '#d1bab4',
    // transform: `scale(${window.innerWidth / 1420})`,
  },
  children: [
    {
      type: 'block',
      // class: 'flex-space-between',
      style: {
        top: getPercentage(30 / 760),
        bottom: getPercentage(30 / 760),
        left: getPercentage(35 / 760),
        right: getPercentage(35 / 760),
        // alignItems: 'stretch',
        backgroundColor: '#ffffff',
      },
      children: [
        iconfontElem('i-juxingkuang', {
          fontSize: '114px',
          color: '#EBEBEB',
          position: 'absolute',
          top: getPercentage(100 / 700),
          left: getPercentage(72 / 1350),
        }),
        {
          type: 'component',
          component: 'ImageBox',
          props: {
            valueKey: 'imgUrl',
            imageType: 'image',
          },
          // class: 'flex-center',
          style: {
            width: getPercentage(449 / 1350),
            height: getPercentage(571 / 700),
            position: 'absolute',
            top: getPercentage(93 / 700),
            left: getPercentage(187 / 1350),
          },
        },
        emptyBorderBox(),
        {
          type: 'component',
          component: 'ImageBox',
          props: {
            valueKey: 'imgUrl2',
            imageType: 'image',
          },
          // class: 'flex-center',
          style: {
            width: getPercentage(365 / 1350),
            height: getPercentage(365 / 700),
            position: 'absolute',
            top: getPercentage(196 / 700),
            right: getPercentage(200 / 1350),
          },
        },
        capsuleTag('desc1', 'desc2', {
          position: 'absolute',
          left: getPercentage(660 / 1350),
          bottom: getPercentage(36 / 700),
          maxWidth: '50%',
        }),
        iconfontElem('i-xiaoyuandian', {
          fontSize: '18px',
          color: '#e0a78b',
          position: 'absolute',
          top: getPercentage(46 / 700),
          right: getPercentage(87 / 1350),
        }),
      ],
    },

  ],
});

export default module;

