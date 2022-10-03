import getExt from './get-ext';


export const validFile = (file: File | string, options: {types?: string[], maxSize?: number }) => {
  const ext = getExt(file).toLowerCase();
  const fileName = file instanceof File ? file.name : file;
  if (ext && options.types) {
    if (!options.types.some(_ext => _ext === ext)) {
      throw new Error(`文件${fileName}不是支持的文件类型`);
    }
  }
  if (options.maxSize && file instanceof File && file.size) {
    if (file.size > options.maxSize) {
      throw new Error(`文件大小不得超过${options.maxSize}`);
    }
  }
};

export default validFile;

export const validFiles = (files: (File | string)[], options: {types?: string[], maxSize?: number }) => {
  files.forEach((file) => {
    validFile(file, options);
  });
};
