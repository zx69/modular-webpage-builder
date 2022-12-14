import { getPercentage } from '@/utils/style';
import { headerSection, moduleInnerBox1 } from './common';

const module = () => ({
  type: 'module',
  index: 7,
  aspectRadio: '65.99%',
  data: {
    title: '主题1',
    desc: 'description text',
    titleTag: 'ASIDE TAG',
    materialsIds: Array.from({ length: 10 }).map(e => ''),
  },
  class: 'module-beside-gap',
  children: [
    headerSection(false),
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
