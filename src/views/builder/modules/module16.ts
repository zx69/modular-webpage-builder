import { getPercentage } from '@/utils/style';
import { capsuleTag, decorateLine1, iconfontElem } from './common';


const module = () => ({
  type: 'module',
  index: 14,
  aspectRadio: getPercentage(700 / 1420),
  data: {
    // eslint-disable-next-line max-len
    backgroundImage: 'https://gd-hbimg.huaban.com/8906cb4ad5a5d230fa3f32e4e5aaf8504142369bbb1f0-bIJymE_fw658',
    title: '简约',
    title2: '舒适',
    desc1: '现代风格',
    desc2: '遇见悠闲的生活',
  },
  class: 'fixed-aspect-radio-box',
  style: {
    paddingBottom: getPercentage(700 / 1420),
    overflow: 'hidden',
  },
  children: [
    {
      type: 'block',
      style: {
        filter: 'blur(10px)',
        // eslint-disable-next-line no-template-curly-in-string
        backgroundImage: 'url(${backgroundImage})',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      },
    },
    {
      type: 'block',
      class: 'flex-space-between',
      style: {
        top: getPercentage(46 / 608),
        bottom: getPercentage(46 / 608),
        left: getPercentage(100 / 1420),
        right: getPercentage(100 / 1420),
        alignItems: 'stretch',
        backgroundColor: '#ffffff',
        paddingTop: getPercentage(36 / 1220),
        paddingBottom: getPercentage(50 / 1220),
        paddingLeft: getPercentage(36 / 1220),
        paddingRight: getPercentage(30 / 1220),
      },
      children: [
        {
          type: 'block',
          class: 'flex-1 flex-column',
          style: {
            width: getPercentage(582 / 1220),
            position: 'relative',
            justifyContent: 'space-between',
          },
          children: [
            iconfontElem('i-dianxianjiehe', {
              fontSize: '313px',
              color: '#D6D6D6',
              position: 'absolute',
              top: getPercentage(147 / 608),
              left: getPercentage(168 / 582),
            }, null),
            iconfontElem('i-xiaoyuandian', {
              fontSize: '18px',
              color: '#494949',
              // position: 'absolute',
              // top: '0',
              // left: '0',
            }),
            {
              type: 'block',
              style: {
                width: getPercentage(310 / 484),
                // marginLeft: getPercentage(120 / 484),
                // marginTop: getPercentage(198 / 484),
                fontSize: '78px',
                color: '#222222',
                lineHeight: 109 / 78,
                alignSelf: 'center',
                position: 'relative',
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
              ],
            },
            capsuleTag('desc1', 'desc2', {
              // fontSize: '18px',
            }),

          ],
        },
        {
          type: 'block',
          style: {
            width: getPercentage(608 / 1220),
            position: 'relative',
          },
          class: 'flex-column flex-space-between',
          children: [
            iconfontElem('i-jiantou', {
              fontSize: '24px',
              color: '#EBEBEB',
              alignSelf: 'flex-end',
            }),
            {
              type: 'component',
              component: 'ImageBox',
              props: {
                valueKey: 'backgroundImage',
                imageType: 'image',
              },
              style: {
                // width: getPercentage(464 / 608),
                height: getPercentage(456 / 522),
              },
            },
          ],
        },
      ],
    },

  ],
});

export default module;

