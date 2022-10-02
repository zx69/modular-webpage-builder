import { getPercentage } from '@/utils/style';
import { decorateLine1, iconfontElem } from './common';


const module = () => ({
  type: 'module',
  index: 15,
  aspectRadio: getPercentage(700 / 1420),
  data: {
    // eslint-disable-next-line max-len
    imgUrl: 'https://gd-hbimg.huaban.com/ffa960e2b468cdef1f047880c446e909b3f110434de94-vqBull_fw658',
    imgUrl2: 'https://gd-hbimg.huaban.com/eb9c2379a3862c8bd173c358b462d12dc35ff17321573-1YWPSL_fw658',
    title: 'FASHION',
  },
  class: 'fixed-aspect-radio-box',
  style: {
    paddingBottom: getPercentage(700 / 1420),
    backgroundColor: '#ffffff',
  },
  children: [
    {
      type: 'block',
      class: 'flex-column',
      style: {
        // padding: `${getPercentage(47 / 1420)} ${getPercentage(66 / 1420)} ${getPercentage(66 / 1420)}`,
        top: getPercentage(47 / 700),
        left: getPercentage(66 / 1420),
        right: getPercentage(66 / 1420),
        bottom: getPercentage(66 / 700),
      },
      children: [
        {
          type: 'block',
          class: 'flex-space-between',
          style: {
            marginBottom: getPercentage(22 / 1420),
          },
          children: [
            {
              type: 'component',
              component: 'InputableText',
              style: {
                fontSize: '32px',
                fontWeight: 'bold',
                lineHeight: 48 / 32,
              },
              class: 'flex-1',
              mobile: {
                props: {
                  valueKey: 'title',
                  mobileSizeRadio: 8 / 32,
                },
              },
              props: {
                valueKey: 'title',
              },
            },
            iconfontElem('i-changpaidiandian', {
              fontSize: '31px',
              color: '#CECECE',
            }),
          ],
        },
        {
          type: 'block',
          style: {
            position: 'relative',
            overflow: 'hidden',
          },
          class: 'flex-1',
          children: [
            {
              type: 'block',
              operation: 'shape',
              style: {
                position: 'absolute',
                left: '0',
                bottom: '0',
                width: getPercentage(198 / 1420),
                height: getPercentage(268 / 700),
                backgroundColor: '#72717f',
              },
            },
            {
              type: 'block',
              operation: 'shape',
              style: {
                position: 'absolute',
                right: '0',
                top: '0',
                width: getPercentage(216 / 1420),
                height: getPercentage(278 / 700),
                backgroundColor: '#dab276',
              },
            },
            {
              type: 'block',
              class: 'flex-space-between flex-1',
              style: {
                alignItems: 'stretch',
                padding: getPercentage(20 / 1420),
                height: '100%',
              },
              children: [
                // {
                //   type: 'block',
                // },
                // { type: 'block' },
                {
                  type: 'component',
                  component: 'ImageBox',
                  props: {
                    valueKey: 'imgUrl',
                    imageType: 'image',
                  },
                  style: {
                    width: getPercentage(804 / 1248),
                  },
                },
                {
                  type: 'component',
                  component: 'ImageBox',
                  props: {
                    valueKey: 'imgUrl2',
                    imageType: 'image',
                  },
                  style: {
                    width: getPercentage(420 / 1248),
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});

export default module;

