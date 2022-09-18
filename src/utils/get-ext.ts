
const rExt = /\.\w+$/;


/**
 * 获取目标的后缀名
 * @param target
 */
export function getExt(target: string | File) {
  let file: File | undefined;
  let name: string | undefined;
  if (target instanceof File) {
    file = target;
    ({ name } = target);
  } else {
    name = target;
  }

  if (name) {
    const extIndex = name.search(rExt);
    if (extIndex !== -1) {
      return name.substring(extIndex + 1);
    }
  }

  if (file) {
    const mime = file.type;
    if (mime) {
      return mime.split('/')[1];
    }
  }
  return '';
}

export default getExt;
