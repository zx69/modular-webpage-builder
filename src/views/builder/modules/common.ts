import { getPercentage, getPx } from '@/utils/style';

export const headerSection = (withBacground = true) => ({
  type: 'block',
  style: {
    paddingBottom: '50px',
  },
  mobile: {
    style: {
      paddingLeft: '12px',
      paddingRight: '12px',
      paddingBottom: '20px',
      paddingTop: '20px',
      ...withBacground ? {
        backgroundColor: '#ffffff',
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
      } : {},
    },
  },
  children: [
    {
      type: 'block',
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      },
      children: [
        {
          type: 'component',
          component: 'InputableText',
          style: {
            fontSize: '36px',
            fontWeight: 'bold',
            flex: '1 1 auto',
          },
          mobile: {
            props: {
              valueKey: 'title',
              mobileSizeRadio: 0.5,
            },
          },
          props: {
            valueKey: 'title',
          },
        },
        {
          type: 'component',
          component: 'InputableText',
          style: {
            fontSize: '28px',
            lineHeight: '48px',
            padding: '0 20px',
            color: '#ffffff',
            backgroundColor: '#000000',
            flex: '0 0 auto',
            marginLeft: '20px',
            // width: '214px',
          },
          mobile: {
            style: {
              fontSize: '12px',
              lineHeight: '24px',
              padding: '0 16px',
              color: '#ffffff',
              backgroundColor: '#000000',
              flex: '0 0 auto',
              marginLeft: '20px',
              // width: '90px',
            },
          },
          props: {
            valueKey: 'titleTag',
          },
        },
      ].filter(Boolean),
    },
    {
      type: 'component',
      component: 'InputableText',
      style: {
        fontSize: '20px',
        color: '#666666',
        marginTop: '8px',
      },
      mobile: {
        style: {
          fontSize: '20px',
          color: '#666666',
        },
        props: {
          valueKey: 'desc',
          mobileSizeRadio: 12 / 20,
        },
      },
      props: {
        valueKey: 'desc',
      },
    },
  ].filter(Boolean),
});


export const moduleInnerBox1 = (valueKey: string, style = {}) => {
  return {
    type: 'component',
    component: 'ProductBox',
    props: {
      valueKey,
    },
    style,
  };
};


// iconfont
export const iconfontElem = (fontKey: string, appendStyle: Obj, operation: string | null = 'text') => {
  return {
    type: 'block',
    operation,
    class: `brochure-iconfont ${fontKey}`,
    style: {
      fontSize: '18px',
      color: '#ffffff',
      ...appendStyle,
    },
    mobile: {
      style: {
        ...appendStyle,
        fontSize: getPx(parseFloat(appendStyle.fontSize ?? '18px') * 0.22),
      },
    },
  };
};

// 装饰线1
export const decorateLine1 = (appendStyle: Obj) => {
  return {
    type: 'block',
    operation: 'text',
    class: 'flex-column',
    style: {
      width: '3px',
      border: '1px solid transparent', // 加透明边框使容易点选
      ...appendStyle,
    },
    children: [
      {
        type: 'block',
        style: {
          width: '100%',
          height: '50%',
          opacity: '0.5',
          backgroundColor: 'currentColor',
        },
      },
      {
        type: 'block',
        style: {
          width: '100%',
          height: '50%',
          backgroundColor: 'currentColor',
        },
      },
    ],
  };
};

export const capsuleTag = (valueKey: string, valueKey2: string, appendStyle: Obj) => {
  return {
    type: 'block',
    class: 'flex',
    operation: 'sharp',
    style: {
      color: '#db7226',
      border: '1px solid currentColor',
      backgroundColor: 'currentColor',
      alignSelf: 'flex-start',
      maxWidth: '100%',
      fontSize: '18px',
      ...appendStyle,
    },
    children: [
      {
        type: 'component',
        component: 'InputableText',
        style: {
          padding: '0 0.83em',
          lineHeight: '2.11',
          color: '#ffffff',
          maxWidth: '50%',
        },
        props: {
          valueKey,
        },
        mobile: {
          props: {
            valueKey,
            mobileSizeRadio: 19 / 78,
          },
        },
      },
      {
        type: 'component',
        component: 'InputableText',
        style: {
          padding: '0 0.83em',
          lineHeight: '2.11',
          color: '#666666',
          backgroundColor: '#ffffff',
          // maxWidth: '100%',
        },
        props: {
          valueKey: valueKey2,
        },
        mobile: {
          props: {
            valueKey: valueKey2,
            mobileSizeRadio: 19 / 78,
          },
        },
      },
    ],
  };
};

