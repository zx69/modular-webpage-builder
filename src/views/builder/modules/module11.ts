import { getPercentage } from '@/utils/style';
import { headerSection, moduleInnerBox1 } from './common';


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


const module = () => ({
  type: 'module',
  index: 9,
  aspectRadio: '86.7%',
  data: {
    title: '主题1',
    desc: 'description text',
    titleTag: 'ASIDE TAG',
    materialsIds: Array.from({ length: 11 }).map(e => ''),
    imgUrl1: 'https://gd-hbimg.huaban.com/f20add52e899540fd8ad54ebfdf7b688bf279da59c788-CWfo1J_fw658',
    imgUrl2: 'https://gd-hbimg.huaban.com/70c8268f5f4a3d39ef8f8097e5eb01922531f03369e3f-mRmd9D_fw658',
    imgUrl3: 'https://gd-hbimg.huaban.com/3bd54fdfe60c5823b4e3e03681a6d73b55bc0d67344511-18ODjf_fw658',
  },
  class: 'module-beside-gap',
  children: [
    headerSection(false),
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
