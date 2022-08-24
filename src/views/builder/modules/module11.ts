import { getPercentage } from '@/utils/style';
import { headerSection, moduleInnerBox1, materialItemIds } from './common';


const gridImgBox = (wrapperStyle: Obj, imgBoxValueKey: string) => ({
  type: 'block',
  ...wrapperStyle,
  class: 'fixed-aspect-radio-box',
  children: [
    {
      type: 'block',
      mobile: {
        style: {
          inset: '12px',
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


const module = (type: 'material-brochure' | 'merchant-homepage' = 'material-brochure') => ({
  type: 'module',
  index: 9,
  aspectRadio: '86.7%',
  data: {
    title: '材料系列名称',
    desc: 'Width：52” Gauge：0.8mm',
    titleTag: 'SD-13688',
    materialsIds: Array.from({ length: 11 }).map(e => materialItemIds()),
    imgUrl1: 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/webapp/idealab/assets/material-brochure/material-brochure-sample-image-3.png',
    imgUrl2: 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/webapp/idealab/assets/material-brochure/material-brochure-sample-image-16.png',
    imgUrl3: 'https://sdtc-frontend.oss-cn-shenzhen.aliyuncs.com/webapp/idealab/assets/material-brochure/material-brochure-sample-image-4.png',
  },
  class: 'module-beside-gap',
  children: [
    headerSection(type, false),
    // {
    //   type: 'block',
    // class: 'fixed-aspect-radio-box',
    // style: {
    //   paddingBottom:
    // },
    // children: [
    {
      type: 'block',
      style: {
        display: 'grid',
        gap: `10px ${getPercentage(30 / 1260)}`,
        gridTemplateColumns: `repeat(5, ${getPercentage((1 - 30 / 1260 * 4) / 5)})`,
        gridTemplateAreas: '\'img1 . img2 . img3\'\'img1 . . . .\'\'img1 . . . .\'',
      },
      mobile: {
        style: {
          display: 'grid',
          gap: '12px 12px',
          gridTemplateColumns: 'repeat(2, calc((100% - 12px)/2))',
          gridTemplateAreas: '\'img1 img1\'\'img1 img1\'\'img1 img1\'\'img1 img1\'\'img1 img1\'\'img1 img1\'\'. .\'\'. .\'\'img2 img3\'',
        },
      },
      children: [
        gridImgBox({
          style: {
            gridArea: 'img1',
            height: '0',
            paddingBottom: getPercentage(407 / 228),
            marginBottom: getPercentage(10 / 228),
          },
          mobile: {
            style: {
              gridArea: 'img1',
              height: '0',
              paddingBottom: getPercentage(407 / 228),
              backgroundColor: '#ffffff',
            },
          },
        }, 'imgUrl1'),
        gridImgBox({
          style: {
            gridArea: 'img2',
            height: '0',
            paddingBottom: getPercentage(129 / 228),
            marginBottom: getPercentage(10 / 228),
          },
          mobile: {
            style: {
              gridArea: 'img2',
              height: '0',
              paddingBottom: getPercentage(129 / 228),
              backgroundColor: '#ffffff',
            },
          },
        }, 'imgUrl2'),
        gridImgBox({
          style: {
            gridArea: 'img3',
            height: '0',
            paddingBottom: getPercentage(129 / 228),
            marginBottom: getPercentage(10 / 228),
          },
          mobile: {
            style: {
              gridArea: 'img3',
              height: '0',
              paddingBottom: getPercentage(129 / 228),
              backgroundColor: '#ffffff',
            },
          },
        }, 'imgUrl3'),
        ...Array.from({ length: 11 }).map((e, i) => (moduleInnerBox1(`materialsIds[${i}]`, {
          gridRow: 'auto / span 2',
        }))),
      ],
    },
    // ],
    // },

  ],
});

export default module;
