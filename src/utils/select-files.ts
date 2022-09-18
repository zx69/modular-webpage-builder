
export type Options = { types?: string[], timeout?: number, folder?: boolean, noCancel?: boolean, multiple?: boolean };
const defaultOptions = {
  timeout: 2000, types: null, folder: false, noCancel: false, multiple: false,
};
function selectFiles(options?: { types?: string[], timeout?: number, folder?: boolean, noCancel?: boolean, multiple?: boolean }): Promise<File[]>;
function selectFiles(types?: string[], timeout?: number): Promise<File[]>;
function selectFiles(...args: any[]): Promise<File[]> {
  let options: Required<Options>;
  if (Array.isArray(args[0])) {
    options = {
      ...defaultOptions,
      types: args[0] ?? defaultOptions.types,
      timeout: args[1] ?? defaultOptions.timeout,
    };
  } else {
    options = {
      ...defaultOptions,
      ...args[0],
    };
  }
  const {
    types, timeout, folder, noCancel, multiple,
  } = options;
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  if (types) {
    fileInput.accept = types.map(e => `.${e}`).join(', ');
  }
  if (multiple) {
    fileInput.multiple = multiple;
  }
  if (folder) {
    // @ts-ignore
    fileInput.webkitdirectory = true;
  }
  fileInput.style.display = 'none';
  fileInput.click();
  document.body.appendChild(fileInput);

  return new Promise<File[]>((resolve, reject) => {
    let cancel: ((..._args: any[]) => any) | null = null;
    // eslint-disable-next-line prefer-const
    let confirm: ((..._args: any[]) => any);
    let unbind: ((..._args: any[]) => any) | null = () => {
      if (cancel) {
        window.removeEventListener('focus', cancel);
      }
      fileInput.removeEventListener('change', confirm);
      document.body.removeChild(fileInput);
      unbind = null;
    };
    if (!noCancel) {
      cancel = async () => {
        setTimeout(() => {
          reject();
          unbind?.();
        }, timeout);
      };
    }
    confirm = async () => {
      resolve([...fileInput.files!]);
      unbind?.();
    };
    if (cancel) {
      window.addEventListener('focus', cancel);
    }
    fileInput.addEventListener('change', confirm);
  });
}
export default selectFiles;
