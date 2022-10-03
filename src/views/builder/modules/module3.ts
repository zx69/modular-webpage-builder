
const module = () => ({
  type: 'module',
  index: 1,
  aspectRadio: '44.26%',
  data: {
    // eslint-disable-next-line max-len
    backgroundImage: `${process.env.BASE_URL}mock/preset-image/d8df0fa3f51f0c955b3e6e0431be098ac23de4211a804-t7gAZ0_fw658.png`,
    title: '2022秋冬新时尚',
    desc: 'Fashion style for fall/winter 2022',
  },
  class: 'fixed-aspect-radio-box',
  style: {
    paddingBottom: '44.26%',
    // marginBottom: '16px',
  },
  mobile: {
    style: {
      paddingBottom: '44.26%',
      // marginBottom: '16px',
      borderRadius: '8px',
      overflow: 'hidden',
    },
  },
  children: [
    {
      type: 'component',
      component: 'ImageBox',
      props: {
        valueKey: 'backgroundImage',
        imageType: 'image',
      },
      class: 'flex-center',
      style: {
        justifyContent: 'flex-end',
      },
    },
    {
      type: 'block',
      style: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        width: '36%',
        left: 'unset',
        right: '4%',
      },
      children: [
        {
          type: 'component',
          style: {
            color: '#48484d',
            fontSize: '50px',
            fontWeight: 'bold',
            lineHeight: '1.2',
            marginBottom: '4.69%',
          },
          mobile: {
            props: {
              valueKey: 'title',
              mobileSizeRadio: 16 / 50,
              overflowLine: 2,
            },
          },
          // class: 'over-text-2',
          component: 'InputableText',
          props: {
            valueKey: 'title',
            overflowLine: 2,
          },
        },
        {
          type: 'component',
          style: {
            color: '#7E7E7E',
            fontSize: '24px',
          },
          mobile: {
            props: {
              valueKey: 'desc',
              mobileSizeRadio: 10 / 24,
              overflowLine: 2,
            },
          },
          // class: 'over-text-2',
          component: 'InputableText',
          props: {
            valueKey: 'desc',
            overflowLine: 2,
          },
        },
      ],
    },
  ],
});

export default module;
