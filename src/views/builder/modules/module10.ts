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
  index: 8,
  aspectRadio: '86.28%',
  data: {
    title: '主题1',
    desc: 'description text',
    titleTag: 'ASIDE TAG',
    materialsIds: Array.from({ length: 9 }).map(e => ''),
    imgUrl1: `${process.env.BASE_URL}mock/preset-image/fd14e8a677975411f376a8a06a03209778051ad312d137-mPnJ6p_fw658.png`,
    imgUrl2: `${process.env.BASE_URL}mock/preset-image/9eade61122ea1a4a26832ff1118601622ec379df27e72-b1FgQv_fw658.png`,
  },
  class: 'module-beside-gap',
  children: [
    headerSection(false),
    {
      type: 'block',
      style: {
        display: 'grid',
        gap: `7px ${getPercentage(30 / 1260)}`,
        gridTemplateColumns: `repeat(5, ${getPercentage((1 - 30 / 1260 * 4) / 5)})`,
        gridTemplateAreas: '\'. . img1 img1 .\'\'img2 img2 img1 img1 .\'\'. . . . .\'',
        // gridAutoRows: '33.33%',
      },
      mobile: {
        style: {
          display: 'grid',
          gap: '12px 12px',
          gridTemplateColumns: 'repeat(2, calc((100% - 12px)/2))',
          gridTemplateAreas: '\'. .\'\'img1 img1\'\'img1 img1\'\'. .\'\'img2 img2\'\'. .\'\'. .\'\'. .\'',
        },
      },
      children: [
        gridImgBox({
          style: {
            gridArea: 'img1',
            height: '0',
            paddingBottom: getPercentage(532 / 486),
            marginBottom: getPercentage(70 / 486),
          },
          mobile: {
            style: {
              gridArea: 'img1',
              height: '0',
              paddingBottom: getPercentage(532 / 486),
              backgroundColor: '#ffffff',
            },
          },
        }, 'imgUrl1'),
        gridImgBox({
          style: {
            gridArea: 'img2',
            height: '0',
            paddingBottom: getPercentage(230 / 486),
            marginBottom: getPercentage(70 / 486),
          },
          mobile: {
            style: {
              gridArea: 'img2',
              height: '0',
              paddingBottom: getPercentage(230 / 486),
              backgroundColor: '#ffffff',
            },
          },
        }, 'imgUrl2'),
        ...Array.from({ length: 9 }).map((e, i) => (moduleInnerBox1(`materialsIds[${i}]`))),
      ],
    },
  ],
});

export default module;
