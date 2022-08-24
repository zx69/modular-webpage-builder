import { getPercentage } from '@/utils/style';
import { headerSection, moduleInnerBox1, materialItemIds } from './common';

const module = (type: 'material-brochure' | 'merchant-homepage' = 'material-brochure') => ({
  type: 'module',
  index: 7,
  aspectRadio: '65.99%',
  data: {
    title: '材料系列名称',
    desc: 'Width：52” Gauge：0.8mm',
    titleTag: 'SD-13688',
    materialsIds: Array.from({ length: 10 }).map(e => materialItemIds()),
  },
  class: 'module-beside-gap',
  children: [
    headerSection(type, false),
    {
      type: 'block',
      style: {
        display: 'grid',
        gap: `30px ${getPercentage(30 / 1260)}`,
        gridTemplateColumns: `repeat(5, ${getPercentage((1 - 30 / 1260 * 4) / 5)})`,
        flex: '1',
      },
      mobile: {
        style: {
          display: 'grid',
          gap: '12px 12px',
          gridTemplateColumns: 'repeat(2, calc((100% - 12px)/2))',
        },
      },
      children: Array.from({ length: 10 }).map((e, i) => (moduleInnerBox1(`materialsIds[${i}]`))),
    },
  ],
});

export default module;
