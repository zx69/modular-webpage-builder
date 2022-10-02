import { getPercentage } from '@/utils/style';
import { decorateLine1, iconfontElem } from './common';

const emptyBorderBox = () => {
  const commonStyle = {
    width: getPercentage(424 / 936),
    height: getPercentage(383 / 700),
    backgroundColor: 'transparent',
    color: '#e0a78b',
    border: '8px solid currentColor',
    position: 'absolute',
    top: getPercentage(97 / 700),
    left: '0',
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
  index: 13,
  aspectRadio: getPercentage(800 / 1420),
  data: {
    // eslint-disable-next-line max-len
    imgUrl: 'https://gd-hbimg.huaban.com/5edee231a8a21aaefa8b60b14d125e0b0234a90c303c9-1VjnaL_fw658',
    title: '简约',
    title2: '时尚',
    desc: 'FASHION',
  },
  class: 'fixed-aspect-radio-box',
  style: {
    paddingBottom: getPercentage(800 / 1420),
    backgroundColor: '#ffffff',
  },
  children: [
    {
      type: 'block',
      class: 'flex-space-between',
      style: {
        top: getPercentage(50 / 800),
        bottom: getPercentage(50 / 800),
        alignItems: 'stretch',
        // eslint-disable-next-line max-len
        backgroundImage: 'url(https://gd-hbimg.huaban.com/e02471b697cfca846605a884cbdc81951235d3c5dec95-pqO6bJ_fw658)',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      },
      children: [
        {
          type: 'block',
          style: {
            width: getPercentage(484 / 1420),
          },
          children: [
            {
              type: 'block',
              style: {
                width: getPercentage(310 / 484),
                marginLeft: getPercentage(120 / 484),
                marginTop: getPercentage(198 / 484),
                fontSize: '78px',
                color: '#222222',
                lineHeight: 109 / 78,
              },
              children: [
                {
                  type: 'component',
                  component: 'InputableText',
                  style: {
                    letterSpacing: '0.24em',
                  },
                  props: {
                    valueKey: 'title',
                  },
                  mobile: {
                    props: {
                      valueKey: 'title',
                      mobileSizeRadio: 19 / 78,
                    },
                  },
                },
                {
                  type: 'component',
                  component: 'InputableText',
                  style: {
                    marginTop: getPercentage(24 / 310),
                    textAlign: 'center',
                    letterSpacing: '0.24em',
                  },
                  props: {
                    valueKey: 'title2',
                  },
                  mobile: {
                    props: {
                      valueKey: 'title2',
                      mobileSizeRadio: 19 / 78,
                    },
                  },
                },
                iconfontElem('i-xiaoyuandian', {
                  fontSize: '18px',
                  color: '#606060',
                  position: 'absolute',
                  top: getPercentage(97 / 700),
                  left: getPercentage(24 / 484),
                }),
                decorateLine1({
                  position: 'absolute',
                  color: '#606060',
                  left: getPercentage(24 / 484),
                  height: getPercentage(200 / 700),
                  bottom: getPercentage(84 / 700),
                }),
              ],
            },

          ],
        },
        {
          type: 'block',
          class: 'flex-1',
          style: {
            width: getPercentage(936 / 1420),
            position: 'relative',
          },
          children: [
            emptyBorderBox(),
            {
              type: 'component',
              component: 'ImageBox',
              props: {
                valueKey: 'imgUrl',
                imageType: 'image',
              },
              style: {
                width: getPercentage(464 / 936),
                height: getPercentage(470 / 700),
                position: 'absolute',
                top: getPercentage(146 / 700),
                left: getPercentage(145 / 936),
              },
            },
          ],
        },
        {
          type: 'component',
          component: 'InputableText',
          style: {
            position: 'absolute',
            left: getPercentage(490 / 1420),
            top: getPercentage(538 / 700),
            fontSize: '16px',
            color: '#999999',
            transform: 'rotate(90deg)',
            transformOrigin: 'left top',
            width: '10%',
          },
          props: {
            valueKey: 'desc',
          },
          mobile: {
            props: {
              valueKey: 'desc',
              mobileSizeRadio: 4 / 16,
            },
          },
        },
      ],
    },

  ],
});

export default module;

