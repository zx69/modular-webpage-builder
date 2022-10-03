/* eslint-disable import/prefer-default-export */
import { QRCodeCanvas } from '@cheprasov/qrcode';
import qs from 'query-string';

export const generateQRCode = async (qrcodeUrl: string, query?: Obj, config?: Obj) => {
  const defaultConfig = { size: 280 };
  config = { ...defaultConfig, ...config };
  const url = qs.stringifyUrl({
    url: qrcodeUrl,
    query: query ?? {},
  });
  console.log('二维码:', url);
  const qrCanvas = new QRCodeCanvas(url, config);
  const dataUrl = await qrCanvas.toDataUrl() as string;
  return dataUrl;
};
