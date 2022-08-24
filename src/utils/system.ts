/* eslint-disable import/prefer-default-export */

export const getIsMobile = () => {
  const mobileKeys = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  const { userAgent } = navigator;
  return mobileKeys.some((key) => {
    return userAgent.includes(key);
  });
};

export const getPlatform = () => {
  const _isMobile = getIsMobile();
  const _isWxMP = navigator.userAgent.includes('miniProgram');

  return _isWxMP ? 'mp' : _isMobile ? 'h5' : 'pc';
};
