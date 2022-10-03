
export const presetFontStyleMenuList = [
  {
    title: '正文',
    style: {
      fontSize: '28px',
      lineHeight: 1.5,
    },
  },
  {
    title: '一级标题',
    style: {
      fontSize: '72px',
      fontWeight: 'bold',
      lineHeight: 1.5,
    },
  },
  {
    title: '二级标题',
    style: {
      fontSize: '52px',
      fontWeight: 'bold',
      lineHeight: 1.5,
    },
  },
  {
    title: '三级标题',
    style: {
      fontSize: '40px',
      fontWeight: 'bold',
      lineHeight: 1.5,
    },
  },
  {
    title: '四级标题',
    style: {
      fontSize: '32px',
      // fontWeight: 500,
      lineHeight: 1.5,
    },
  },
];
export const fontTypeBtnsList = [
  {
    title: 'B',
    style: {
      fontWeight: 'bold',
    },
  },
  {
    title: 'I',
    style: {
      fontStyle: 'italic',
    },
  },
  {
    title: 'S',
    style: {
      textDecoration: 'line-through',
    },
  },
  {
    title: 'U',
    style: {
      textDecoration: 'underline',
    },
  },
  {
    title: 'A',
    style: {
      backgroundColor: '#9BEFE9',
    },
  },
];

export const textAlignBtnsList = [
  {
    icon: 'i-zuoduiqi',
    style: {
      textAlign: '',
    },
  },
  {
    icon: 'i-juzhongduiqi',
    style: {
      textAlign: 'center',
    },
  },
  {
    icon: 'i-youduiqi',
    style: {
      textAlign: 'right',
    },
  },
  {
    icon: 'i-zuoyouduiqi',
    style: {
      textAlign: 'justify',
    },
  },
];

export const fontFamilyList = [
  {
    title: '默认字体',
    value: '',
  },
  {
    title: '宋体',
    value: 'SimSun',
  },
  {
    title: '微软雅黑',
    value: 'Microsoft Yahei',
  },
  {
    title: '黑体',
    value: 'SimHei',
  },
  {
    title: 'Arial',
    value: 'Arial',
  },
  {
    title: 'Tahoma',
    value: 'Tahoma',
  },
  {
    title: 'Verdana',
    value: 'Verdana',
  },
];

export const fontSizeList = [72, 60, 52, 48, 40, 32, 28, 24, 18, 16, 14, 12].map(size => ({
  title: size,
  value: size,
}));
