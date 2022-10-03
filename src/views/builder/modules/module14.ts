import { getPercentage } from '@/utils/style';
import { decorateLine1, iconfontElem } from './common';

const module = () => ({
  type: 'module',
  index: 12,
  aspectRadio: '49.30%',
  data: {
    // eslint-disable-next-line max-len
    backgroundImage: `${process.env.BASE_URL}mock/preset-image/7a91a61830b4337e2c0c551004323db674855e1f7b612-hIii7P_fw658.png`,
    imgUrl: `${process.env.BASE_URL}mock/preset-image/0692517a9772b34212a05c2efb213c6d73b491e8ad00a-YTgS6J_fw658.png`,
    title: 'FA',
    title2: 'SHION',
  },
  class: 'fixed-aspect-radio-box',
  style: {
    paddingBottom: '49.30%',
    zIndex: 1,
  },
  mobile: {
    // style: {
    //   paddingBottom: '44.26%',
    //   // marginBottom: '16px',
    //   borderRadius: '8px',
    //   overflow: 'hidden',
    // },
  },
  children: [
    {
      type: 'block',
      class: 'flex-space-between',
      style: {
        alignItems: 'stretch',
        mixBlendMode: 'screen',
      },
      children: [
        {
          type: 'component',
          component: 'ImageBox',
          props: {
            valueKey: 'backgroundImage',
            imageType: 'image',
          },
          // class: 'flex-center',
          style: {
            // justifyContent: 'flex-end',
            width: '50%',
          },
        },
        {
          type: 'block',
          operation: 'shape',
          class: 'flex-center',
          style: {
            width: '50%',
            backgroundColor: '#ac7146',
            backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.2) 16%, transparent 85%)',
            position: 'relative',
          },
          children: [
            {
              type: 'block',
              style: {
                width: getPercentage(410 / 710),
                height: getPercentage(514 / 700),
                backgroundColor: '#ffffff',
              },
              children: [
                {
                  type: 'component',
                  component: 'ImageBox',
                  props: {
                    valueKey: 'imgUrl',
                    imageType: 'image',
                  },
                  style: {
                    width: getPercentage(360 / 410),
                    height: getPercentage(464 / 514),
                    margin: getPercentage(25 / 410),
                  },
                },
              ],
            },
            iconfontElem('i-a-3daogang', {
              fontSize: '18px',
              color: '#ffffff',
              position: 'absolute',
              top: getPercentage(50 / 700),
              right: getPercentage(60 / 710),
            }),
            decorateLine1({
              position: 'absolute',
              color: '#ffffff',
              height: getPercentage(200 / 700),
              bottom: getPercentage(50 / 700),
              right: getPercentage(60 / 710),
            }),
          ],
        },
        {
          type: 'block',
          style: {
            color: '#ffffff',
            fontSize: '66px',
            lineHeight: '1.4',
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '22.67%',
            wordBreak: 'break-all',
            fontWeight: 600,
          },
          children: [
            {
              type: 'component',
              component: 'InputableText',
              style: {
                letterSpacing: '0.33em',
              },
              props: {
                valueKey: 'title',
              },
              mobile: {
                props: {
                  valueKey: 'title',
                  mobileSizeRadio: 16 / 66,
                },
              },
            },
            {
              type: 'component',
              component: 'InputableText',
              style: {
                letterSpacing: '0.33em',
              },
              props: {
                valueKey: 'title2',
              },
              mobile: {
                props: {
                  valueKey: 'title2',
                  mobileSizeRadio: 16 / 66,
                },
              },
            },
          ],
        },

      ],
    },

  ],
});

export default module;
