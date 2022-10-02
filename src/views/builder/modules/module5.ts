/* eslint-disable max-len */
import { getPercentage } from '@/utils/style';
import { headerSection, materialItemIds } from './common';

const gridImgBox = (wrapperStyle: Obj, imgBoxValueKey: string) => ({
  type: 'block',
  ...wrapperStyle,
  class: 'fixed-aspect-radio-box',
  children: [
    {
      type: 'block',
      mobile: {
        style: {
          // inset: '12px',
        },
      },
      children: [
        {
          type: 'component',
          component: 'ImageBox',
          props: {
            valueKey: imgBoxValueKey,
          },
        },
      ],
    },
  ],
});

// note: 移动端兼容性问题: grid-area布局方式下, 格子内的子元素高度如果没设置为变成0, align-items:stretch设置也没用
const module = () => ({
  type: 'module',
  index: 3,
  aspectRadio: '74.72%',
  data: {
    title: '材料系列名称',
    desc: 'Width：52” Gauge：0.8mm',
    titleTag: 'SD-13688',
    boxTitle: '千鸟格',
    boxDesc: 'houndstooth',
    materialId1: materialItemIds(),
    materialId2: materialItemIds(),
    imgUrl1: 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/webapp/idealab/assets/material-brochure/material-brochure-sample-image-7.png',
    imgUrl2: 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/webapp/idealab/assets/material-brochure/material-brochure-sample-image-8.png',
    imgUrl3: 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/webapp/idealab/assets/material-brochure/material-brochure-sample-image-9.png',
    imgUrl4: 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/webapp/idealab/assets/material-brochure/material-brochure-sample-image-10.png',
  },
  class: 'module-beside-gap',
  children: [
    headerSection(),
    {
      type: 'block',
      mobile: {
        style: {
          padding: '12px',
          backgroundColor: '#ffffff',
          marginTop: '-12px',
        },
      },
      children: [
        {
          type: 'block',
          class: 'fixed-aspect-radio-box',
          style: {
            paddingBottom: getPercentage(762 / 1260),
          },
          mobile: {
            style: {
              paddingBottom: getPercentage(1272 / 327),
            },
          },
          children: [{
            type: 'block',
            style: {
              display: 'grid',
              gridTemplateColumns: `${getPercentage(420 / 1260)} ${getPercentage(340 / 1260)} ${getPercentage(500 / 1260)}`,
              gridTemplateRows: `${getPercentage(382 / 762)} ${getPercentage(93 / 762)} ${getPercentage(289 / 762)}`,
              gridTemplateAreas: '\'img1 img2 img3\'\'img1 img4 img3\'\'img1 img4 img5\'',
              alignItems: 'stretch',
            },
            mobile: {
              style: {
                display: 'grid',
                gridTemplateColumns: '50% 50%',
                gridTemplateRows: `${getPercentage(593 / 1277)} ${getPercentage(184 / 1277)} ${getPercentage(311 / 1277)} ${getPercentage(189 / 1277)}`,
                gridTemplateAreas: '\'img1 img1\'\'img2 img4\'\'img3 img3\'\'img5 img5\'',
                alignItems: 'stretch',
              },
            },
            children: [
              {
                type: 'block',
                class: 'fixed-aspect-radio-box',
                style: {
                  gridArea: 'img1',
                  height: '0',
                  paddingBottom: getPercentage(762 / 420),
                },
                mobile: {
                  style: {
                    gridArea: 'img1',
                    height: '0',
                    paddingBottom: getPercentage(593 / 327),
                  },
                },
                children: [
                  {
                    type: 'component',
                    component: 'ImageBox',
                    props: {
                      valueKey: 'imgUrl1',
                    },
                  },
                  {
                    type: 'component',
                    component: 'ProductBox',
                    props: {
                      valueKey: 'materialId1',
                      showTitle: false,
                    },
                    style: {
                      width: getPercentage(230 / 420),
                      height: '0',
                      paddingBottom: getPercentage(230 / 420),
                      top: 'unset',
                      left: 'unset',
                    },
                  },
                ],
              },
              gridImgBox(
                {
                  style: {
                    gridArea: 'img2',
                    height: '0',
                    paddingBottom: getPercentage(382 / 340),
                  },
                },
                'imgUrl2',
              ),
              {
                type: 'block',
                class: 'fixed-aspect-radio-box',
                style: {
                  height: '0',
                  paddingBottom: getPercentage(382 / 340),
                },
                children: [
                  {
                    type: 'block',
                    operation: 'shape',
                    style: {
                      gridArea: 'img4',
                      backgroundColor: '#8C7868',
                      flexDirection: 'column',
                    },
                    class: 'flex-center',
                    children: [
                      {
                        type: 'component',
                        component: 'InputableText',
                        props: {
                          valueKey: 'boxTitle',
                        },
                        mobile: {
                          props: {
                            valueKey: 'boxTitle',
                            mobileSizeRadio: 0.5,
                          },
                        },
                        style: {
                          color: '#ffffff',
                          fontSize: '48px',
                        },
                      },
                      {
                        type: 'component',
                        component: 'InputableText',
                        props: {
                          valueKey: 'boxDesc',
                        },
                        mobile: {
                          props: {
                            valueKey: 'boxDesc',
                            mobileSizeRadio: 0.5,
                          },
                        },
                        style: {
                          color: '#ffffff',
                          fontSize: '20px',
                          marginTop: '20px',
                        },
                      },
                    ],
                  },
                ],
              },
              {
                type: 'block',
                class: 'fixed-aspect-radio-box',
                style: {
                  gridArea: 'img3',
                  height: '0',
                  paddingBottom: getPercentage(475 / 500),
                },
                children: [
                  {
                    type: 'component',
                    component: 'ImageBox',

                    props: {
                      valueKey: 'imgUrl3',
                    },
                  },
                  {
                    type: 'component',
                    component: 'ProductBox',
                    props: {
                      valueKey: 'materialId2',
                      showTitle: false,
                    },
                    style: {
                      width: getPercentage(340 / 500),
                      height: '0',
                      paddingBottom: getPercentage(340 / 500),
                      top: 'unset',
                      right: 'unset',
                    },
                  },
                ],
              },
              gridImgBox(
                {
                  style: {
                    gridArea: 'img5',
                    height: '0',
                    paddingBottom: getPercentage(289 / 500),
                  },
                },
                'imgUrl4',
              ),
            ],
          }],
        },
      ],
    },


  ],
});

export default module;
