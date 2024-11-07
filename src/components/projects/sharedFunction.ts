import { IFileContent } from '@/context/ProjectProvider';

export const convertFilesToBase64 = (files: File[]) => {
  const promises = files.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>
        resolve({
          fileName: file.name,
          fileContent: replaceBase64(reader.result as string),
          contentType: file.type,
          isLocal: true,
        });
      reader.onerror = reject;
    });
  });

  return Promise.all(promises) as Promise<IFileContent[]>;
};

const replaceBase64 = (base64: string) => {
  const newstr = base64.replace(/^data:[^;]+;base64,/, '');
  return newstr;
};
